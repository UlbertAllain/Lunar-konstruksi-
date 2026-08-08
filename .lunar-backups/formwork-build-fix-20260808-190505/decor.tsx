import type { ReactNode } from "react";

export function BlueprintLayer({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity: 0.055,
        backgroundImage:
          "linear-gradient(rgba(39,46,47,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(39,46,47,.18) 1px, transparent 1px)",
        backgroundSize: "58px 58px",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,.9), rgba(0,0,0,.16) 72%, transparent 100%)",
      }}
    />
  );
}

export function HeroMeasureCurve({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 720 820"
      fill="none"
      className={`pointer-events-none absolute overflow-visible ${className}`}
    >
      <path
        d="M420 8C224 102 139 266 151 423C164 588 270 708 432 756C508 779 580 776 662 742"
        stroke="#E36C2F"
        strokeWidth="1.25"
      />
      <circle cx="167" cy="309" r="5.5" fill="#E36C2F" />
      <circle cx="404" cy="746" r="5" fill="#E36C2F" />
      <circle cx="603" cy="763" r="4.5" fill="#E36C2F" />
    </svg>
  );
}

export function ProcessGuide({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute ${className}`}
    >
      <path
        d="M24 73C152 28 262 24 390 61C506 94 626 94 744 59C874 21 995 24 1177 72"
        stroke="#8E8A84"
        strokeWidth="1.25"
        fill="none"
      />
      {[118, 384, 739, 1088].map((cx) => (
        <circle key={cx} cx={cx} cy={cx === 384 || cx === 1088 ? 60 : 65} r="5" fill="#E36C2F" />
      ))}
    </svg>
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
