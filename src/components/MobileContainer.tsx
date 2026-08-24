import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fullBleed?: boolean;
  /** Forces the dark "game mode" background regardless of the site's own
   * light/dark toggle - Roll a Job/Leaderboard/the Mythic preview (App.tsx)
   * use this. This div spans the true full viewport width (it's what sits
   * BEHIND the header, and beside the centered max-w-5xl content column at
   * wide viewports), so painting the same radial gradient those pages'
   * own full-bleed content div uses - not a flat color - here too is what
   * makes the header and page margins read as part of the same scene
   * instead of a flat-colored band sitting above/beside it. bg-fixed
   * (viewport-anchored, not scroll/element-anchored) is what keeps this
   * layer and each page's own gradient div perfectly aligned - both need
   * bg-fixed for that, see JobMarketRollPage.tsx/LeaderboardPage.tsx/
   * MythicRevealPreviewPage.tsx's own gradient classes. Without it, THIS
   * div's own bg-background/dark:bg-background-dark (tied to the real
   * toggle) painted over App.tsx's own already-forced-dark outer div,
   * leaving a light strip behind the header on that page whenever the
   * user's actual toggle was off - confirmed via a real rendered
   * screenshot, not eyeballed. */
  forceDarkBg?: boolean;
}

export default function MobileContainer({ children, fullBleed = false, forceDarkBg = false }: Props) {
  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        forceDarkBg
          ? 'bg-fixed bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black'
          : 'bg-background dark:bg-background-dark'
      }`}
    >
      <div
        className={
          fullBleed
            ? "w-full min-h-screen relative overflow-visible"
            : "mx-auto w-full max-w-5xl min-h-screen relative overflow-visible"
        }
      >
        {children}
      </div>
    </div>
  );
}
