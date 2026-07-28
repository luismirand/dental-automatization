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

/** 
 * Floating WhatsApp button placed on the bottom-left corner
 * so it never overlaps with the AI Chat Widget trigger button on the bottom-right.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
      className="group fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-whatsapp pl-3.5 pr-4 py-3 text-white shadow-elevated ring-4 ring-white transition-all hover:scale-105 sm:bottom-6 sm:left-6"
    >
      <MessageCircle className="size-6 shrink-0" />
      <span className="text-xs font-bold whitespace-nowrap sm:text-sm">
        WhatsApp
      </span>
    </a>
  );
}
