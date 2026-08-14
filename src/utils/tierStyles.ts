import type { TierKey } from './careerTiers'

export type TierEffect = 'none' | 'shimmer-border' | 'rotating-border' | 'sparkle' | 'holographic' | 'obsidian'
export type TierParticles = 'none' | 'icy' | 'smoke'

export interface TierStyle {
  badgeBg: string
  badgeText: string
  cardBorder: string
  cardTint: string
  glow: string
  confettiColors: string[]
  confettiCount: number
  confettiDurationMs: number
  shimmer: boolean
  flashText: string | null
  flashTextClass: string
  dramatic: boolean
  /** "R, G, B" - used to build dynamic multi-layer box-shadow / conic-gradient colors CSS classes can't parametrize. */
  glowRgb: string
  /** Full (all-sides) border color class - the collectible-card frame, replacing the old border-l-4 accent stripe. */
  borderColorClass: string
  /** Salary text fill - solid for Common/Uncommon, metallic gradient for Rare (silver) and Epic+ (gold). */
  salaryTextClass: string
  /** Which per-tier decorative layer CardEffects/RollResultCard renders. */
  effect: TierEffect
  particles: TierParticles
  /** Saturated gradient + white(-ish) text for the Binder card tile's flip
   * "back" face (see BinderCardTile.tsx/.binder-card-flip in index.css) -
   * same hue family as this tier's badge/border, just filled solid instead
   * of tinted, mirroring the light-front/saturated-back contrast a
   * physical foil trading card has. */
  flipBackClass: string
}

// Rare/Epic+ reuse Tailwind shades already carved out for dark mode
// elsewhere in this app (purple/blue/emerald/amber -100/-400 - see
// index.css's html.dark-mode overrides) rather than introducing new ones.
// Legendary uses the app's own `accent` brand token instead of a stock
// cyan, since custom color tokens aren't touched by that override system
// at all - nothing to fight. Mythic is intentionally theme-independent
// (same near-black/gold look in light and dark) so it skips dark: entirely
// - and stays gold rather than the brief's alternate "pulsing red", to
// keep the identity it was already given in earlier passes (obsidian +
// gold, not obsidian + red).
export const TIER_STYLES: Record<TierKey, TierStyle> = {
  common: {
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950',
    badgeText: 'text-emerald-800 dark:text-emerald-400',
    cardBorder: 'border-l-emerald-500',
    cardTint: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    glow: 'shadow-lg shadow-emerald-200/40 dark:shadow-emerald-950/40',
    confettiColors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
    confettiCount: 24,
    confettiDurationMs: 1100,
    shimmer: false,
    flashText: null,
    flashTextClass: '',
    dramatic: false,
    glowRgb: '16, 185, 129',
    borderColorClass: 'border-emerald-500',
    salaryTextClass: 'text-emerald-700 dark:text-emerald-400',
    effect: 'none',
    particles: 'none',
    flipBackClass: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white',
  },
  uncommon: {
    badgeBg: 'bg-blue-100 dark:bg-blue-950',
    badgeText: 'text-blue-800 dark:text-blue-400',
    cardBorder: 'border-l-blue-500',
    cardTint: 'bg-blue-50/60 dark:bg-blue-950/20',
    glow: 'shadow-lg shadow-blue-200/40 dark:shadow-blue-950/40',
    confettiColors: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
    confettiCount: 28,
    confettiDurationMs: 1200,
    shimmer: false,
    flashText: null,
    flashTextClass: '',
    dramatic: false,
    glowRgb: '59, 130, 246',
    borderColorClass: 'border-blue-500',
    salaryTextClass: 'text-blue-700 dark:text-blue-400',
    effect: 'shimmer-border',
    particles: 'none',
    flipBackClass: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
  },
  rare: {
    badgeBg: 'bg-purple-100 dark:bg-purple-950',
    badgeText: 'text-purple-800 dark:text-purple-400',
    cardBorder: 'border-l-purple-500',
    cardTint: 'bg-purple-50/60 dark:bg-purple-950/20',
    glow: 'shadow-xl shadow-purple-300/50 dark:shadow-purple-950/50',
    confettiColors: ['#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF'],
    confettiCount: 32,
    confettiDurationMs: 1300,
    shimmer: false,
    flashText: null,
    flashTextClass: '',
    dramatic: false,
    glowRgb: '168, 85, 247',
    borderColorClass: 'border-purple-500',
    // "Silver" per the brief - a metallic gray gradient, deliberately not purple.
    salaryTextClass: 'bg-gradient-to-b from-slate-300 via-slate-500 to-slate-400 bg-clip-text text-transparent',
    effect: 'rotating-border',
    particles: 'none',
    flipBackClass: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
  },
  epic: {
    badgeBg: 'bg-amber-100 dark:bg-amber-950',
    badgeText: 'text-amber-800 dark:text-amber-400',
    cardBorder: 'border-l-amber-500',
    cardTint: 'bg-amber-50/70 dark:bg-amber-950/25',
    glow: 'shadow-xl shadow-amber-300/60 dark:shadow-amber-950/60',
    confettiColors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
    confettiCount: 42,
    confettiDurationMs: 1800,
    shimmer: true,
    flashText: '✨ EPIC ROLL!',
    flashTextClass: 'text-amber-600 dark:text-amber-400',
    dramatic: false,
    glowRgb: '245, 158, 11',
    borderColorClass: 'border-amber-500',
    salaryTextClass: 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent',
    effect: 'sparkle',
    particles: 'none',
    flipBackClass: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white',
  },
  legendary: {
    badgeBg: 'bg-accent/15',
    badgeText: 'text-accent-dark dark:text-accent',
    cardBorder: 'border-l-accent',
    cardTint: 'bg-accent/5',
    glow: 'shadow-2xl shadow-accent/50',
    confettiColors: ['#06B6D4', '#67E8F9', '#A5F3FC', '#FFFFFF'],
    confettiCount: 52,
    confettiDurationMs: 2000,
    shimmer: true,
    flashText: '💎 LEGENDARY ROLL!',
    flashTextClass: 'text-accent-dark dark:text-accent',
    dramatic: false,
    glowRgb: '6, 182, 212',
    borderColorClass: 'border-accent',
    salaryTextClass: 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent',
    effect: 'holographic',
    particles: 'icy',
    flipBackClass: 'bg-gradient-to-br from-accent to-accent-dark text-white',
  },
  mythic: {
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-400',
    cardBorder: 'border-l-amber-500',
    cardTint: 'bg-slate-950',
    glow: 'shadow-2xl shadow-amber-500/60',
    confettiColors: ['#0F172A', '#1E293B', '#F59E0B', '#FBBF24', '#FDE68A'],
    confettiCount: 64,
    confettiDurationMs: 2200,
    shimmer: true,
    flashText: '🔥 MYTHIC ROLL!',
    flashTextClass: 'text-amber-400',
    dramatic: true,
    glowRgb: '245, 158, 11',
    borderColorClass: 'border-amber-500',
    salaryTextClass: 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent',
    effect: 'obsidian',
    particles: 'smoke',
    // Black + gold, not a hue-matched gradient like the other tiers - keeps
    // Mythic's already-established obsidian/gold identity (see the file
    // banner comment above) instead of introducing a 7th color family.
    flipBackClass: 'bg-gradient-to-br from-slate-900 to-black text-amber-300',
  },
}

export function getTierStyle(tier: TierKey): TierStyle {
  return TIER_STYLES[tier]
}
