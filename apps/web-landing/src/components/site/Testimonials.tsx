import { Quote, Star } from "lucide-react";
import { BeforeAfter } from "./BeforeAfter";

const testimonials = [
  {
    name: "María C.",
    treatment: "Invisalign",
    text: "Cambió mi vida. En 10 meses tuve la sonrisa que quería y jamás sentí dolor. El equipo es súper humano.",
  },
  {
    name: "Jorge R.",
    treatment: "Implante dental",
    text: "Llegué con pánico y salí tranquilo. Me explicaron todo el proceso con el escáner 3D antes de tocar nada.",
  },
  {
    name: "Ana P.",
    treatment: "Diseño de sonrisa",
    text: "Los resultados superaron mis expectativas. Además, agendar por WhatsApp es rapidísimo.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-white py-20 sm:py-24">
      <div className="container-page">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-hover">
              Casos reales
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
              Sonrisas que hablan por nosotros
            </h2>
            <p className="mt-3 text-muted-foreground">
              Desliza para ver el antes y el después de un tratamiento de diseño de sonrisa
              con carillas de porcelana.
            </p>
          </div>
          <div className="flex items-center gap-2 text-navy">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-cyan text-cyan" />
              ))}
            </div>
            <span className="text-sm font-bold">4.9 · Google Reviews</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <BeforeAfter />

          <div className="grid gap-4 sm:grid-cols-1">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="relative rounded-2xl bg-surface p-6 ring-1 ring-border"
              >
                <Quote className="absolute right-5 top-5 size-6 text-cyan/50" />
                <blockquote className="text-sm text-foreground/90 sm:text-base">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-cyan to-navy text-xs font-bold text-white">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.treatment}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
