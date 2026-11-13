"use client";

import { useState, useSyncExternalStore, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  Check,
  CircleHelp,
  Lightbulb,
  MessageCircle,
  Sparkles,
  UserRound,
  WandSparkles,
} from "lucide-react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

type WardrobeItem = {
  image?: string;
  category: string;
};

const EMPTY_WARDROBE: WardrobeItem[] = [];

let cachedRaw: string | null | undefined;
let cachedWardrobe: WardrobeItem[] = EMPTY_WARDROBE;

function getWardrobe(): WardrobeItem[] {
  if (typeof window === "undefined") return EMPTY_WARDROBE;

  const stored = localStorage.getItem("wardrobe");

  if (stored === cachedRaw) return cachedWardrobe;

  cachedRaw = stored;

  try {
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    cachedWardrobe = Array.isArray(parsed)
      ? (parsed as WardrobeItem[])
      : EMPTY_WARDROBE;
  } catch {
    cachedWardrobe = EMPTY_WARDROBE;
  }

  return cachedWardrobe;
}

function subscribeToWardrobe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
const MAX_MESSAGE_LENGTH = 1000;
const suggestions = [
  {
    title: "Build an outfit",
    prompt: "Build me a stylish outfit for today using versatile pieces.",
    icon: WandSparkles,
  },
  {
    title: "Style for an occasion",
    prompt: "Suggest an outfit for a smart casual occasion.",
    icon: Sparkles,
  },
  {
    title: "Color combinations",
    prompt: "What color combinations look premium and balanced?",
    icon: Lightbulb,
  },
  {
    title: "Improve my look",
    prompt: "How can I make my everyday outfits look more polished?",
    icon: CircleHelp,
  },
];

export default function StylistPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello. I’m your AI Fashion Stylist. Ask me anything about outfits, styling, occasions, or fashion moods.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const wardrobe = useSyncExternalStore(
    subscribeToWardrobe,
    getWardrobe,
    () => EMPTY_WARDROBE
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (messageText?: string) => {
    const currentInput = (messageText ?? input).trim();
    if (!currentInput || loading) return;

    const userMessage: Message = {
      sender: "user",
      text: currentInput,
    };

    setMessages((prev) => [...prev, userMessage]);

    const conversationContext = messages
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join("\n");

    const wardrobeContext = wardrobe
      .map((item) => item.category)
      .join(", ");

    setInput("");
    setLoading(true);

    try {
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("Please log in to use the AI Stylist.");
      }

      const idToken = await user.getIdToken();
      
      const response = await fetch("/api/stylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          message: currentInput,
          conversationContext,
          wardrobeContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response.");
      }

      const aiMessage: Message = {
        sender: "ai",
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Stylist AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong with AI response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08070d] text-white">
      <Sidebar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-[-180px] h-[480px] w-[480px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-[-180px] h-[480px] w-[480px] rounded-full bg-fuchsia-700/10 blur-[140px]" />
      </div>

      <div className="relative z-10 min-h-screen px-4 pb-8 pt-7 sm:px-7 lg:ml-[232px] lg:px-9 lg:pt-9">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1450px] flex-col">
          {/* Page heading */}
          <header className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-violet-200">
                <Sparkles size={14} />
                AURA INTELLIGENCE
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Your personal{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent">
                  style advisor.
                </span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                A thoughtful styling companion for outfits, color, occasions,
                and the pieces already in your wardrobe.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200">
                <MessageCircle size={17} />
              </div>
              <div>
                <p className="text-xs font-medium text-white/80">Styling session</p>
                <p className="mt-0.5 text-[11px] text-white/35">
                  {messages.length - 1} messages · Live
                </p>
              </div>
              <span className="ml-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
            </div>
          </header>

          {/* Main workspace */}
          <section className="grid flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_285px]">
            <div className="flex min-h-[650px] flex-col overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#100e18]/90 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              {/* Chat top bar */}
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 text-violet-200">
                    <Bot size={21} />
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#100e18] bg-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white/90">
                      AURA Stylist
                    </h2>
                    <p className="mt-0.5 text-xs text-white/35">
                      Your fashion conversation
                    </p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/40 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  AI assistant ready
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-7 sm:py-8">
                <div className="mx-auto flex max-w-xl items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
                  <span className="h-px flex-1 bg-white/[0.07]" />
                  Conversation
                  <span className="h-px flex-1 bg-white/[0.07]" />
                </div>

                {messages.map((message, index) => {
                  const isUser = message.sender === "user";

                  return (
                    <motion.div
                      key={`${index}-${message.sender}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      className={`flex items-end gap-3 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-500/10 text-violet-200">
                          <Sparkles size={14} />
                        </div>
                      )}

                      <div
                        className={`max-w-[88%] whitespace-pre-wrap break-words rounded-[22px] px-4 py-3.5 text-sm leading-6 sm:max-w-[78%] sm:px-5 ${
                          isUser
                            ? "rounded-br-md bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-[0_8px_28px_rgba(124,58,237,0.18)]"
                            : "rounded-bl-md border border-white/[0.07] bg-white/[0.045] text-white/75"
                        }`}
                      >
                        {message.text}
                      </div>

                      {isUser && (
                        <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/55">
                          <UserRound size={14} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-500/10 text-violet-200">
                      <Sparkles size={14} />
                    </div>
                    <div className="flex items-center gap-2 rounded-[22px] rounded-bl-md border border-white/[0.07] bg-white/[0.045] px-5 py-4">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300 [animation-delay:-0.25s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300 [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300" />
                      <span className="ml-2 text-xs text-white/40">
                        AURA is thinking
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="border-t border-white/[0.07] bg-black/10 p-4 sm:p-6">
                <div className="flex items-center gap-2 rounded-[20px] border border-white/[0.09] bg-[#171420] p-2 pl-4 transition focus-within:border-violet-400/40 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]">
                  <input
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      void sendMessage();
    }
  }}
  maxLength={MAX_MESSAGE_LENGTH}
  placeholder="Ask about your next look..."
  aria-label="Message your AI stylist"
  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25"
/>
<div className="mt-3 flex items-center justify-between gap-3 px-1"></div>
                  <button
                    type="button"
                    disabled={loading || !input.trim()}
                    onClick={() => void sendMessage()}
                    aria-label="Send message"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowUp size={19} />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 px-1">
  <p className="text-[10px] text-white/25">
    AURA can make mistakes. Use your own style judgment.
  </p>

  <p
    className={`text-[10px] ${
      input.length >= MAX_MESSAGE_LENGTH
        ? "text-red-400"
        : "text-white/35"
    }`}
  >
    {input.length}/{MAX_MESSAGE_LENGTH} characters
  </p>

  <p className="hidden text-[10px] text-white/25 sm:block">
    Press Enter to send
  </p>
</div>
              </div>
            </div>

            {/* Right rail */}
            <aside className="space-y-5">
              <div className="rounded-[25px] border border-white/[0.08] bg-[#100e18]/85 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-200">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/85">
                      Start with an idea
                    </h3>
                    <p className="text-[11px] text-white/35">
                      Choose a prompt to begin
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {suggestions.map((suggestion) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={suggestion.title}
                        type="button"
                        disabled={loading}
                        onClick={() => void sendMessage(suggestion.prompt)}
                        className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:border-violet-400/25 hover:bg-violet-500/[0.07] disabled:opacity-40"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/45 transition group-hover:bg-violet-500/15 group-hover:text-violet-200">
                          <Icon size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-medium text-white/75">
                            {suggestion.title}
                          </span>
                          <span className="mt-1 block text-[10px] leading-4 text-white/30">
                            {suggestion.prompt}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-hidden rounded-[25px] border border-violet-300/15 bg-gradient-to-br from-violet-500/[0.13] via-[#171120] to-fuchsia-500/[0.07] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200/15 bg-violet-300/10 text-violet-200">
                    <WandSparkles size={17} />
                  </div>
                  <span className="rounded-full border border-violet-200/15 bg-violet-300/[0.07] px-2.5 py-1 text-[9px] font-semibold tracking-wider text-violet-200/80">
                    YOUR WARDROBE
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white/90">
                  Style with what you own.
                </h3>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  AURA shares your wardrobe categories with the stylist so
                  suggestions can take your existing pieces into account.
                </p>
                <div className="mt-5 flex items-end justify-between border-t border-white/[0.08] pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                      Categories available
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
                      {new Set(wardrobe.map((item) => item.category)).size}
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    {["S", "P", "J", "A"].map((letter, index) => (
                      <span
                        key={letter}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#171120] text-[10px] font-semibold ${
                          index % 2 === 0
                            ? "bg-violet-400/20 text-violet-200"
                            : "bg-fuchsia-400/15 text-fuchsia-200"
                        }`}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[25px] border border-white/[0.08] bg-[#100e18]/85 p-5">
                <div className="flex items-center gap-2 text-white/75">
                  <Check size={15} className="text-emerald-300" />
                  <h3 className="text-xs font-semibold">Better styling prompts</h3>
                </div>
                <ul className="mt-3 space-y-2.5 text-[11px] leading-5 text-white/40">
                  <li>• Mention the occasion and dress code.</li>
                  <li>• Share colors or pieces you want to wear.</li>
                  <li>• Describe the mood: minimal, bold, or classic.</li>
                </ul>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}
