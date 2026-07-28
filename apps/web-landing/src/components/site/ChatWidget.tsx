"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { WEBCHAT_WEBHOOK_URL, TELEGRAM_BOT_URL, CLINIC } from "@/lib/site-config";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
}

interface QuickReply {
  label: string;
  message: string;
  emoji: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SESSION_KEY = "smile_chat_session";
const MESSAGES_KEY = "smile_chat_messages";
const NAME_KEY = "smile_chat_name";

const QUICK_REPLIES: QuickReply[] = [
  { emoji: "📅", label: "Agendar cita", message: "Quiero agendar una cita" },
  { emoji: "💰", label: "Ver precios", message: "¿Cuáles son sus precios?" },
  { emoji: "🦷", label: "Servicios", message: "¿Qué tratamientos ofrecen?" },
  { emoji: "📍", label: "Ubicación y horarios", message: "¿Dónde están y cuáles son sus horarios?" },
];

const WELCOME_TEXT = `¡Hola! 😊 Soy **Sofía**, la asistente virtual de **${CLINIC.name}**.\n\nEstoy aquí para ayudarte con información sobre servicios, precios y citas. ¿En qué te puedo ayudar?`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `web_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return `web_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

function buildWelcomeMessage(): Message {
  return { id: "welcome", role: "assistant", text: WELCOME_TEXT, ts: Date.now() };
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((https:\/\/cal\.com\/[^)]+)\)/g, (match, label, url) => {
      try {
        const u = new URL(url);
        const calLink = u.pathname.slice(1);
        const name = u.searchParams.get("name") || "";
        const email = u.searchParams.get("email") || "";
        const config = JSON.stringify({ name, email, layout: "column_view" });
        return `<button data-cal-link="${calLink}" data-cal-config='${config}' class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--navy)] to-[var(--cyan)] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 my-2 cursor-pointer w-full justify-center sm:w-auto"><span>📅</span> <span>${label}</span></button>`;
      } catch {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="font-medium text-[var(--cyan)] underline underline-offset-2 hover:text-[var(--navy)]">${label}</a>`;
      }
    })
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="font-medium text-[var(--cyan)] underline underline-offset-2 hover:text-[var(--navy)]">$1</a>')
    .replace(/\n/g, "<br />");
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--navy)] to-[var(--cyan)]">
        <Bot className="size-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-[var(--muted)] px-4 py-3.5">
        <span className="size-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex items-end gap-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-gradient-to-br from-[var(--cyan)] to-[var(--navy)]"
            : "bg-gradient-to-br from-[var(--navy)] to-[var(--cyan)]"
        )}
      >
        {isUser ? <User className="size-3.5 text-white" /> : <Bot className="size-3.5 text-white" />}
      </div>
      <div
        className={cn(
          "group max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-gradient-to-br from-[var(--navy)] to-[var(--cyan)] text-white"
            : "rounded-bl-sm bg-[var(--muted)] text-[var(--foreground)]"
        )}
      >
        <p
          dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}
          className="[&_strong]:font-semibold"
        />
        <p
          className={cn(
            "mt-0.5 text-right text-[10px] opacity-0 transition-opacity group-hover:opacity-60",
            isUser ? "text-white" : "text-[var(--muted-foreground)]"
          )}
        >
          {formatTime(msg.ts)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const userName = "Visitante";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(getOrCreateSessionId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hydrate from sessionStorage & Initialize Cal.com Embed
  useEffect(() => {
    // Cal.com Embed script loader
    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          p(cal, ar);
          cal.loaded = true;
        } else {
          p(cal, ar);
        }
      };
      C.Cal = cal;
      if (!document.getElementById("cal-embed-script")) {
        let s = document.createElement("script");
        s.id = "cal-embed-script";
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://app.cal.com/embed/embed.js";
        let x = document.getElementsByTagName("script")[0];
        x?.parentNode?.insertBefore(s, x);
      }
      C.Cal("init", { origin: "https://cal.com" });
      C.Cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#0f172a" } },
        hideEventTypeDetails: false,
        layout: "column_view"
      });
    })(window as any, "https://app.cal.com/embed/embed.js", "Cal");

    try {
      const savedMsgs = sessionStorage.getItem(MESSAGES_KEY);
      if (savedMsgs) {
        const parsed = JSON.parse(savedMsgs) as Message[];
        setMessages(parsed.length ? parsed : [buildWelcomeMessage()]);
      } else {
        setMessages([buildWelcomeMessage()]);
      }
    } catch {
      setMessages([buildWelcomeMessage()]);
    }
  }, []);

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      try { sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages)); } catch { /* ok */ }
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");

    const userMsg: Message = { id: `u_${Date.now()}`, role: "user", text: text.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Timeout de 60 segundos para LLMs que pueden tardar
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000);

    try {
      const res = await fetch(WEBCHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userName: userName ?? "Visitante", message: text.trim() }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const replyText =
        data?.reply ??
        "Lo siento, tuve un problema técnico. Por favor intenta de nuevo o escríbenos al WhatsApp 😊";
      setMessages((prev) => [...prev, { id: `b_${Date.now()}`, role: "assistant", text: replyText, ts: Date.now() }]);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      setMessages((prev) => [
        ...prev,
        {
          id: `e_${Date.now()}`,
          role: "assistant",
          text: isTimeout
            ? "¡Sofía está pensando! ⏳ La respuesta tardó demasiado. Por favor intenta de nuevo."
            : "¡Ups! 😅 Algo salió mal. Por favor intenta de nuevo.",
          ts: Date.now()
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId, userName]);

  const showQuickReplies = messages.length <= 1 && !loading;

  return (
    <>
      {/* ── Chat Panel ── */}
      {/*
        Mobile: left-3 right-3 (full-width with 12px margins each side)
        Desktop sm+: left-auto right-5 w-[380px]
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Chat con Sofía — Smile Studio"
        className={cn(
          // Base layout — bottom-20 clears the trigger button (bottom-5 + ~52px height)
          "fixed bottom-20 left-3 right-3 z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/8 transition-all duration-300",
          // Desktop: fixed width from right
          "sm:left-auto sm:right-5 sm:w-[380px] sm:rounded-3xl",
          // Open / closed state
          open
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-4 opacity-0 scale-95 pointer-events-none"
        )}
        style={{ maxHeight: "min(600px, calc(100dvh - 7rem))" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-[var(--navy)] to-[var(--cyan)] px-4 py-3">
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Bot className="size-5 text-white" />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-[var(--navy)] bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">Sofía · Asistente IA</p>
            <p className="text-[11px] text-white/70">{CLINIC.name} · En línea</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir en Telegram"
              className="flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-[10px] font-semibold text-white/90 transition-colors hover:bg-white/25"
            >
              {/* Telegram icon */}
              <svg viewBox="0 0 24 24" className="size-3 fill-current">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
              </svg>
              <span className="hidden xs:inline">Telegram</span>
            </a>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="grid size-7 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 scroll-smooth">
              {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}
              {loading && <TypingIndicator />}

              {/* Quick replies */}
              {showQuickReplies && (
                <div className="pt-1">
                  <p className="mb-2 text-center text-[11px] font-medium text-[var(--muted-foreground)]">
                    Preguntas frecuentes
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr.label}
                        onClick={() => !loading && sendMessage(qr.message)}
                        className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-left text-xs font-medium text-[var(--foreground)] transition-all hover:border-[var(--cyan)] hover:bg-[var(--cyan)]/8 hover:text-[var(--cyan-hover)] active:scale-95"
                      >
                        <span>{qr.emoji}</span>
                        <span className="leading-tight">{qr.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="shrink-0 border-t border-[var(--border)] bg-white px-3 pb-3 pt-2">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  maxLength={500}
                  disabled={loading}
                  className="h-10 flex-1 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 text-sm outline-none ring-[var(--cyan)] transition-all focus:bg-white focus:ring-2 disabled:opacity-50"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  id="chat-send-btn"
                  disabled={!input.trim() || loading}
                  aria-label="Enviar mensaje"
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--navy)] to-[var(--cyan)] text-white shadow-md transition-all disabled:opacity-40 active:scale-95"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </button>
              </form>
              <p className="mt-1.5 text-center text-[10px] text-[var(--muted-foreground)]">
                Con IA · También en{" "}
                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--cyan-hover)] underline-offset-2 hover:underline"
                >
                  Telegram
                </a>
              </p>
            </div>
          </div>
        </div>

      {/* ── Floating Trigger Button — bottom-right ── */}
      <button
        id="chat-widget-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat con Sofía"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-5 right-4 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--navy)] to-[var(--cyan)] p-3.5 text-white shadow-2xl shadow-[var(--cyan)]/40 ring-4 ring-white transition-all duration-300 hover:shadow-[var(--cyan)]/60 hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 sm:pl-4 sm:pr-5 sm:py-3"
        )}
      >
        <div className="relative">
          {open ? (
            <X className="size-5" />
          ) : (
            <>
              <MessageCircle className="size-5" />
              <span className="absolute -right-1 -top-1 flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>
            </>
          )}
        </div>
        <span className="hidden text-sm font-bold sm:inline">
          {open ? "Cerrar" : "Chatear con Sofía"}
        </span>
        {!open && <Sparkles className="hidden size-3.5 opacity-80 sm:inline" />}
      </button>
    </>
  );
}
