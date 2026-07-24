import { CalendarCheck, ShieldCheck, Star } from "lucide-react";
import heroDentist from "@/assets/hero-dentist.png";
import { WhatsAppCTA } from "./WhatsAppCTA";
import { CAL_URL } from "@/lib/site-config";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-surface to-white">
      <div className="pointer-events-none absolute -top-24 -right-24 size-[420px] rounded-full bg-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 size-[360px] rounded-full bg-navy/5 blur-3xl" />

      <div className="container-page relative grid gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
        <div className="flex flex-col justify-center">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-hover">
            <ShieldCheck className="size-3.5" />
            Odontología Certificada COFEPRIS
          </span>

          <h1 className="text-3xl font-extrabold leading-[1.1] text-navy xs:text-4xl xs:leading-[1.05] sm:text-5xl lg:text-6xl">
            Tu sonrisa ideal, en manos de{" "}
            <span className="text-cyan">especialistas</span> con tecnología sin dolor.
          </h1>

          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Atención humanizada, diagnóstico digital 3D y financiamiento a meses sin
            intereses. Ubicados en el corazón de la CDMX con estacionamiento gratuito.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan px-6 text-base font-semibold text-cyan-foreground shadow-glow transition-colors hover:bg-cyan-hover"
            >
              <CalendarCheck className="size-5" />
              Agendar Cita Online
            </a>
            <WhatsAppCTA size="lg" variant="outline" label="Consulta por WhatsApp" />
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

        {/* Image */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan/20 via-transparent to-navy/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl bg-navy/5 ring-1 ring-black/5">
            <img
              src={heroDentist.src}
              alt="Doctora especialista en Smile Studio usando escáner dental 3D"
              width={1200}
              height={1400}
              className="aspect-[5/6] w-full object-cover"
            />
          </div>

          {/* Floating cards */}
          <div className="absolute -left-3 bottom-6 hidden rounded-2xl bg-white p-4 shadow-elevated ring-1 ring-border sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-hover">
              Cita disponible hoy
            </p>
            <p className="mt-1 text-sm font-bold text-navy">18:30 h · Dra. Alanís</p>
          </div>
          <div className="absolute -right-3 top-6 hidden rounded-2xl bg-navy p-4 text-navy-foreground shadow-elevated sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan/90">
              Escáner 3D
            </p>
            <p className="mt-1 text-sm font-bold">Diagnóstico sin dolor</p>
          </div>
        </div>
      </div>
    </section>
  );
}
