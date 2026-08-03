import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fullBleed?: boolean;
}

export default function MobileContainer({ children, fullBleed = false }: Props) {
  return (
    <div className="min-h-screen w-full bg-[#E0E7FF] dark:bg-slate-950">
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
