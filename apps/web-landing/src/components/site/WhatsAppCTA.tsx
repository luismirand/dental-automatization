import { MessageCircle } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/site-config";

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
  solid:
    "bg-whatsapp text-white shadow-card hover:bg-whatsapp-hover",
  ghost:
    "bg-whatsapp/10 text-whatsapp hover:bg-whatsapp/15",
  outline:
    "bg-white text-foreground ring-1 ring-border hover:bg-muted",
};

export function WhatsAppCTA({
  variant = "solid",
  size = "md",
  label = "WhatsApp Directo",
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
      <MessageCircle className="size-4" />
      {label}
    </a>
  );
}

/** Floating urgencias button (mobile-first). Sits above the ChatWidget trigger. */
export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-[5rem] right-5 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-elevated ring-4 ring-white transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
