import { getTitleById } from '../utils/titles'

// The small coloured badge shown to the LEFT of a username wherever an
// equipped title appears (leaderboard rows, profile, Binder header, the roll
// page). Spec: pill background = title colour @ 15%, text = title colour @
// 100%, border = title colour @ 30%; 11px uppercase, weight 600. Renders
// nothing when there's no equipped title.
//
// '#ffffff' ("White + gold glow" - The Chosen One / Heaven's Descendant) is
// special-cased: a gold halo always, plus - on a light surface, where white
// text would vanish - the text drops to a dark slate so it stays readable
// (contrast >= 4.5:1). Every other colour in titles.ts already clears 4.5:1
// on the dark leaderboard it was chosen for.

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const int = parseInt(full, 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

/** WCAG relative luminance, 0 (black) - 1 (white). */
function luminance([r, g, b]: [number, number, number]): number {
  const chan = [r, g, b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2]
}

interface TitlePillProps {
  titleId: string | null | undefined
  /** Which surface the pill sits on. 'dark' (default) covers the leaderboard
   * and the always-dark roll page; 'light' is for the Binder header / profile
   * in the app's normal (toggleable) chrome. */
  tone?: 'dark' | 'light'
  className?: string
}

export default function TitlePill({ titleId, tone = 'dark', className = '' }: TitlePillProps) {
  const title = getTitleById(titleId)
  if (!title) return null

  const rgb = hexToRgb(title.color)
  const isNearWhite = luminance(rgb) > 0.85
  const [r, g, b] = rgb

  const textColor = isNearWhite && tone === 'light' ? '#334155' : title.color
  const glow = isNearWhite ? '0 0 10px rgba(251, 191, 36, 0.55)' : undefined

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-wide ${className}`}
      style={{
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
        borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
        color: textColor,
        boxShadow: glow,
      }}
      title={`${title.name} · ${title.difficulty}`}
    >
      {title.name}
    </span>
  )
}
