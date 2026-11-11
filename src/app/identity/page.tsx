
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const personas = [
  {
    aura: "Midnight Executive",
    identity: "Luxury Minimalist",
    colors: ["Black", "Silver", "White"],
    confidence: "94%",
    vibe: "Elegant, dominant, calm, and premium.",
    description: "Quiet authority. Unmistakable presence.",
    accent: "from-purple-500 to-violet-400",
    icon: "✦",
  },
  {
    aura: "Neon Phantom",
    identity: "Cyber Streetwear",
    colors: ["Purple", "Cyan", "Black"],
    confidence: "91%",
    vibe: "Bold futuristic energy with rebellious luxury.",
    description: "Fearless expression. Future-forward energy.",
    accent: "from-fuchsia-500 to-cyan-400",
    icon: "◈",
  },
  {
    aura: "Ivory Monarch",
    identity: "Old Money Elite",
    colors: ["Cream", "Gold", "Brown"],
    confidence: "97%",
    vibe: "Quiet luxury with timeless sophistication.",
    description: "Timeless elegance. Effortless refinement.",
    accent: "from-amber-400 to-yellow-200",
    icon: "♛",
  },
];

const colorValues: Record<string, string> = {
  Black: "#171717",
  Silver: "#A1A1AA",
  White: "#F4F4F5",
  Purple: "#A855F7",
  Cyan: "#22D3EE",
  Cream: "#F5E6C8",
  Gold: "#D4AF37",
  Brown: "#795548",
};

export default function IdentityPage() {
  const [persona, setPersona] = useState(personas[0]);
  const [generationCount, setGenerationCount] = useState(0);

  const generatePersona = () => {
    const availablePersonas = personas.filter(
      (item) => item.aura !== persona.aura
    );

    const randomPersona =
      availablePersonas[
        Math.floor(Math.random() * availablePersonas.length)
      ];

    setPersona(randomPersona);
    setGenerationCount((count) => count + 1);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08070D] text-white">
      <Sidebar />

      <div className="min-h-screen px-5 pb-12 pt-8 lg:ml-[232px] lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-[1250px]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-9"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                Your personal style DNA
              </p>
            </div>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  Fashion Identity
                  <span className="text-purple-400">.</span>
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
                  Discover the aesthetic that defines your presence.
                  Generate a new fashion identity and explore your signature
                  aura.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-lg text-purple-300">
                  ✧
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Identities explored</p>
                  <p className="text-lg font-bold tabular-nums">
                    {generationCount + 1}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main identity card */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111019]"
          >
            <div className="pointer-events-none absolute -right-32 -top-40 h-[430px] w-[430px] rounded-full bg-purple-600/[0.12] blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 h-[350px] w-[350px] rounded-full bg-violet-700/[0.10] blur-[100px]" />

            <div className="relative grid lg:grid-cols-[1.1fr_0.9fr]">
              {/* Left content */}
              <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
                <div className="mb-8 flex items-center gap-2">
                  <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-300">
                    AI Generated Identity
                  </span>
                  <span className="text-xs text-zinc-600">01 / 03</span>
                </div>

                <motion.div
                  key={persona.aura}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Your current aura
                  </p>

                  <h2
                    className={`bg-gradient-to-r ${persona.accent} bg-clip-text text-4xl font-black leading-tight tracking-tight text-transparent md:text-6xl`}
                  >
                    {persona.aura}
                  </h2>

                  <p className="mt-4 text-lg font-medium text-zinc-200 md:text-xl">
                    {persona.identity}
                  </p>

                  <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
                    {persona.description}
                  </p>
                </motion.div>

                <div className="my-8 h-px w-full bg-white/[0.08]" />

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="mb-2 text-xs text-zinc-500">
                      Confidence score
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {persona.confidence}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                      <motion.div
                        key={persona.confidence}
                        initial={{ width: 0 }}
                        animate={{ width: persona.confidence }}
                        transition={{ duration: 0.7 }}
                        className={`h-full rounded-full bg-gradient-to-r ${persona.accent}`}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs text-zinc-500">
                      Identity type
                    </p>
                    <p className="text-sm font-semibold text-zinc-200">
                      {persona.identity}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Personal aesthetic
                    </p>
                  </div>
                </div>

                <button
                  onClick={generatePersona}
                  className="mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-4 text-sm font-bold shadow-lg shadow-purple-950/30 transition duration-300 hover:scale-[1.01] hover:shadow-purple-900/30 active:scale-[0.99] sm:w-fit sm:min-w-[220px]"
                >
                  <span className="text-lg">✧</span>
                  Generate New Identity
                  <span className="text-lg">→</span>
                </button>

                <p className="mt-3 text-xs text-zinc-600">
                  Explore a different aesthetic with each generation.
                </p>
              </div>

              {/* Right visual */}
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden border-t border-white/[0.06] bg-[#0C0A13] p-8 lg:min-h-[570px] lg:border-l lg:border-t-0">
                <div className="absolute h-[260px] w-[260px] rounded-full border border-purple-400/10 md:h-[340px] md:w-[340px]" />
                <div className="absolute h-[210px] w-[210px] rounded-full border border-purple-400/[0.12] md:h-[275px] md:w-[275px]" />
                <div className="absolute h-[160px] w-[160px] rounded-full bg-purple-600/10 blur-3xl md:h-[220px] md:w-[220px]" />

                <motion.div
                  key={persona.aura + "-visual"}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br ${persona.accent} p-[1px] shadow-[0_0_80px_rgba(139,92,246,0.15)] md:h-64 md:w-64`}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#100D18]">
                    <span
                      className={`bg-gradient-to-r ${persona.accent} bg-clip-text text-7xl text-transparent md:text-8xl`}
                    >
                      {persona.icon}
                    </span>
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                      AURA IDENTITY
                    </p>
                  </div>
                </motion.div>

                <div className="absolute left-5 top-7 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 backdrop-blur-xl md:left-10 md:top-12">
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500">
                    Style energy
                  </p>
                  <p className="mt-1 text-xs font-semibold text-purple-200">
                    {persona.identity}
                  </p>
                </div>

                <div className="absolute bottom-7 right-5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 backdrop-blur-xl md:bottom-12 md:right-10">
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500">
                    Signature aura
                  </p>
                  <p className="mt-1 text-xs font-semibold text-zinc-200">
                    {persona.aura}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Identity details */}
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {/* Signature colors */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[24px] border border-white/[0.07] bg-[#111019] p-6 md:p-7"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Your palette
                  </p>
                  <h3 className="mt-2 text-xl font-bold">Signature Colors</h3>
                </div>
                <span className="text-xl text-purple-300">◉</span>
              </div>

              <div className="flex flex-wrap gap-4">
                {persona.colors.map((color) => (
                  <motion.div
                    key={color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-w-[75px] flex-col items-center gap-2"
                  >
                    <div
                      className="h-14 w-14 rounded-2xl border border-white/10 shadow-lg"
                      style={{
                        backgroundColor: colorValues[color] || "#A855F7",
                      }}
                    />
                    <span className="text-xs text-zinc-400">{color}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Style vibe */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-[24px] border border-white/[0.07] bg-[#111019] p-6 md:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Personality
                  </p>
                  <h3 className="mt-2 text-xl font-bold">Your Style Vibe</h3>
                </div>
                <span className="text-xl text-purple-300">✧</span>
              </div>

              <motion.p
                key={persona.vibe}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base leading-8 text-zinc-300"
              >
                &ldquo;{persona.vibe}&rdquo;
              </motion.p>

              <div className="mt-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-xs text-zinc-500">
                  A reflection of your fashion identity
                </span>
              </div>
            </motion.section>
          </div>

          {/* Other identities */}
          <section className="mt-10">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                  Explore aesthetics
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Other Fashion Identities
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                Select an identity to explore
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {personas.map((item, index) => {
                const isActive = persona.aura === item.aura;

                return (
                  <motion.button
                    key={item.aura}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => setPersona(item)}
                    className={`rounded-2xl border p-5 text-left transition duration-300 hover:-translate-y-1 ${
                      isActive
                        ? "border-purple-400/40 bg-purple-500/[0.09]"
                        : "border-white/[0.07] bg-[#111019] hover:border-purple-400/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`bg-gradient-to-r ${item.accent} bg-clip-text text-2xl text-transparent`}
                      >
                        {item.icon}
                      </span>
                      {isActive && (
                        <span className="rounded-full bg-purple-500/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-purple-300">
                          Active
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-zinc-100">{item.aura}</h4>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.identity}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        {item.colors.map((color) => (
                          <span
                            key={color}
                            title={color}
                            className="h-5 w-5 rounded-full border-2 border-[#111019]"
                            style={{
                              backgroundColor:
                                colorValues[color] || "#A855F7",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {item.confidence} match
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <p className="mt-12 text-center text-xs text-zinc-700">
            AURA AI · Define your style. Own your identity.
          </p>
        </div>
      </div>
    </main>
  );
}
