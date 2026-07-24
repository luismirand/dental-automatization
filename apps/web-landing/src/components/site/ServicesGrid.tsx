import { AlarmClock, ArrowRight, Baby, Bluetooth, Smile, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site-config";

interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
  price: string;
  urgent?: boolean;
}

const services: Service[] = [
  {
    icon: Bluetooth,
    title: "Ortodoncia e Invisalign",
    desc: "Alineadores transparentes y brackets estéticos con planeación 3D.",
    price: "Desde $1,200/mes",
  },
  {
    icon: Sparkles,
    title: "Implantes Dentales",
    desc: "Implantes de titanio con carga inmediata y garantía a 10 años.",
    price: "Desde $14,900",
  },
  {
    icon: Smile,
    title: "Diseño de Sonrisa",
    desc: "Carillas de porcelana y blanqueamiento profesional en 1 sesión.",
    price: "Desde $8,500",
  },
  {
    icon: Baby,
    title: "Odontopediatría",
    desc: "Dentista para niños en un ambiente lúdico y libre de miedo.",
    price: "Desde $650",
  },
  {
    icon: AlarmClock,
    title: "Urgencias Dentales 24/7",
    desc: "Atención inmediata para dolor agudo, fracturas o trauma dental.",
    price: "Valoración $0",
    urgent: true,
  },
];

export function ServicesGrid() {
  return (
    <section id="servicios" className="bg-surface py-20 sm:py-24">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-hover">
            Especialidades
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
            Tratamientos completos bajo un mismo techo
          </h2>
          <p className="mt-3 text-muted-foreground">
            De la primera consulta al mantenimiento anual, contamos con el equipo y la
            tecnología para cada etapa de tu salud bucal.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, desc, price, urgent }: Service) {
  return (
    <article
      className={[
        "group relative flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-card ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-elevated sm:p-7",
        urgent ? "ring-2 ring-urgent/40" : "",
      ].join(" ")}
    >
      {urgent && (
        <span className="absolute right-4 top-4 rounded-full bg-urgent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-urgent">
          Prioridad
        </span>
      )}
      <span
        className={[
          "grid size-12 place-items-center rounded-xl",
          urgent ? "bg-urgent/10 text-urgent" : "bg-navy/5 text-navy",
        ].join(" ")}
      >
        <Icon className="size-6" />
      </span>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-navy">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-bold text-cyan-hover">{price}</span>
        <a
          href={urgent ? WHATSAPP_URL : "#agenda"}
          target={urgent ? "_blank" : undefined}
          rel={urgent ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-1 text-sm font-semibold text-navy transition-colors hover:text-cyan-hover"
        >
          Saber más
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}
