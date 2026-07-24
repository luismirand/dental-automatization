import { useState } from "react";
import { CalendarCheck, Menu, Sparkles, X } from "lucide-react";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { CAL_URL, CLINIC } from "@/lib/site-config";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#doctores", label: "Doctores" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#ubicacion", label: "Ubicación" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-3">
        <a href="#top" className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-navy text-navy-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="truncate">
            <span className="block text-base font-extrabold leading-none text-navy">
              {CLINIC.name}
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:block">
              Dental Care
            </span>
          </span>
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppCTA size="sm" variant="ghost" label="WhatsApp" className="hidden sm:inline-flex" />
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-cyan px-3 text-sm font-semibold text-cyan-foreground shadow-card transition-colors hover:bg-cyan-hover"
          >
            <CalendarCheck className="size-4" />
            <span className="hidden sm:inline">Agendar Cita</span>
            <span className="sm:hidden">Agendar</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            className="grid size-9 place-items-center rounded-lg text-navy hover:bg-muted lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>


      <div
        className={`overflow-hidden bg-white lg:hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[300px] border-t border-border opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="container-page flex flex-col py-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-foreground/80"
            >
              {l.label}
            </a>
          ))}
          <WhatsAppCTA size="md" variant="ghost" className="mt-2 w-full" />
        </nav>
      </div>
    </header>
  );
}
