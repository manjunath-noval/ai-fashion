"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Palette,
  Sparkles,
  Watch,
  Zap,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const analytics = {
  luxuryScore: "94%",
  dominantStyle: "Luxury Minimalist",
  favoriteColors: ["Black", "White", "Silver"],
  wardrobeBalance: "Excellent",
  accessoryUsage: "Moderate",
  fashionAura: "Calm Elite Energy",
};

const metrics = [
  {
    label: "Luxury Score",
    value: analytics.luxuryScore,
    detail: "Your overall style rating",
    icon: Award,
    accent: "from-violet-500 to-fuchsia-500",
    iconColor: "text-violet-300",
  },
  {
    label: "Dominant Style",
    value: analytics.dominantStyle,
    detail: "Your strongest style identity",
    icon: Sparkles,
    accent: "from-fuchsia-500 to-purple-500",
    iconColor: "text-fuchsia-300",
  },
  {
    label: "Wardrobe Balance",
    value: analytics.wardrobeBalance,
    detail: "How well your wardrobe works together",
    icon: Activity,
    accent: "from-indigo-500 to-violet-500",
    iconColor: "text-indigo-300",
  },
  {
    label: "Accessory Usage",
    value: analytics.accessoryUsage,
    detail: "Your current accessory activity",
    icon: Watch,
    accent: "from-purple-500 to-pink-500",
    iconColor: "text-purple-300",
  },
];

export default function AnalyticsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08070d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute -bottom-48 left-[28%] h-[420px] w-[420px] rounded-full bg-fuchsia-700/[0.07] blur-[140px]" />
      </div>

      <Sidebar />

      <div className="relative min-h-screen lg:ml-[232px]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
                  AURA intelligence
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px]">
                  Fashion analytics
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                  A closer look at your wardrobe identity, signature style, and fashion energy.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Your style snapshot
              </div>
            </div>

            <section className="relative mb-7 overflow-hidden rounded-[28px] border border-violet-400/15 bg-gradient-to-br from-[#211638] via-[#151020] to-[#100d17] p-6 sm:p-8 lg:p-9">
              <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border border-violet-300/10" />
              <div className="pointer-events-none absolute -right-2 -top-16 h-56 w-56 rounded-full border border-violet-300/[0.08]" />
              <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-violet-200">
                    <Sparkles size={16} />
                    Your fashion identity
                  </div>
                  <h2 className="max-w-xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                    {analytics.fashionAura}
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-300/75">
                    Your current style profile leans toward refined, understated looks with a confident edge.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-200">
                      {analytics.dominantStyle}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-200">
                      {analytics.wardrobeBalance} balance
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-start md:justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-violet-300/20 bg-violet-400/[0.06] shadow-[0_0_70px_rgba(139,92,246,0.13)] sm:h-52 sm:w-52">
                    <div className="absolute inset-3 rounded-full border border-dashed border-violet-200/20" />
                    <div className="text-center">
                      <div className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                        {analytics.luxuryScore}
                      </div>
                      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/70">
                        Luxury score
                      </div>
                    </div>
                    <Sparkles className="absolute right-7 top-7 text-violet-200" size={17} />
                    <span className="absolute bottom-7 left-7 h-2 w-2 rounded-full bg-fuchsia-300" />
                  </div>
                </div>
              </div>
            </section>

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Style breakdown</h2>
                <p className="mt-1 text-xs text-zinc-500">Your key wardrobe indicators</p>
              </div>
              <span className="text-xs text-zinc-500">06 insights</span>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.article
                    key={metric.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07, duration: 0.35 }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-[22px] border border-white/[0.075] bg-[#121019]/90 p-5 transition-colors hover:border-violet-400/25"
                  >
                    <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${metric.accent} opacity-60`} />
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.045]">
                        <Icon size={18} className={metric.iconColor} />
                      </div>
                      <ArrowUpRight size={16} className="text-zinc-600 transition-colors group-hover:text-violet-300" />
                    </div>
                    <p className="text-xs font-medium text-zinc-500">{metric.label}</p>
                    <p className="mt-2 min-h-9 text-2xl font-semibold tracking-tight text-zinc-100">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">{metric.detail}</p>
                  </motion.article>
                );
              })}
            </section>

            <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="rounded-[22px] border border-white/[0.075] bg-[#121019]/90 p-6 sm:p-7"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <Palette size={19} />
                  </div>
                  <div>
                    <h2 className="font-semibold">Your color palette</h2>
                    <p className="mt-1 text-xs text-zinc-500">Favorite colors in your style profile</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {analytics.favoriteColors.map((color) => (
                    <div
                      key={color}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 text-center"
                    >
                      <div
                        className={`mx-auto mb-3 h-12 w-12 rounded-full border border-white/15 shadow-inner ${
                          color === "Black"
                            ? "bg-[#17171c]"
                            : color === "White"
                              ? "bg-[#eeeeef]"
                              : "bg-gradient-to-br from-[#f0f0f2] via-[#aeb0b8] to-[#666975]"
                        }`}
                      />
                      <span className="text-sm font-medium text-zinc-200">{color}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-[22px] border border-white/[0.075] bg-[#121019]/90 p-6 sm:p-7"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-300">
                    <Zap size={19} />
                  </div>
                  <div>
                    <h2 className="font-semibold">AURA style notes</h2>
                    <p className="mt-1 text-xs text-zinc-500">A quick read of your current profile</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-violet-300" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Strong style direction</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {analytics.dominantStyle} is your dominant style.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-violet-300" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Wardrobe balance</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        Your current wardrobe balance is {analytics.wardrobeBalance.toLowerCase()}.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-violet-300" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Accessory activity</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        Accessory usage is {analytics.accessoryUsage.toLowerCase()}.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <div className="mt-7 flex items-center gap-2 border-t border-white/[0.06] pt-5 text-xs text-zinc-600">
              <Sparkles size={13} className="text-violet-400" />
              AURA insights reflect the analytics currently configured in your app.
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
