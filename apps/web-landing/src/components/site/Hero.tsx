import { CalendarCheck, ShieldCheck, Star } from "lucide-react";
import heroDentist from "@/assets/hero-dentist.png";
import { TelegramCTA, WhatsAppCTA } from "./WhatsAppCTA";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-surface to-white min-h-[600px] lg:min-h-[calc(100vh-4rem)] lg:max-h-[900px] flex items-center">
      {/* Background ambient lighting blur effects */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-[420px] rounded-full bg-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 size-[360px] rounded-full bg-navy/5 blur-3xl" />

      <div className="container-page relative w-full py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
          
          {/* Text & Content Column */}
          <div className="flex flex-col justify-center max-w-[600px] mx-auto lg:mx-0">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-hover sm:mb-5">
              <ShieldCheck className="size-4 shrink-0" />
              Odontología Certificada COFEPRIS
            </span>

            <h1 className="text-3xl font-extrabold leading-[1.3] text-navy sm:text-5xl lg:text-6xl lg:leading-[1.15]">
              Tu sonrisa ideal, en manos de{" "}
              <span className="text-cyan">especialistas</span> con tecnología sin dolor.
            </h1>

            <p className="mt-4 text-base text-muted-foreground leading-[1.5] sm:mt-5 sm:text-lg">
              Atención humanizada, diagnóstico digital 3D y financiamiento a meses sin
              intereses. Ubicados en el corazón de la CDMX con estacionamiento gratuito.
            </p>

            {/* CTA Buttons Block */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#booking"
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-cyan px-6 py-3 text-base font-bold text-cyan-foreground shadow-glow transition-all hover:bg-cyan-hover active:scale-[0.98] sm:w-auto"
              >
                <CalendarCheck className="size-5" />
                Agendar Cita Ahora
              </a>
              <WhatsAppCTA
                size="lg"
                variant="outline"
                label="Consulta por WhatsApp"
                className="w-full sm:w-auto"
              />
              <TelegramCTA
                size="lg"
                className="w-full sm:w-auto sm:hidden"
                label="Chat Telegram"
              />
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  "from-cyan to-navy",
                  "from-navy to-cyan",
                  "from-cyan-hover to-navy-hover",
                  "from-navy to-cyan-hover",
                ].map((g, i) => (
                  <div
                    key={i}
                    className={`grid size-10 place-items-center rounded-full bg-gradient-to-br ${g} text-xs font-bold text-white ring-2 ring-white`}
                  >
                    {["MC", "JR", "AL", "SP"][i]}
                  </div>
                ))}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-navy">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-cyan text-cyan" />
                    ))}
                  </div>
                  <span className="text-sm font-bold">4.9/5</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Más de <span className="font-semibold text-foreground">500+ pacientes</span> felices
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image Column (First on mobile visual flow, right on desktop) */}
          <div className="relative w-full max-w-[550px] mx-auto lg:max-w-none">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan/20 via-transparent to-navy/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl bg-navy/5 ring-1 ring-black/5 p-1 lg:p-2">
              <img
                src={heroDentist.src}
                alt="Doctora especialista en Smile Studio usando escáner dental 3D"
                width={1200}
                height={1400}
                className="aspect-[4/3] sm:aspect-[5/6] w-full rounded-2xl object-cover"
              />
            </div>

            {/* Floating badges */}
            <div className="absolute -left-3 bottom-6 hidden rounded-2xl bg-white/95 p-4 shadow-elevated ring-1 ring-border backdrop-blur-sm sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-hover">
                Cita disponible hoy
              </p>
              <p className="mt-1 text-sm font-bold text-navy">18:30 h · Dra. Alanís</p>
            </div>
            <div className="absolute -right-3 top-6 hidden rounded-2xl bg-navy/95 p-4 text-navy-foreground shadow-elevated backdrop-blur-sm sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan/90">
                Escáner 3D
              </p>
              <p className="mt-1 text-sm font-bold">Diagnóstico sin dolor</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
