import type { ReactNode } from "react";

export function BlueprintLayer({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.16] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(43,48,48,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(43,48,48,.16) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}

export function TechnicalArc({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <div className="h-full w-full rounded-full border border-[#e36c2f]" />
      <span className="absolute left-[8%] top-[46%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e36c2f]" />
      <span className="absolute bottom-[15%] right-[16%] h-2 w-2 rounded-full bg-[#e36c2f]" />
    </div>
  );
}

export function MicroLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-[#68645e]">
      {children}
    </span>
  );
}

export const displayFont = "[font-family:'Arial_Narrow','Roboto_Condensed','Helvetica_Neue',Arial,sans-serif]";
