
"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const styles = [
  {
    name: "Minimal",
    description: "Clean silhouettes, subtle details, and effortless simplicity.",
    icon: "◻",
    accent: "from-zinc-400 to-zinc-200",
  },
  {
    name: "Streetwear",
    description: "Urban culture, oversized fits, and expressive combinations.",
    icon: "◈",
    accent: "from-purple-500 to-pink-400",
  },
  {
    name: "Luxury",
    description: "Premium aesthetics, refined details, and elevated elegance.",
    icon: "✦",
    accent: "from-amber-400 to-yellow-200",
  },
  {
    name: "Casual",
    description: "Comfortable everyday outfits with a naturally polished look.",
    icon: "◇",
    accent: "from-blue-400 to-cyan-300",
  },
  {
    name: "Old Money",
    description: "Timeless sophistication, classic tailoring, and quiet luxury.",
    icon: "♛",
    accent: "from-amber-300 to-orange-200",
  },
  {
    name: "Techwear",
    description: "Functional fashion, futuristic layers, and modern utility.",
    icon: "⌘",
    accent: "from-violet-500 to-cyan-400",
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const handleSelect = (style: string) => {
    setSelected((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style]
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08070D] text-white">
      {/* Background lighting */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-purple-600/[0.13] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-violet-600/[0.10] blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1250px] flex-col px-5 py-8 md:px-10 md:py-12">
        {/* Top navigation */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-400 text-xl font-black">
              A
            </div>
            <div>
              <p className="text-lg font-black tracking-[0.18em]">AURA</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                AI Fashion Studio
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">
            Step <span className="font-bold text-white">01</span> / 02
          </span>
        </motion.div>

        {/* Progress */}
        <div className="mb-10 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-400"
          />
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
              Your style identity setup
            </span>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Define Your
            <span className="block bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Fashion Energy.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Every style tells a story. Choose the aesthetics that reflect
            your personality and create your unique fashion identity.
          </p>
        </motion.div>

        {/* Selection heading */}
        <div className="mt-14 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Choose your aesthetics
            </p>
            <h2 className="mt-2 text-xl font-bold">
              What represents your style?
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-purple-500/15 px-2 font-bold text-purple-300">
              {selected.length}
            </span>
            styles selected
          </div>
        </div>

        {/* Style cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {styles.map((style) => {
            const isSelected = selected.includes(style.name);

            return (
              <motion.button
                key={style.name}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(style.name)}
                aria-pressed={isSelected}
                className={`relative min-h-[190px] rounded-[22px] border p-6 text-left transition duration-300 ${
                  isSelected
                    ? "border-purple-400/50 bg-purple-500/[0.09] shadow-[0_0_30px_rgba(139,92,246,0.08)]"
                    : "border-white/[0.07] bg-[#111019] hover:border-purple-400/25 hover:bg-white/[0.04]"
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${style.accent} text-2xl text-[#100D18]`}
                  >
                    {style.icon}
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                      isSelected
                        ? "border-purple-400 bg-purple-500 text-white"
                        : "border-white/20 bg-white/[0.03] text-transparent"
                    }`}
                  >
                    <span className="text-xs">✓</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-zinc-100">
                  {style.name}
                </h3>

                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  {style.description}
                </p>

                {isSelected && (
                  <div className="absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-purple-500 to-violet-300" />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Selected styles */}
        <div className="mt-9 min-h-[65px] rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Your selected styles
          </p>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selected.map((item) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-200 transition hover:bg-purple-500/20"
                  aria-label={`Remove ${item}`}
                >
                  {item}
                  <span className="text-purple-300">×</span>
                </motion.button>
              ))}
            </AnimatePresence>

            {selected.length === 0 && (
              <p className="text-xs text-zinc-600">
                Your chosen aesthetics will appear here.
              </p>
            )}
          </div>
        </div>

        {/* Continue */}
        <div className="mt-9 flex flex-col items-center justify-between gap-5 border-t border-white/[0.06] pt-7 sm:flex-row">
          <p className="text-xs leading-5 text-zinc-500">
            You can explore and change your identity in the next step.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/identity")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 px-9 py-4 text-sm font-bold shadow-lg shadow-purple-950/30 transition hover:shadow-purple-900/30 sm:w-auto"
          >
            Continue to AI Styling
            <span className="text-lg">→</span>
          </motion.button>
        </div>

        <p className="mt-10 text-center text-[10px] tracking-wider text-zinc-700">
          AURA AI · DEFINE YOUR STYLE. OWN YOUR IDENTITY.
        </p>
      </div>
    </main>
  );
}
