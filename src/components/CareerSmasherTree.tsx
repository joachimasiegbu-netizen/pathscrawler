import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Hammer, Link2 } from 'lucide-react'
import type { Career } from '../data/demoCareers'
import {
  MAX_CHILDREN,
  MAX_DEPTH,
  getCareersForSkill,
  getCategoryColor,
  getSkillsExcluding,
  type TreeNodeData,
} from '../utils/skillTree'
import { usePathStore } from '../store/usePathStore'

// ---- Layout constants -------------------------------------------------
// Slot widths are per-node "reserved lane" widths, not the rendered circle
// size itself (see the *_SIZE constants below, used for the actual visual
// diameter) - a lane needs to be wider than the circle so siblings don't
// visually touch.
const SKILL_SLOT_WIDTH = 108
const JOB_SLOT_WIDTH = 152
const NODE_GAP = 14
const LEVEL_HEIGHT = 128
const ROOT_SIZE_W = 220
const ROOT_SIZE_H = 64
const JOB_SIZE = 84
const SKILL_SIZE = 62
// How long a node's brief "just expanded" pulse (scale 1 -> 1.1 -> 1) lasts,
// and how much each sibling's entrance animation is staggered behind the one
// before it.
const PULSE_MS = 200
const STAGGER_SECONDS = 0.08

type EmptyNodeData = { type: 'empty'; reason: string }
type AnyNodeData = TreeNodeData | EmptyNodeData

interface VisibleNode {
  path: string
  data: AnyNodeData
  depth: number
  children: VisibleNode[]
  width: number
  x: number
  y: number
  /** Position among its own siblings - drives the entrance stagger delay. */
  siblingIndex: number
}

// Materializes only the CURRENTLY EXPANDED part of the (conceptually
// infinite - every job has skills, every skill has jobs) tree, driven by
// `expandedPaths`. ancestorCareerIds/ancestorSkills walk down with the
// recursion so a branch can never lead back to a career or skill that's
// already one of its own ancestors (the real cycle-prevention; MAX_DEPTH
// below is just the hard backstop the brief also asked for).
function buildVisibleTree(
  data: TreeNodeData,
  path: string,
  depth: number,
  ancestorCareerIds: Set<number>,
  ancestorSkills: Set<string>,
  expandedPaths: Set<string>,
  siblingIndex = 0,
): VisibleNode {
  const node: VisibleNode = { path, data, depth, children: [], width: 0, x: 0, y: 0, siblingIndex }
  const isExpanded = expandedPaths.has(path)
  if (!isExpanded || depth >= MAX_DEPTH) return node

  if (data.type === 'job') {
    const nextAncestorCareerIds = new Set(ancestorCareerIds)
    nextAncestorCareerIds.add(data.career.id)
    const skills = getSkillsExcluding(data.career.id, ancestorSkills)
    node.children = skills.map((skill, index) =>
      buildVisibleTree(
        { type: 'skill', name: skill },
        `${path}>skill:${skill}`,
        depth + 1,
        nextAncestorCareerIds,
        ancestorSkills,
        expandedPaths,
        index,
      ),
    )
    if (node.children.length === 0) {
      node.children = [{ path: `${path}>empty`, data: { type: 'empty', reason: 'No skill data yet' }, depth: depth + 1, children: [], width: 0, x: 0, y: 0, siblingIndex: 0 }]
    }
  } else {
    const nextAncestorSkills = new Set(ancestorSkills)
    nextAncestorSkills.add(data.name)
    const careers = getCareersForSkill(data.name, ancestorCareerIds)
    node.children = careers.map((career, index) =>
      buildVisibleTree(
        { type: 'job', career },
        `${path}>job:${career.id}`,
        depth + 1,
        ancestorCareerIds,
        nextAncestorSkills,
        expandedPaths,
        index,
      ),
    )
    if (node.children.length === 0) {
      node.children = [{ path: `${path}>empty`, data: { type: 'empty', reason: 'No related careers found' }, depth: depth + 1, children: [], width: 0, x: 0, y: 0, siblingIndex: 0 }]
    }
  }
  return node
}

function slotWidth(data: AnyNodeData): number {
  return data.type === 'job' ? JOB_SLOT_WIDTH : SKILL_SLOT_WIDTH
}

// Bottom-up: every node's width is at least its own slot, or the combined
// width of its children if that's wider (a job with 5 skill children needs
// to be as wide as those 5 children laid out side by side, not just its
// own 152px).
function computeWidths(node: VisibleNode): void {
  if (node.children.length === 0) {
    node.width = slotWidth(node.data)
    return
  }
  node.children.forEach(computeWidths)
  const childrenWidth = node.children.reduce((sum, child) => sum + child.width, 0) + NODE_GAP * (node.children.length - 1)
  node.width = Math.max(slotWidth(node.data), childrenWidth)
}

// Top-down: children are centered as a group under their parent, each
// child centered within its own reserved width - the standard
// "reserve subtree width, then center" tree-layout trick, just without a
// general-purpose library since the shape here (alternating job/skill,
// capped depth/fan-out) is simple enough to hand-roll.
function assignPositions(node: VisibleNode, leftEdge: number): void {
  node.y = node.depth * LEVEL_HEIGHT
  node.x = leftEdge + node.width / 2
  if (node.children.length === 0) return
  const childrenWidth = node.children.reduce((sum, child) => sum + child.width, 0) + NODE_GAP * (node.children.length - 1)
  let cursor = leftEdge + (node.width - childrenWidth) / 2
  for (const child of node.children) {
    assignPositions(child, cursor)
    cursor += child.width + NODE_GAP
  }
}

function flatten(node: VisibleNode, acc: VisibleNode[] = []): VisibleNode[] {
  acc.push(node)
  node.children.forEach((child) => flatten(child, acc))
  return acc
}

interface CareerSmasherTreeProps {
  rootCareer: Career
  /** Bumped by the parent's "Reset tree" button - collapses everything back
   * to just the root by resetting expandedPaths, without needing the
   * parent to reach into this component's own state directly. */
  resetToken: number
}

export default function CareerSmasherTree({ rootCareer, resetToken }: CareerSmasherTreeProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  // The path of the node that was just clicked to expand - briefly pulses
  // (see PULSE_MS) before clearing itself back to null. Only set on
  // expansion, not on collapse - a node scaling down on collapse already
  // reads as "closing", it doesn't also need a pulse first.
  const [pulsingPath, setPulsingPath] = useState<string | null>(null)
  const pulseTimeoutRef = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startX: number; startY: number; scrollLeft: number; scrollTop: number } | null>(null)

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current)
    }
  }, [])

  // resetToken changing (not its value) is the signal - same "parent bumps a
  // counter, child reacts in an effect" pattern SlotMachineLane.tsx uses for
  // spinToken. This has to run in a real effect, not as a ref comparison
  // during render: mutating a ref mid-render is unsafe under StrictMode's
  // double-invoked dev render (the discarded first pass already advances the
  // ref, so the real committed pass sees no change and silently skips the
  // reset).
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setExpandedPaths(new Set())
  }, [resetToken])

  const toggle = (path: string) => {
    const isExpanding = !expandedPaths.has(path)
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
    if (isExpanding) {
      setPulsingPath(path)
      if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current)
      pulseTimeoutRef.current = window.setTimeout(() => setPulsingPath(null), PULSE_MS)
    }
  }

  const { nodes, connectors, canvasWidth, canvasHeight } = useMemo(() => {
    const root = buildVisibleTree({ type: 'job', career: rootCareer }, 'root', 0, new Set(), new Set(), expandedPaths)
    computeWidths(root)
    assignPositions(root, 0)
    const flat = flatten(root)
    const lines: { key: string; x1: number; y1: number; x2: number; y2: number }[] = []
    for (const node of flat) {
      for (const child of node.children) {
        lines.push({ key: `${node.path}->${child.path}`, x1: node.x, y1: node.y, x2: child.x, y2: child.y })
      }
    }
    const maxDepth = flat.reduce((max, n) => Math.max(max, n.depth), 0)
    return {
      nodes: flat,
      connectors: lines,
      canvasWidth: Math.max(root.width, 320),
      canvasHeight: maxDepth * LEVEL_HEIGHT + JOB_SIZE + 40,
    }
  }, [rootCareer, expandedPaths])

  // Desktop mouse-drag-to-pan ("like a map") - touch devices already pan
  // natively via the container's own overflow-auto scrolling, so this only
  // wires up mouse events, not touch ones.
  const handleMouseDown = (event: ReactMouseEvent) => {
    if (!scrollRef.current) return
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop,
    }
  }
  const handleMouseMove = (event: ReactMouseEvent) => {
    if (!dragState.current || !scrollRef.current) return
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.startX)
    scrollRef.current.scrollTop = dragState.current.scrollTop - (event.clientY - dragState.current.startY)
  }
  const endDrag = () => {
    dragState.current = null
  }

  return (
    <div
      ref={scrollRef}
      className="relative w-full cursor-grab overflow-auto rounded-3xl border border-slate-200 bg-slate-50 active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900/40"
      style={{ height: 'min(70vh, 640px)' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <div className="relative" style={{ width: canvasWidth, height: canvasHeight, minWidth: '100%' }}>
        <svg className="pointer-events-none absolute inset-0" width={canvasWidth} height={canvasHeight} aria-hidden="true">
          <AnimatePresence>
            {connectors.map((line) => (
              <motion.line
                key={line.key}
                x1={line.x1}
                y1={line.y1 + 20}
                x2={line.x2}
                y2={line.y2 - 20}
                stroke="currentColor"
                strokeWidth={2}
                className="text-slate-300 dark:text-slate-700"
                initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
        </svg>

        <AnimatePresence>
          {nodes.map((node) => (
            <TreeNodeView
              key={node.path}
              node={node}
              isExpanded={expandedPaths.has(node.path)}
              isPulsing={node.path === pulsingPath}
              reduceMotion={reduceMotion}
              onToggle={() => toggle(node.path)}
              onViewCareer={(careerId) => navigate(`/career/${careerId}`)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TreeNodeView({
  node,
  isExpanded,
  isPulsing,
  reduceMotion,
  onToggle,
  onViewCareer,
}: {
  node: VisibleNode
  isExpanded: boolean
  isPulsing: boolean
  reduceMotion: boolean
  onToggle: () => void
  onViewCareer: (careerId: number) => void
}) {
  const { data, depth, x, y, siblingIndex } = node
  const canExpand = depth < MAX_DEPTH

  // Entrance staggers by sibling position and overshoots slightly on the
  // way in (a spring naturally settles past its target before easing back,
  // which reads as the "scale 0 -> 1.1 -> 1" bounce); collapse/exit is a
  // plain, un-staggered 200ms fade+shrink so a whole branch retracts as one
  // snappy unit instead of trailing out one node at a time. isPulsing feeds
  // the SAME "visible" state a currently-mounted node re-animates through
  // when its own expand click briefly bumps its scale past 1 and back.
  const variants = {
    hidden: { opacity: 0, scale: 0, y: 20 },
    visible: {
      opacity: 1,
      scale: isPulsing ? 1.15 : 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 18, delay: siblingIndex * STAGGER_SECONDS },
    },
    exit: { opacity: 0, scale: 0, y: 20, transition: { duration: 0.2, ease: 'easeIn' as const } },
  }
  const motionProps = reduceMotion ? {} : { variants, initial: 'hidden', animate: 'visible', exit: 'exit' }

  if (data.type === 'empty') {
    return (
      <motion.div
        {...motionProps}
        style={{ left: x, top: y, width: SKILL_SIZE, height: SKILL_SIZE }}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-slate-300 p-2 text-center text-[10px] leading-tight text-slate-400 dark:border-slate-600 dark:text-slate-500"
      >
        {data.reason}
      </motion.div>
    )
  }

  if (data.type === 'skill') {
    return (
      <motion.button
        type="button"
        {...motionProps}
        onClick={canExpand ? onToggle : undefined}
        disabled={!canExpand}
        aria-pressed={isExpanded}
        aria-label={`${data.name} skill${canExpand ? ' - tap to see related careers' : ''}`}
        style={{ left: x, top: y, width: SKILL_SIZE, height: SKILL_SIZE }}
        className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 p-1.5 text-center text-[11px] font-semibold leading-tight text-slate-700 shadow-sm transition-all duration-150 dark:text-slate-200 ${
          isExpanded ? 'border-accent bg-accent/10 ring-4 ring-accent/40' : 'border-slate-300 bg-slate-100 hover:scale-105 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800'
        } ${canExpand ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
      >
        {data.name}
      </motion.button>
    )
  }

  // Job node (root at depth 0, or a related job reached via a skill at
  // depth 2/4). Two independent actions once past the root: the node's own
  // body always opens the full career page, the hammer badge is the only
  // thing that smashes/un-smashes it - so an already-expanded branch can
  // still be browsed into without accidentally collapsing it, and vice
  // versa. The root has no "view details" page distinct from the smasher
  // it's already the subject of, so its body still just toggles.
  const isRoot = depth === 0
  const theme = getCategoryColor(data.career.category)
  const size = isRoot ? undefined : JOB_SIZE
  const showViewHint = !isRoot && !canExpand

  const handleBodyClick = () => {
    if (isRoot) onToggle()
    else onViewCareer(data.career.id)
  }
  const handleHammerClick = (event: ReactMouseEvent) => {
    event.stopPropagation()
    onToggle()
  }

  return (
    <motion.div
      {...motionProps}
      style={{ left: x, top: y, width: isRoot ? ROOT_SIZE_W : size, height: isRoot ? ROOT_SIZE_H : size }}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
    >
      <button
        type="button"
        onClick={handleBodyClick}
        aria-pressed={isRoot ? isExpanded : undefined}
        aria-label={
          isRoot
            ? `${data.career.title} - tap to smash into skills`
            : `${data.career.title}, ${data.career.salary} - tap to view career details`
        }
        className={
          isRoot
            ? `flex h-full w-full items-center justify-center rounded-full px-6 text-center text-base font-extrabold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl ${theme.solid} ${
                isExpanded ? 'ring-4 ring-white/70' : ''
              }`
            : `flex h-full w-full flex-col items-center justify-center rounded-full border-2 bg-white p-2 text-center shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg dark:bg-slate-800 ${theme.border} ${
                isExpanded ? `ring-4 ${theme.ring}` : ''
              }`
        }
      >
        {isRoot ? (
          <span className="line-clamp-2">{data.career.title}</span>
        ) : (
          <>
            <span className="line-clamp-2 text-xs font-bold leading-tight text-slate-950 dark:text-slate-50">{data.career.title}</span>
            <span className="mt-0.5 text-[9px] font-semibold text-slate-500 dark:text-slate-400">{data.career.salary}</span>
          </>
        )}
      </button>

      {/* "Related" badge - every non-root job node was reached by clicking
          a skill, so it's always here via a shared skill rather than being
          the thing the tree started from. Purely informational, sits
          opposite the hammer badge so the two never overlap. */}
      {!isRoot ? (
        <span
          className="pointer-events-none absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-white shadow dark:bg-slate-600"
          aria-hidden="true"
          title="Related via a shared skill"
        >
          <Link2 className="h-2.5 w-2.5" />
        </span>
      ) : null}

      {/* Hammer smash button - a real, independently-clickable control (not
          just decorative), so it can toggle expand/collapse without also
          triggering the body's "view career" navigation. Always visible
          (not hover-gated) since a hover-only reveal never shows up for
          touch/mobile users, who'd otherwise have no way to find it. */}
      {canExpand ? (
        <button
          type="button"
          onClick={handleHammerClick}
          aria-label={isExpanded ? `Collapse ${data.career.title}'s skills` : `Smash ${data.career.title} into skills`}
          className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-orange text-white shadow-md transition-all duration-200 hover:scale-110 hover:rotate-12"
        >
          <Hammer className="h-3.5 w-3.5" />
        </button>
      ) : null}

      {/* Max depth reached - nothing left to smash into, so the hammer is
          replaced with a plain hint pointing at the body's own click
          behaviour instead of leaving an empty corner. */}
      {showViewHint ? (
        <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold text-slate-400 dark:text-slate-500">
          View career →
        </span>
      ) : null}
    </motion.div>
  )
}
