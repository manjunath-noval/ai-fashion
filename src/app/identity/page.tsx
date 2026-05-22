"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const personas = [

  {
    aura: "Midnight Executive",
    identity: "Luxury Minimalist",
    colors: ["Black", "Silver", "White"],
    confidence: "94%",
    vibe:
      "Elegant, dominant, calm, and premium.",
  },

  {
    aura: "Neon Phantom",
    identity: "Cyber Streetwear",
    colors: ["Purple", "Cyan", "Black"],
    confidence: "91%",
    vibe:
      "Bold futuristic energy with rebellious luxury.",
  },

  {
    aura: "Ivory Monarch",
    identity: "Old Money Elite",
    colors: ["Cream", "Gold", "Brown"],
    confidence: "97%",
    vibe:
      "Quiet luxury with timeless sophistication.",
  },

];

export default function IdentityPage() {

  const [persona, setPersona] =
    useState(personas[0]);

  const generatePersona = () => {

    const randomPersona =
      personas[
        Math.floor(
          Math.random() * personas.length
        )
      ];

    setPersona(randomPersona);

  };

  return (

    <main className="min-h-screen bg-black text-white flex overflow-x-hidden">

      <Sidebar />

      <div className="flex-1 md:ml-[260px] p-5 md:p-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-[25px] md:rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-10"
        >

          <h1 className="text-3xl md:text-6xl font-black mb-4">

            AI Fashion Identity

          </h1>

          <p className="text-gray-400 text-lg mb-10">

            Discover your luxury fashion aura.

          </p>

          <button
            onClick={generatePersona}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold text-lg hover:scale-105 transition"
          >

            Generate Persona

          </button>

          <motion.div
            key={persona.aura}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 rounded-[35px] bg-black/40 border border-white/10 p-5 md:p-10"
          >

            <h2 className="text-5xl font-black text-cyan-400 mb-6">

              {persona.aura}

            </h2>

            <div className="space-y-5 text-xl">

              <p>

                <span className="text-gray-400">
                  Fashion Identity:
                </span>{" "}

                {persona.identity}

              </p>

              <p>

                <span className="text-gray-400">
                  Signature Colors:
                </span>{" "}

                {persona.colors.join(", ")}

              </p>

              <p>

                <span className="text-gray-400">
                  Confidence Score:
                </span>{" "}

                {persona.confidence}

              </p>

              <p>

                <span className="text-gray-400">
                  Style Vibe:
                </span>{" "}

                {persona.vibe}

              </p>

            </div>

          </motion.div>

        </motion.div>

      </div>

    </main>

  );

}