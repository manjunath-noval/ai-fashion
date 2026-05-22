"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const avatars = [

  {
    aura: "Midnight Executive",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    vibe:
      "Luxury minimalist with dominant calm energy.",
  },

  {
    aura: "Cyber Phantom",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    vibe:
      "Futuristic streetwear aura with neon confidence.",
  },

  {
    aura: "Ivory Monarch",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    vibe:
      "Old money sophistication and timeless elegance.",
  },

];

export default function AvatarPage() {

  const [avatar, setAvatar] =
    useState(avatars[0]);

  const generateAvatar = () => {

    const randomAvatar =
      avatars[
        Math.floor(
          Math.random() * avatars.length
        )
      ];

    setAvatar(randomAvatar);

  };

  return (

    <main className="min-h-screen bg-black text-white flex overflow-x-hidden">

      <Sidebar />

      <div className="flex-1 md:ml-[260px] p-5 md:p-10">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto rounded-[25px] md:rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-10"
        >

          <h1 className="text-3xl md:text-6xl font-black mb-4">

            AI Persona Avatar

          </h1>

          <p className="text-gray-400 text-lg mb-10">

            Generate cinematic fashion identities.

          </p>

          <button
            onClick={generateAvatar}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold text-lg hover:scale-105 transition"
          >

            Generate Avatar

          </button>

          <motion.div
            key={avatar.aura}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 grid lg:grid-cols-2 gap-5 md:p-10 items-center"
          >

            <div className="relative">

              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                }}
                className="absolute inset-0 rounded-[35px] bg-cyan-500/20 blur-3xl"
              />

              <img
                src={avatar.image}
                alt="avatar"
                className="relative rounded-[35px] h-[320px] md:h-[500px] w-full object-cover border border-white/10"
              />

            </div>

            <div>

              <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-cyan-300 mb-6">

                AI Generated Identity

              </div>

              <h2 className="text-5xl font-black mb-8 text-cyan-400">

                {avatar.aura}

              </h2>

              <p className="text-2xl text-gray-300 leading-relaxed">

                {avatar.vibe}

              </p>

            </div>

          </motion.div>

        </motion.div>

      </div>

    </main>

  );

}