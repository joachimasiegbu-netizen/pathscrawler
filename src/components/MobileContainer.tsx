import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fullBleed?: boolean;
  /** Forces the dark background regardless of the site's own light/dark
   * toggle - Roll a Job (App.tsx) uses this for its fixed "game mode" dark
   * page. Without it, THIS div's own bg-background/dark:bg-background-dark
   * (tied to the real toggle) painted over App.tsx's own already-forced-dark
   * outer div, leaving a light strip behind the header on that page
   * whenever the user's actual toggle was off - confirmed via a real
   * rendered screenshot, not eyeballed. */
  forceDarkBg?: boolean;
}

export default function MobileContainer({ children, fullBleed = false, forceDarkBg = false }: Props) {
  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        forceDarkBg ? 'bg-background-dark' : 'bg-background dark:bg-background-dark'
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
