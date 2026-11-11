
"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Palette,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const feeds = [
  {
    aura: "Minimal Elite",
    mood: "Calm Confidence",
    color: "Black & Silver",
    recommendation:
      "Monochrome layering with premium sneakers creates a timeless luxury aura.",
    gradient: "from-zinc-300/20 via-violet-500/20 to-zinc-500/10",
    accent: "text-violet-300",
    tag: "Quiet sophistication",
  },
  {
    aura: "Cyber Street",
    mood: "Bold Energy",
    color: "Purple & Cyan",
    recommendation:
      "Oversized silhouettes with futuristic accessories dominate the daily vibe.",
    gradient: "from-purple-500/25 via-fuchsia-500/15 to-cyan-500/20",
    accent: "text-fuchsia-300",
    tag: "Futuristic expression",
  },
  {
    aura: "Old Money Core",
    mood: "Quiet Luxury",
    color: "Cream & Brown",
    recommendation:
      "Structured neutral layering creates effortless sophistication.",
    gradient: "from-amber-200/15 via-stone-400/15 to-orange-500/10",
    accent: "text-amber-200",
    tag: "Timeless refinement",
  },
];

export default function FeedPage() {
  const today = feeds[new Date().getDate() % feeds.length];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08070d] text-white">
      {/* Background lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute -bottom-48 left-[20%] h-[450px] w-[450px] rounded-full bg-fuchsia-700/[0.07] blur-[140px]" />
      </div>

      <Sidebar />

      <div className="relative min-h-screen lg:ml-[232px]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
                AURA intelligence
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px]">
                Daily style feed
              </h1>

              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                Discover your daily fashion direction and style inspiration.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs text-zinc-400">
              <CalendarDays size={14} className="text-violet-300" />
              Daily inspiration
            </div>
          </motion.div>

          {/* Main feature */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[28px] border border-violet-400/15 bg-gradient-to-br from-[#211638] via-[#151020] to-[#100d17] p-6 sm:p-9 lg:p-11"
          >
            <div className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full border border-violet-300/10" />
            <div className="pointer-events-none absolute -right-8 -top-16 h-72 w-72 rounded-full border border-violet-300/[0.08]" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

              {/* Today's style */}
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-violet-200">
                    <Sparkles size={17} />
                  </div>

                  <span className="text-sm font-medium text-violet-200">
                    Today&apos;s AI style direction
                  </span>
                </div>

                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-300">
                  {today.tag}
                </div>

                <h2 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {today.aura}
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-300/75 sm:text-base">
                  Discover a style direction that reflects your personality
                  and gives your everyday outfits a distinctive identity.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                      Today&apos;s mood
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-100">
                      {today.mood}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                      Signature colors
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-100">
                      {today.color}
                    </p>
                  </div>
                </div>
              </div>

              {/* Animated visual */}
              <div className="relative flex min-h-[280px] items-center justify-center sm:min-h-[340px]">
                <div className="absolute h-64 w-64 rounded-full bg-violet-500/15 blur-[65px]" />

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 35,
                    ease: "linear",
                  }}
                  className="absolute h-64 w-64 rounded-full border border-dashed border-violet-300/20 sm:h-72 sm:w-72"
                />

                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className={`relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br ${today.gradient} shadow-[0_0_80px_rgba(139,92,246,0.16)] sm:h-60 sm:w-60`}
                >
                  <div className="absolute inset-4 rounded-full border border-white/10" />

                  <div className="text-center">
                    <Sparkles
                      size={34}
                      className={`mx-auto mb-4 ${today.accent}`}
                    />

                    <p className="text-xl font-bold tracking-wide">
                      AURA
                    </p>

                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                      Style energy
                    </p>
                  </div>
                </motion.div>

                <Sparkles
                  className="absolute right-[12%] top-[17%] text-violet-200/70"
                  size={19}
                />
                <Zap
                  className="absolute bottom-[17%] left-[12%] text-fuchsia-200/70"
                  size={20}
                />
              </div>
            </div>
          </motion.section>

          {/* Recommendation */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 rounded-[24px] border border-white/[0.075] bg-[#121019]/90 p-6 sm:p-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <Sparkles size={19} />
              </div>

              <div>
                <h3 className="font-semibold">AURA recommendation</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Your style inspiration for today
                </p>
              </div>
            </div>

            <p className="max-w-4xl text-base leading-8 text-zinc-300 sm:text-lg">
              {today.recommendation}
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-violet-300">
              <Sun size={15} />
              Make today&apos;s look your own
              <ArrowUpRight size={14} />
            </div>
          </motion.section>

          {/* Other style directions */}
          <section className="mt-9">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">
                Explore style directions
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Three distinct aesthetics in your daily feed
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {feeds.map((feed, index) => (
                <motion.article
                  key={feed.aura}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group overflow-hidden rounded-[22px] border border-white/[0.075] bg-[#121019]/90 transition-colors hover:border-violet-400/25"
                >
                  <div
                    className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${feed.gradient}`}
                  >
                    <div className="absolute h-28 w-28 rounded-full border border-white/10" />
                    <div className="absolute h-20 w-20 rounded-full border border-white/10" />
                    <Palette size={28} className="relative text-white/70" />

                    <span className="absolute right-4 top-4 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{feed.aura}</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {feed.tag}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-4">
                      <div className="flex justify-between gap-3 text-xs">
                        <span className="text-zinc-500">Mood</span>
                        <span className="text-zinc-300">{feed.mood}</span>
                      </div>

                      <div className="flex justify-between gap-3 text-xs">
                        <span className="text-zinc-500">Colors</span>
                        <span className="text-zinc-300">{feed.color}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <div className="mt-8 flex items-center gap-2 border-t border-white/[0.06] pt-5 text-xs text-zinc-600">
            <Sparkles size={13} className="text-violet-400" />
            Daily inspiration from your AURA style feed.
          </div>
        </div>
      </div>
    </main>
  );
}
