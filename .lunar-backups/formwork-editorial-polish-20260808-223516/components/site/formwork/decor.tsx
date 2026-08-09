import type { ReactNode } from "react";

export function BlueprintLayer({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity: 0.05,
        backgroundImage:
          "linear-gradient(rgba(39,46,47,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(39,46,47,.16) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,.84), rgba(0,0,0,.12) 74%, transparent 100%)",
      }}
    />
  );
}

export function HeroMeasureCurve({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 720 820" fill="none" className={`pointer-events-none absolute overflow-visible ${className}`}>
      <path d="M420 8C224 102 139 266 151 423C164 588 270 708 432 756C508 779 580 776 662 742" stroke="#E36C2F" strokeWidth="1.15" />
      <circle cx="167" cy="309" r="5" fill="#E36C2F" />
      <circle cx="404" cy="746" r="4.5" fill="#E36C2F" />
      <circle cx="603" cy="763" r="4" fill="#E36C2F" />
    </svg>
  );
}

export function TechnicalArc({ className = "" }: { className?: string }) {
  return <HeroMeasureCurve className={className} />;
}

export function ProcessGuide({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`}>
      <path d="M24 73C152 28 262 24 390 61C506 94 626 94 744 59C874 21 995 24 1177 72" stroke="#8E8A84" strokeWidth="1.1" fill="none" />
      {[118, 384, 739, 1088].map((cx) => (
        <circle key={cx} cx={cx} cy={cx === 384 || cx === 1088 ? 60 : 65} r="4.5" fill="#E36C2F" />
      ))}
    </svg>
  );
}

export function MicroLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className={`font-mono text-[9px] font-medium uppercase tracking-[0.18em] ${light ? "text-white/55" : "text-[#68645e]"}`}>
      {children}
    </span>
  );
}

export function TechnicalStamp({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex rotate-[-2deg] items-center border border-[#e36c2f]/65 px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[.14em] text-[#d85e25] ${className}`}>
      {children}
    </span>
  );
}

export function Crosshair({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative block h-7 w-7 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#e36c2f]/70" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#e36c2f]/70" />
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e36c2f]" />
    </span>
  );
}

export const displayFont = "[font-family:'Bahnschrift_Condensed','Aptos_Narrow','Arial_Narrow','Roboto_Condensed',sans-serif]";
