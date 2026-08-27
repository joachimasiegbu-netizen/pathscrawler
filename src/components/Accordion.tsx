import { useId, useState, type ReactNode } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'

export interface AccordionItemData {
  id: string
  icon?: LucideIcon
  title: string
  /** Short line under the title, always visible. */
  teaser?: string
  body: ReactNode
}

function AccordionItem({ item, defaultOpen }: { item: AccordionItemData; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const Icon = item.icon

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
      >
        {Icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-slate-900 dark:text-white sm:text-base">{item.title}</span>
          {item.teaser ? <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{item.teaser}</span> : null}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div id={panelId} className="border-t border-slate-100 px-4 pb-4 pt-3 text-[15px] leading-7 text-slate-600 dark:border-slate-700 dark:text-slate-300 sm:text-base">
          {item.body}
        </div>
      ) : null}
    </div>
  )
}

export default function Accordion({ items, defaultOpenId }: { items: AccordionItemData[]; defaultOpenId?: string }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <AccordionItem key={item.id} item={item} defaultOpen={item.id === defaultOpenId} />
      ))}
    </div>
  )
}
