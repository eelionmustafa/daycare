"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconSun } from "@/components/icons";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Përshëndetje! Unë jam asistenti i Mësimit Kreativ. Si mund t'ju ndihmoj?",
};

const SUGGESTIONS = [
  "Si ta regjistroj fëmijën?",
  "Çfarë moshash pranoni?",
  "Cili është orari juaj?",
  "Ku ndodheni?",
  "Cilat aktivitete ofroni?",
  "A ofroni ushqim për fëmijët?",
  "Si të regjistrohem për një vizitë?",
];

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            data.reply ??
            "Më falni, diçka nuk shkoi. Provoni përsëri ose na telefononi direkt.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Nuk arrita të lidhem. Provoni përsëri pas pak." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="mb-3 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-ink/5"
          >
            <div className="flex items-center gap-3 bg-terracotta px-5 py-4 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <IconSun className="h-5.5 w-5.5" aria-hidden />
              </span>
              <div>
                <p className="font-display font-semibold leading-tight">Pyet Mësimin Kreativ</p>
                <p className="text-xs text-white/80">Përgjigjemi menjëherë</p>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-sage text-white"
                        : "rounded-bl-md bg-white text-ink shadow-soft"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex">
                  <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-soft">
                    <span className="inline-flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-ink-soft/50"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      onClick={() => send(sug)}
                      className="rounded-full border border-sage/40 bg-white px-3 py-1.5 text-xs font-semibold text-sage-deep transition-colors hover:bg-sage/10"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-ink/5 bg-white px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Shkruani pyetjen tuaj..."
                className="flex-1 rounded-full bg-cream px-4 py-2.5 text-sm outline-none placeholder:text-ink-soft/50"
                aria-label="Pyetja juaj"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta text-white transition-colors hover:bg-terracotta-deep disabled:opacity-40"
                aria-label="Dërgo"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4Z" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-white shadow-lift"
        aria-label={open ? "Mbyll asistentin" : "Hap asistentin — Pyet Mësimin Kreativ"}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
