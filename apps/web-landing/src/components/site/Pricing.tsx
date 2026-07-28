import { CalendarCheck, CheckCircle2, CreditCard, FileText, Radiation, ShieldCheck } from "lucide-react";

const included = [
  { icon: Radiation, label: "Radiografía panorámica digital" },
  { icon: FileText, label: "Diagnóstico personalizado con especialista" },
  { icon: CheckCircle2, label: "Plan de tratamiento por escrito" },
];

export function Pricing() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left Column: Valuation Pricing details */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-hover">
              Transparencia total
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
              Primera cita de valoración por <span className="text-cyan">$450 MXN</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Sin sorpresas, sin letras chiquitas. Sabrás el costo exacto de tu tratamiento
              antes de agendar cualquier procedimiento.
            </p>

            <ul className="mt-6 space-y-3">
              {included.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan-hover">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </li>
              ))}
            </ul>

            <a
              href="#booking"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-navy-foreground shadow-card transition-colors hover:bg-navy-hover"
            >
              <CalendarCheck className="size-4" />
              Reservar valoración
            </a>
          </div>

          {/* Right Column: Payment Facilities & Integrated Payment Logos */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy-hover p-8 text-navy-foreground shadow-elevated sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-cyan/25 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                <CreditCard className="size-3.5 text-cyan" />
                Facilidades de pago
              </span>
              <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                Hasta <span className="text-cyan">18 meses sin intereses</span>
              </h3>
              <p className="mt-3 text-sm text-navy-foreground/80">
                Aceptamos todas las tarjetas de crédito y débito. Financiamiento propio
                disponible previo diagnóstico.
              </p>

              {/* Integrated Payment Logos Grid */}
              <div className="mt-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Visa */}
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-sm transition-transform hover:scale-105">
                    <svg viewBox="0 0 100 32" className="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M38.8 3.5L25.4 31.2H17L10.4 7.2C10 5.7 9.6 5.1 8.3 4.4C6.3 3.3 3 2.3 0 1.6L0.4 0H14.1C15.9 0 17.5 1.2 17.8 3.2L21.3 21.6L29.8 0H38.8V3.5ZM71.7 21.3C71.7 13.2 60.4 12.7 60.5 9.1C60.6 8 61.7 6.8 64.1 6.5C65.3 6.3 68.6 6.2 71.9 7.7L73.3 1.4C71.4 0.7 68.8 0 65.5 0C57.5 0 51.8 4.2 51.7 10.2C51.6 14.7 55.7 17.2 58.7 18.7C61.8 20.2 62.9 21.2 62.8 22.5C62.7 24.5 60.3 25.4 58.1 25.4C54 25.5 51.6 24.3 49.7 23.4L48.2 30.1C50.1 31 53.6 31.7 57.2 31.8C65.8 31.8 71.7 27.5 71.7 21.3ZM92.7 31.2H100L93.6 0H87.1C85.5 0 84.3 0.9 83.7 2.3L71.5 31.2H80L81.7 26.6H92.1L92.7 31.2ZM84.1 20.1L88.4 8.5L90.9 20.1H84.1ZM49.4 0.1L42.7 31.2H34.5L41.2 0.1H49.4Z" fill="#1434CB"/>
                    </svg>
                  </div>

                  {/* Mastercard */}
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-sm transition-transform hover:scale-105">
                    <svg viewBox="0 0 100 62" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="62" rx="8" fill="white"/>
                      <circle cx="36" cy="31" r="23" fill="#EB001B"/>
                      <circle cx="64" cy="31" r="23" fill="#F79E1B"/>
                      <path d="M50 12.3A22.9 22.9 0 0164 31 22.9 22.9 0 0150 49.7 22.9 22.9 0 0136 31 22.9 22.9 0 0150 12.3z" fill="#FF5F00"/>
                    </svg>
                  </div>

                  {/* AMEX */}
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-[#006FCF] px-1.5 py-1 shadow-sm transition-transform hover:scale-105">
                    <span className="text-[10px] font-black tracking-tighter text-white">AMEX</span>
                  </div>

                  {/* Discover */}
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-white px-1.5 py-1 shadow-sm transition-transform hover:scale-105">
                    <span className="text-[9px] font-black tracking-tight text-slate-800">
                      DISC<span className="text-amber-500">O</span>VER
                    </span>
                  </div>

                  {/* PayPal */}
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-white px-2 py-1 shadow-sm transition-transform hover:scale-105">
                    <span className="text-[11px] font-black tracking-tight italic text-[#003087]">
                      Pay<span className="text-[#009CDE]">Pal</span>
                    </span>
                  </div>
                </div>

                {/* MSI Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {["3 MSI", "6 MSI", "12 MSI", "18 MSI"].map((msi) => (
                    <span
                      key={msi}
                      className="rounded-lg bg-white/15 px-3 py-1.5 text-[11px] font-bold tracking-wider text-white shadow-sm transition-transform hover:scale-105"
                    >
                      {msi}
                    </span>
                  ))}
                </div>

                <p className="flex items-center gap-1.5 text-[11px] text-navy-foreground/70 pt-1">
                  <ShieldCheck className="size-3.5 text-cyan" />
                  Pagos procesados con encriptación bancaria de 256 bits
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
