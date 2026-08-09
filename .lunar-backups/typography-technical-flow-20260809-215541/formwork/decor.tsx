import type { ReactNode } from "react";

export function BlueprintLayer({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.07] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(24,45,77,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(24,45,77,.10) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "linear-gradient(to bottom, black, rgba(0,0,0,.72) 58%, transparent 100%)",
      }}
    />
  );
}

type TechnicalArcProps = {
  className?: string;
  label?: string;
};

/**
 * Compatibility name retained because the existing pages import TechnicalArc.
 * Visually this is now a free-form construction route / alignment spline,
 * not a decorative circle.
 */
export function TechnicalArc({ className = "", label = "GRID / ALIGN" }: TechnicalArcProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <svg
        viewBox="0 0 620 420"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        fill="none"
      >
        <path
          d="M18 332 C96 188 168 344 258 232 C344 124 410 76 476 128 C525 166 553 143 604 74"
          stroke="#dcb458"
          strokeWidth="1.35"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M28 348 C104 214 177 365 271 250 C359 142 421 96 486 145 C529 177 560 157 610 96"
          stroke="#182d4d"
          strokeOpacity="0.22"
          strokeWidth="0.75"
          strokeDasharray="5 11"
          vectorEffect="non-scaling-stroke"
        />

        <g stroke="#dcb458" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d="M93 226 l-8 -7 M93 226 l-3 10" />
          <path d="M258 232 l-8 -8 M258 232 l-1 11" />
          <path d="M477 128 l-8 -8 M477 128 l1 11" />
        </g>

        <circle cx="93" cy="226" r="4.5" fill="#dcb458" />
        <circle cx="258" cy="232" r="3.5" fill="#f5f1e8" stroke="#dcb458" strokeWidth="1.4" />
        <circle cx="477" cy="128" r="4" fill="#dcb458" />
        <circle cx="604" cy="74" r="2.8" fill="#182d4d" />

        <g fill="#657184" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="9" letterSpacing="1.5">
          <text x="104" y="216">01</text>
          <text x="270" y="252">REF</text>
          <text x="488" y="118">+00</text>
          <text x="336" y="206">{label}</text>
        </g>
      </svg>
    </div>
  );
}

export function MicroLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-mono text-[9px] font-semibold uppercase tracking-[0.17em] text-[#657184] ${className}`}
    >
      {children}
    </span>
  );
}

export const displayFont =
  "[font-family:'Bahnschrift','Arial_Narrow','Roboto_Condensed','Helvetica_Neue_Condensed',Arial,sans-serif] [font-stretch:75%] [font-variation-settings:'wdth'_72,'wght'_720]";

export const bodyFont =
  "[font-family:'Aptos','Segoe_UI_Variable_Text','Segoe_UI',Arial,sans-serif]";