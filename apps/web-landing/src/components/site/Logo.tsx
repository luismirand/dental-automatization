import { CLINIC } from "@/lib/site-config";

export function DentalIcon({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dentalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyan, #0EA5E9)" />
          <stop offset="100%" stopColor="var(--navy, #1E3A8A)" />
        </linearGradient>
      </defs>
      {/* Outer rounded geometric container */}
      <rect width="36" height="36" rx="10" fill="url(#dentalGrad)" />
      {/* Geometric modern tooth & smile silhouette */}
      <path
        d="M11 12.5C11 9.5 13.5 8 16 9.5C17.5 10.4 18.5 10.4 20 9.5C22.5 8 25 9.5 25 12.5C25 17 22.5 24 20.5 26.5C19.5 27.8 18 28 17 26.5C15 24 11 17 11 12.5Z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* Dynamic smile curve accent */}
      <path
        d="M13 16C15.5 18.5 20.5 18.5 23 16"
        stroke="url(#dentalGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Sparkle highlight */}
      <circle cx="23.5" cy="11.5" r="1.5" fill="#38BDF8" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      className={`inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
      aria-label={`${CLINIC.name} - Ir al inicio`}
    >
      <DentalIcon className="size-9 h-9 w-9 shrink-0 drop-shadow-sm" />
      <span className="truncate">
        <span className="hidden block text-base font-extrabold leading-none text-navy sm:block">
          {CLINIC.name}
        </span>
        <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:block">
          Dental Care
        </span>
      </span>
    </a>
  );
}
