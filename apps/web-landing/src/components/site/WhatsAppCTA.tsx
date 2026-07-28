import { MessageCircle } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { TELEGRAM_URL, WHATSAPP_URL } from "@/lib/site-config";

type Variant = "solid" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface WhatsAppCTAProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  variant?: Variant;
  size?: Size;
  label?: string;
  href?: string;
}

const sizeCls: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

const variantCls: Record<Variant, string> = {
  solid: "bg-whatsapp text-white shadow-card hover:bg-whatsapp-hover",
  ghost: "bg-whatsapp/10 text-whatsapp hover:bg-whatsapp/15",
  outline: "bg-white text-foreground ring-1 ring-border hover:bg-muted",
};

export function WhatsAppCTA({
  variant = "solid",
  size = "md",
  label = "Chat en WhatsApp",
  href = WHATSAPP_URL,
  className,
  ...props
}: WhatsAppCTAProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-colors",
        sizeCls[size],
        variantCls[variant],
        className,
      )}
      {...props}
    >
      <MessageCircle className="size-4 shrink-0" />
      <span>{label}</span>
    </a>
  );
}

export function TelegramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("fill-current", className)}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export function TelegramCTA({
  size = "md",
  label,
  href = TELEGRAM_URL,
  className,
  ...props
}: WhatsAppCTAProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Contactar por Telegram"
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-telegram text-white font-semibold shadow-card transition-colors hover:bg-telegram-hover",
        sizeCls[size],
        className,
      )}
      {...props}
    >
      <TelegramIcon className="size-4 shrink-0" />
      {label && <span>{label}</span>}
    </a>
  );
}

/** Floating action buttons (WhatsApp & Telegram 56px FABs) */
export function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Telegram FAB (Secondary) */}
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por Telegram"
        title="Contactar por Telegram"
        className="group relative grid size-12 place-items-center rounded-full bg-telegram text-white shadow-elevated ring-4 ring-white transition-all hover:scale-110 sm:size-14"
      >
        <TelegramIcon className="size-6" />
        <span className="absolute right-16 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          Contactar por Telegram
        </span>
      </a>

      {/* WhatsApp FAB (Primary) */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
        className="group relative grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-elevated ring-4 ring-white transition-all hover:scale-110"
      >
        <MessageCircle className="size-7" />
        <span className="absolute right-16 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          Contactar por WhatsApp
        </span>
      </a>
    </div>
  );
}
