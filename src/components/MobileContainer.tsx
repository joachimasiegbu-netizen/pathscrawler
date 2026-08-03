import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function MobileContainer({ children }: Props) {
  return (
    <div className="min-h-screen w-full bg-[#E0E7FF]">
      <div className="w-full min-h-screen relative overflow-visible">
        {children}
      </div>
    </div>
  );
}