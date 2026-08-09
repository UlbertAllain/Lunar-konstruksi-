import type { ReactNode } from "react";

export function BlueprintLayer({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.11] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(43,48,48,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(43,48,48,.13) 1px, transparent 1px)",
        backgroundSize: "42px 42px",
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

export function MicroLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[8px] font-medium uppercase tracking-[0.16em] text-[#68645e] ${className}`}>
      {children}
    </span>
  );
}

export const displayFont =
  "[font-family:'Bahnschrift_Condensed','Arial_Narrow','Roboto_Condensed','Helvetica_Neue_Condensed',Arial,sans-serif] [font-stretch:condensed]";
