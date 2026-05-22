"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const feeds = [

  {
    aura: "Minimal Elite",
    mood: "Calm Confidence",
    color: "Black & Silver",
    recommendation:
      "Monochrome layering with premium sneakers creates a timeless luxury aura.",
  },

  {
    aura: "Cyber Street",
    mood: "Bold Energy",
    color: "Purple & Cyan",
    recommendation:
      "Oversized silhouettes with futuristic accessories dominate today's vibe.",
  },

  {
    aura: "Old Money Core",
    mood: "Quiet Luxury",
    color: "Cream & Brown",
    recommendation:
      "Structured neutral layering creates effortless sophistication.",
  },

];

export default function FeedPage() {

  const today =
    feeds[
      new Date().getDate() %
      feeds.length
    ];

  return (

    <main className="min-h-screen bg-black text-white flex overflow-x-hidden">

      <Sidebar />

      <div className="flex-1 md:ml-[260px] p-5 md:p-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-[25px] md:rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-10"
        >

          <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-cyan-300 mb-6">

            Daily AI Feed

          </div>

          <h1 className="text-3xl md:text-6xl font-black mb-8">

            {today.aura}

          </h1>

          <div className="space-y-6 text-xl">

            <p>

              <span className="text-gray-400">
                Mood:
              </span>{" "}

              {today.mood}

            </p>

            <p>

              <span className="text-gray-400">
                Signature Colors:
              </span>{" "}

              {today.color}

            </p>

            <p>

              <span className="text-gray-400">
                AI Recommendation:
              </span>{" "}

              {today.recommendation}

            </p>

          </div>

          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="mt-12 h-[300px] rounded-[35px] bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-3xl font-black text-white/40"
          >

            AI Aura Energy

          </motion.div>

        </motion.div>

      </div>

    </main>

  );

}