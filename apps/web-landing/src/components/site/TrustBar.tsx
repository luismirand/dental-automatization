import { CreditCard, ParkingSquare, ScanLine, Shield } from "lucide-react";

const items = [
  { icon: ScanLine, label: "Scanner 3D Digital" },
  { icon: CreditCard, label: "Financiamiento Sin Intereses" },
  { icon: Shield, label: "Diagnóstico Sin Dolor" },
  { icon: ParkingSquare, label: "Estacionamiento Gratuito" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-white">
      <div className="container-page grid grid-cols-2 gap-6 py-6 sm:grid-cols-4 sm:py-8">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan/10 text-cyan-hover">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 text-sm font-semibold text-navy">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
