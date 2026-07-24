import { AlertTriangle, Plus } from "lucide-react";
import { WHATSAPP_URGENT_URL } from "@/lib/site-config";

const faqs = [
  {
    q: "¿Tienen convenio con aseguradoras?",
    a: "Trabajamos con las principales aseguradoras: GNP, AXA, MetLife y Mapfre. Verificamos tu cobertura sin costo antes de iniciar cualquier tratamiento.",
  },
  {
    q: "¿Qué hago si tengo un dolor de muela agudo hoy?",
    a: "Contáctanos por WhatsApp con el botón de Urgencias. Atendemos casos agudos el mismo día en un plazo de 2 a 4 horas, 24/7.",
  },
  {
    q: "¿Cuáles son los métodos de pago?",
    a: "Efectivo, transferencia, tarjetas de crédito y débito. Ofrecemos hasta 18 meses sin intereses con VISA, MasterCard y American Express.",
  },
  {
    q: "¿Ofrecen valoración sin costo?",
    a: "La primera cita tiene un costo de $450 MXN e incluye radiografía panorámica digital, diagnóstico y plan de tratamiento por escrito.",
  },
  {
    q: "¿Cuánto dura un tratamiento de Invisalign?",
    a: "Entre 6 y 18 meses según la complejidad. Recibirás una simulación 3D del resultado final antes de comenzar.",
  },
];

export function FAQ() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        {/* Urgency banner */}
        <aside className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-urgent to-[oklch(0.55_0.2_20)] p-8 text-white shadow-elevated">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            <AlertTriangle className="size-3.5" />
            Urgencias 24/7
          </span>
          <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
            ¿Dolor dental hoy mismo?
          </h3>
          <p className="mt-3 text-sm text-white/90">
            No esperes. Nuestro equipo de guardia atiende urgencias en menos de 4 horas
            todos los días del año.
          </p>
          <a
            href={WHATSAPP_URGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-urgent shadow-card transition-transform hover:scale-[1.02]"
          >
            Chatear urgencia por WhatsApp
          </a>
        </aside>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-hover">
            Preguntas frecuentes
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
            Resolvemos tus dudas
          </h2>

          <div className="mt-8 divide-y divide-border rounded-2xl bg-surface ring-1 ring-border">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-navy sm:text-base">
                  <span>{f.q}</span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-cyan-hover ring-1 ring-border transition-transform group-open:rotate-45">
                    <Plus className="size-4" />
                  </span>
                </summary>
                <p className="mt-3 pr-12 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
