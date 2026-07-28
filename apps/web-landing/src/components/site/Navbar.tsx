import { useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { TelegramCTA, WhatsAppCTA } from "./WhatsAppCTA";

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
      <div className="container-page flex h-16 items-center justify-between gap-3">
        {/* Left: Brand Logo */}
        <Logo />

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center justify-center gap-7 lg:flex">
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

        {/* Right: Contact Channels + CTA */}
        <div className="flex items-center gap-2">
          {/* Telegram (Icon only on Navbar to prevent clutter) */}
          <TelegramCTA
            size="sm"
            className="hidden sm:inline-flex p-2"
          />

          {/* WhatsApp (Primary Contact Channel) */}
          <WhatsAppCTA
            size="sm"
            variant="ghost"
            label="Chat en WhatsApp"
            className="hidden md:inline-flex"
          />

          {/* Main CTA: Smooth scroll to #booking */}
          <a
            href="#booking"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-cyan px-3.5 text-sm font-semibold text-cyan-foreground shadow-card transition-colors hover:bg-cyan-hover"
          >
            <CalendarCheck className="size-4" />
            <span className="hidden sm:inline">Agendar Cita</span>
            <span className="sm:hidden">Agendar</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú principal"
            className="grid size-9 place-items-center rounded-lg text-navy hover:bg-muted lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`overflow-hidden bg-white lg:hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[400px] border-t border-border opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="container-page flex flex-col py-4 gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-semibold text-foreground/80 hover:text-navy"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-border/60">
            <WhatsAppCTA
              size="md"
              variant="solid"
              label="Chat en WhatsApp"
              className="w-full justify-center"
              onClick={() => setOpen(false)}
            />
            <TelegramCTA
              size="md"
              label="Chat en Telegram"
              className="w-full justify-center"
              onClick={() => setOpen(false)}
            />
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan text-sm font-bold text-cyan-foreground shadow-card hover:bg-cyan-hover"
            >
              <CalendarCheck className="size-4" />
              Agendar Cita Ahora
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
