import { CalendarCheck, CheckCircle2, CreditCard, FileText, Radiation } from "lucide-react";
import { CAL_URL } from "@/lib/site-config";

const included = [
  { icon: Radiation, label: "Radiografía panorámica digital" },
  { icon: FileText, label: "Diagnóstico personalizado con especialista" },
  { icon: CheckCircle2, label: "Plan de tratamiento por escrito" },
];

export function Pricing() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
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
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-navy-foreground shadow-card transition-colors hover:bg-navy-hover"
          >
            <CalendarCheck className="size-4" />
            Reservar valoración
          </a>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy-hover p-8 text-navy-foreground shadow-elevated sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-cyan/25 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
              <CreditCard className="size-3.5" />
              Facilidades de pago
            </span>
            <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
              Hasta <span className="text-cyan">18 meses sin intereses</span>
            </h3>
            <p className="mt-3 text-sm text-navy-foreground/80">
              Aceptamos todas las tarjetas de crédito y débito. Financiamiento propio
              disponible previo diagnóstico.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {["VISA", "MC", "AMEX", "MSI 6", "MSI 12", "MSI 18"].map((t) => (
                <div
                  key={t}
                  className="grid h-11 place-items-center rounded-lg bg-white/10 text-[11px] font-bold tracking-wider"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
