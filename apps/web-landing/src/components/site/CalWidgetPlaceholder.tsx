import { CalendarCheck, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { CAL_URL } from "@/lib/site-config";
import { WhatsAppCTA } from "./WhatsAppCTA";

const days = ["L", "M", "M", "J", "V", "S", "D"];
const times = ["09:30", "11:00", "13:30", "16:00", "17:30", "18:30"];

export function CalWidgetPlaceholder() {
  const today = new Date();
  const monthLabel = today.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentDay = today.getDate();

  return (
    <section id="agenda" className="bg-gradient-to-b from-white to-surface py-20 sm:py-24">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-hover">
            Agenda online
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
            ¿Listo para transformar tu sonrisa? Elige tu horario
          </h2>
          <p className="mt-3 text-muted-foreground">
            Selecciona el día y hora que mejor te acomode. Recibirás confirmación al
            instante por correo y WhatsApp.
          </p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-elevated ring-1 ring-border">
          <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
            {/* Calendar */}
            <div className="border-b border-border p-4 xs:p-6 sm:p-8 md:border-b-0 md:border-r">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-hover">
                    Selecciona un día
                  </p>
                  <p className="mt-1 text-lg font-bold capitalize text-navy">{monthLabel}</p>
                </div>
                <div className="flex gap-1">
                  <button className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((d, i) => (
                  <div
                    key={i}
                    className="pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {d}
                  </div>
                ))}
                {Array.from({ length: (firstDay + 6) % 7 }).map((_, i) => (
                  <div key={`e${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isPast = day < currentDay;
                  const isToday = day === currentDay;
                  const isAvailable = !isPast && day % 7 !== 0;
                  return (
                    <button
                      key={day}
                      disabled={!isAvailable}
                      className={[
                        "grid aspect-square place-items-center rounded-lg text-sm font-semibold transition-colors",
                        isPast && "text-muted-foreground/40",
                        isToday && "ring-2 ring-cyan",
                        isAvailable && !isToday && "text-navy hover:bg-cyan/10",
                        isAvailable && "cursor-pointer",
                        !isAvailable && !isPast && "text-muted-foreground/40",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Times */}
            <div className="flex flex-col p-4 xs:p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="size-4 text-cyan-hover" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-hover">
                  Horarios disponibles
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {times.map((t, i) => (
                  <button
                    key={t}
                    className={[
                      "h-11 rounded-xl text-sm font-semibold transition-colors",
                      i === 2
                        ? "bg-cyan text-cyan-foreground shadow-card"
                        : "bg-surface text-navy ring-1 ring-border hover:bg-cyan/10",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy px-5 text-sm font-semibold text-navy-foreground shadow-card transition-colors hover:bg-navy-hover sm:mt-6"
              >
                <CalendarCheck className="size-4" />
                Confirmar en Cal.com
              </a>
              <div className="mt-3 text-center text-xs text-muted-foreground">
                ¿Prefieres hablar antes? <WhatsAppCTA size="sm" variant="ghost" label="WhatsApp" className="ml-1 !h-auto !p-0 !bg-transparent !text-cyan-hover underline inline-flex" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
