import { ShieldCheck } from "lucide-react";

export function PaymentMethods() {
  return (
    <div className="mt-12 rounded-2xl border border-border/80 bg-slate-50/80 p-6 sm:p-8 text-center shadow-card">
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
        <ShieldCheck className="size-4 text-emerald-600" />
        Métodos de pago 100% seguros
      </div>

      <p className="mb-6 text-sm font-medium text-muted-foreground">
        Aceptamos todas las tarjetas de crédito y débito, transferencias y meses sin intereses.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {/* Visa */}
        <div className="flex h-12 w-20 items-center justify-center rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 transition-transform hover:scale-105">
          <svg viewBox="0 0 100 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38.8 3.5L25.4 31.2H17L10.4 7.2C10 5.7 9.6 5.1 8.3 4.4C6.3 3.3 3 2.3 0 1.6L0.4 0H14.1C15.9 0 17.5 1.2 17.8 3.2L21.3 21.6L29.8 0H38.8V3.5ZM71.7 21.3C71.7 13.2 60.4 12.7 60.5 9.1C60.6 8 61.7 6.8 64.1 6.5C65.3 6.3 68.6 6.2 71.9 7.7L73.3 1.4C71.4 0.7 68.8 0 65.5 0C57.5 0 51.8 4.2 51.7 10.2C51.6 14.7 55.7 17.2 58.7 18.7C61.8 20.2 62.9 21.2 62.8 22.5C62.7 24.5 60.3 25.4 58.1 25.4C54 25.5 51.6 24.3 49.7 23.4L48.2 30.1C50.1 31 53.6 31.7 57.2 31.8C65.8 31.8 71.7 27.5 71.7 21.3ZM92.7 31.2H100L93.6 0H87.1C85.5 0 84.3 0.9 83.7 2.3L71.5 31.2H80L81.7 26.6H92.1L92.7 31.2ZM84.1 20.1L88.4 8.5L90.9 20.1H84.1ZM49.4 0.1L42.7 31.2H34.5L41.2 0.1H49.4Z" fill="#1434CB"/>
          </svg>
        </div>

        {/* Mastercard */}
        <div className="flex h-12 w-20 items-center justify-center rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 transition-transform hover:scale-105">
          <svg viewBox="0 0 100 62" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="62" rx="8" fill="white"/>
            <circle cx="36" cy="31" r="23" fill="#EB001B"/>
            <circle cx="64" cy="31" r="23" fill="#F79E1B"/>
            <path d="M50 12.3A22.9 22.9 0 0164 31 22.9 22.9 0 0150 49.7 22.9 22.9 0 0136 31 22.9 22.9 0 0150 12.3z" fill="#FF5F00"/>
          </svg>
        </div>

        {/* American Express */}
        <div className="flex h-12 w-20 items-center justify-center rounded-xl bg-[#006FCF] px-2 py-2 shadow-sm transition-transform hover:scale-105">
          <span className="text-[11px] font-black tracking-tighter text-white">AMEX</span>
        </div>

        {/* Discover */}
        <div className="flex h-12 w-20 items-center justify-center rounded-xl bg-white px-2 py-2 shadow-sm ring-1 ring-black/5 transition-transform hover:scale-105">
          <span className="text-[10px] font-black tracking-tight text-slate-800">
            DISC<span className="text-amber-500">O</span>VER
          </span>
        </div>

        {/* PayPal */}
        <div className="flex h-12 w-20 items-center justify-center rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 transition-transform hover:scale-105">
          <span className="text-[12px] font-black tracking-tight italic text-[#003087]">
            Pay<span className="text-[#009CDE]">Pal</span>
          </span>
        </div>

        {/* MSI Badges */}
        <div className="flex items-center gap-1.5">
          {["3 MSI", "6 MSI", "12 MSI", "18 MSI"].map((msi) => (
            <span
              key={msi}
              className="rounded-lg bg-navy/10 px-2.5 py-1.5 text-[11px] font-bold text-navy transition-transform hover:scale-105"
            >
              {msi}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
