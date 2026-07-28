import { Clock, Mail, MapPin, Navigation, Phone, ShieldCheck } from "lucide-react";
import { CLINIC, MAPS_DIRECTIONS, MAPS_EMBED, WAZE_DIRECTIONS } from "@/lib/site-config";
import { DentalIcon } from "./Logo";
import { TelegramCTA, WhatsAppCTA } from "./WhatsAppCTA";

export function LocationFooter() {
  return (
    <footer id="ubicacion" className="bg-navy text-navy-foreground">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          {/* Map */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
            <iframe
              title="Ubicación de Smile Studio"
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full sm:h-96"
            />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <DentalIcon className="size-9" />
              <span>
                <span className="block text-lg font-extrabold leading-none">{CLINIC.name}</span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-navy-foreground/60">
                  {CLINIC.tagline}
                </span>
              </span>
            </div>

            <div className="mt-6 space-y-3.5 text-sm">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-cyan" />
                <span>{CLINIC.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-cyan" />
                <a href={CLINIC.phoneHref} className="hover:text-cyan">
                  {CLINIC.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-cyan" />
                <a href={`mailto:${CLINIC.email}`} className="hover:text-cyan">
                  {CLINIC.email}
                </a>
              </p>
            </div>

            {/* Direct Social / Messaging Contact Channels */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <WhatsAppCTA size="sm" variant="solid" label="Atención por WhatsApp" />
              <TelegramCTA size="sm" label="Telegram Bot" />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-navy-foreground/70">
                <Clock className="size-3.5" />
                Horarios de Atención
              </div>
              <ul className="space-y-1.5 text-sm">
                {CLINIC.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4 border-b border-white/10 pb-1.5">
                    <span className="text-navy-foreground/80">{h.day}</span>
                    <span className="font-semibold">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={MAPS_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan px-4 text-sm font-semibold text-cyan-foreground transition-colors hover:bg-cyan-hover"
              >
                <Navigation className="size-4" />
                Google Maps
              </a>
              <a
                href={WAZE_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-semibold text-navy-foreground transition-colors hover:bg-white/15"
              >
                <Navigation className="size-4" />
                Waze
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-3.5" />
            {CLINIC.license}
          </p>
          <p>
            © {new Date().getFullYear()} {CLINIC.name}. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-cyan">
              Aviso de privacidad
            </a>
            <a href="#" className="hover:text-cyan">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
