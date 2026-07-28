"use client";

import { useState } from "react";
import { Calendar, ExternalLink, Loader2 } from "lucide-react";
import { CAL_URL } from "@/lib/site-config";

export function CalReactWidget() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex flex-col w-full h-full min-h-[650px] sm:min-h-[700px] overflow-hidden rounded-2xl bg-white shadow-inner">
      {/* Loading Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 text-white p-6 gap-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-cyan/20 text-cyan animate-pulse">
            <Calendar className="size-7" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Loader2 className="size-4 animate-spin text-cyan" />
            <span>Cargando calendario de citas...</span>
          </div>
          <p className="text-xs text-slate-400 text-center max-w-xs">
            Conectando con el sistema de agendamiento en tiempo real
          </p>
        </div>
      )}

      {/* Fast direct iframe embed */}
      <iframe
        src="https://cal.com/luis-miranda/30min?embed=true&layout=month_view"
        title="Agenda tu cita en Smile Studio"
        onLoad={() => setLoaded(true)}
        className="w-full flex-1 min-h-[620px] sm:min-h-[670px] border-0 rounded-2xl bg-white"
        loading="eager"
      />

      {/* Fallback footer banner */}
      <div className="bg-slate-900 py-2.5 px-4 text-center border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span>¿Prefieres abrir la agenda en pantalla completa?</span>
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-bold text-cyan hover:underline hover:text-cyan-hover"
        >
          <span>Abrir Cal.com en nueva pestaña</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
