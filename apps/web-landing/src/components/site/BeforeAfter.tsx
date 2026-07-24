import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import beforeImg from "@/assets/before-smile.png";
import afterImg from "@/assets/after-smile.png";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  return (
    <div
      ref={ref}
      onMouseDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => {
        dragging.current = true;
        setFromClientX(e.touches[0].clientX);
      }}
      onTouchMove={(e) => setFromClientX(e.touches[0].clientX)}
      onTouchEnd={() => (dragging.current = false)}
      className="relative aspect-square w-full select-none overflow-hidden rounded-2xl bg-navy/5 ring-1 ring-border sm:aspect-[4/3]"
    >
      <img
        src={afterImg.src}
        alt="Sonrisa después del tratamiento"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={beforeImg.src}
          alt="Sonrisa antes del tratamiento"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-foreground">
        Antes
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-cyan/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-foreground">
        Después
      </span>

      {/* Handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -translate-x-1/2 border-l-2 border-white/90" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white text-navy shadow-elevated ring-2 ring-cyan">
          <MoveHorizontal className="size-4" />
        </div>
      </div>
    </div>
  );
}
