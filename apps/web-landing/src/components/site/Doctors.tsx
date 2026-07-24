import doc1 from "@/assets/doctor-1.png";
import doc2 from "@/assets/doctor-2.png";
import doc3 from "@/assets/doctor-3.png";
import { GraduationCap } from "lucide-react";

const doctors = [
  {
    img: doc1,
    name: "Dr. Ricardo Mendoza",
    role: "Implantólogo & Cirujano Maxilofacial",
    school: "UNAM · Cédula 5842910",
    years: "16 años de experiencia",
  },
  {
    img: doc2,
    name: "Dra. Sofía Alanís",
    role: "Ortodoncista Certificada Invisalign",
    school: "ITESM · Cédula 6913402",
    years: "11 años de experiencia",
  },
  {
    img: doc3,
    name: "Dr. Andrés Villanueva",
    role: "Diseño de Sonrisa & Estética",
    school: "UAG · Cédula 7204188",
    years: "9 años de experiencia",
  },
];

export function Doctors() {
  return (
    <section id="doctores" className="bg-surface py-20 sm:py-24">
      <div className="container-page">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-hover">
            Equipo médico
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
            Conoce a tus doctores
          </h2>
          <p className="mt-3 text-muted-foreground">
            Especialistas certificados con formación en las mejores universidades del país.
            Le compras a personas, no a logotipos.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <article
              key={d.name}
              className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-border"
            >
              <div className="aspect-[4/5] overflow-hidden bg-surface-2">
                <img
                  src={d.img.src}
                  alt={`Retrato profesional de ${d.name}`}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-navy">{d.name}</h3>
                <p className="mt-1 text-sm font-semibold text-cyan-hover">{d.role}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <GraduationCap className="size-4 shrink-0" />
                  <span>{d.school}</span>
                </div>
                <p className="mt-1 pl-6 text-xs text-muted-foreground">{d.years}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
