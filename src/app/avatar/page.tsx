
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const avatars = [
  {
    aura: "Midnight Executive",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    vibe: "Luxury minimalist with dominant calm energy.",
    description: "Refined presence. Effortless authority.",
    accent: "from-purple-500 to-violet-400",
    number: "01",
  },
  {
    aura: "Cyber Phantom",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    vibe: "Futuristic streetwear aura with neon confidence.",
    description: "Bold expression. A futuristic edge.",
    accent: "from-fuchsia-500 to-cyan-400",
    number: "02",
  },
  {
    aura: "Ivory Monarch",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    vibe: "Old money sophistication and timeless elegance.",
    description: "Quiet luxury. Timeless sophistication.",
    accent: "from-amber-400 to-yellow-200",
    number: "03",
  },
];

export default function AvatarPage() {
  const [avatar, setAvatar] = useState(avatars[0]);
  const [generationCount, setGenerationCount] = useState(0);

  const generateAvatar = () => {
    const availableAvatars = avatars.filter(
      (item) => item.aura !== avatar.aura
    );

    const randomAvatar =
      availableAvatars[
        Math.floor(Math.random() * availableAvatars.length)
      ];

    setAvatar(randomAvatar);
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
                Your digital fashion identity
              </p>
            </div>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  AI Persona Avatar
                  <span className="text-purple-400">.</span>
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
                  Explore cinematic fashion identities and discover
                  the visual expression of your personal style.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-xl text-purple-300">
                  ✧
                </div>
                <div>
                  <p className="text-xs text-zinc-500">
                    Avatars explored
                  </p>
                  <p className="text-lg font-bold tabular-nums">
                    {generationCount + 1}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main avatar showcase */}
          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111019]"
          >
            <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-purple-600/[0.12] blur-[110px]" />

            <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">

              {/* Avatar image */}
              <div className="relative min-h-[380px] overflow-hidden bg-[#0C0A13] p-4 md:p-7 lg:min-h-[650px]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-black/40" />

                <motion.div
                  key={avatar.aura}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-[380px] overflow-hidden rounded-[22px] border border-white/[0.08] md:h-[560px] lg:h-full lg:min-h-[590px]"
                >
                  <Image
                    src={avatar.image}
                    alt={avatar.aura}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                  <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl">
                    AURA Portrait · {avatar.number}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-purple-200">
                      Digital identity
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                      {avatar.aura}
                    </h2>
                  </div>
                </motion.div>
              </div>

              {/* Identity information */}
              <div className="relative flex flex-col justify-center p-6 md:p-10 lg:p-12">
                <div className="mb-8 flex items-center gap-2">
                  <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-300">
                    AI Generated Identity
                  </span>
                  <span className="text-xs text-zinc-600">
                    {avatar.number} / 03
                  </span>
                </div>

                <motion.div
                  key={avatar.aura + "-details"}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Your avatar aesthetic
                  </p>

                  <h2
                    className={`bg-gradient-to-r ${avatar.accent} bg-clip-text text-4xl font-black leading-tight tracking-tight text-transparent md:text-5xl`}
                  >
                    {avatar.aura}
                  </h2>

                  <p className="mt-5 text-lg leading-8 text-zinc-300">
                    {avatar.vibe}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    {avatar.description}
                  </p>
                </motion.div>

                <div className="my-8 h-px w-full bg-white/[0.08]" />

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="mb-2 text-xs text-zinc-500">
                      Identity category
                    </p>
                    <p className="text-sm font-semibold text-zinc-200">
                      Fashion Persona
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs text-zinc-500">
                      Visual style
                    </p>
                    <p className="text-sm font-semibold text-zinc-200">
                      Cinematic Portrait
                    </p>
                  </div>
                </div>

                <button
                  onClick={generateAvatar}
                  className="mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-4 text-sm font-bold shadow-lg shadow-purple-950/30 transition duration-300 hover:scale-[1.01] hover:shadow-purple-900/30 active:scale-[0.99] sm:w-fit sm:min-w-[220px]"
                >
                  <span className="text-lg">✧</span>
                  Generate New Avatar
                  <span className="text-lg">→</span>
                </button>

                <p className="mt-3 text-xs text-zinc-600">
                  Explore another visual identity.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Avatar collection */}
          <section className="mt-10">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                  Your visual collection
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Explore Avatars
                </h3>
              </div>

              <p className="text-xs text-zinc-500">
                Select a portrait to preview
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {avatars.map((item, index) => {
                const isActive = avatar.aura === item.aura;

                return (
                  <motion.button
                    key={item.aura}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => setAvatar(item)}
                    className={`group overflow-hidden rounded-2xl border text-left transition duration-300 hover:-translate-y-1 ${
                      isActive
                        ? "border-purple-400/40 bg-purple-500/[0.08]"
                        : "border-white/[0.07] bg-[#111019] hover:border-purple-400/20"
                    }`}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.aura}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[9px] font-bold tracking-widest text-white/80 backdrop-blur-xl">
                        AVATAR {item.number}
                      </div>

                      {isActive && (
                        <span className="absolute right-4 top-4 rounded-full bg-purple-500/80 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                          Selected
                        </span>
                      )}

                      <h4 className="absolute bottom-4 left-4 text-lg font-bold text-white">
                        {item.aura}
                      </h4>
                    </div>

                    <div className="p-4">
                      <p className="text-xs leading-6 text-zinc-400">
                        {item.vibe}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Preview identity
                        </span>
                        <span className="text-sm text-purple-300">
                          →
                        </span>
                      </div>
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
