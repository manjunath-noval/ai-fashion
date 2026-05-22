"use client";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { useState } from "react";

const styles = [
  "Minimal",
  "Streetwear",
  "Luxury",
  "Casual",
  "Old Money",
  "Techwear",
];

export default function OnboardingPage() {

  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const handleSelect = (style: string) => {

    if (selected.includes(style)) {
      setSelected(selected.filter((item) => item !== style));
    } else {
      setSelected([...selected, style]);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500 opacity-20 blur-[120px]" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >

          <div className="mb-5 inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
            AI Style Identity Setup
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Define Your
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Fashion Energy
            </span>
          </h1>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            Select the styles that represent your personality.
            AI will generate your unique fashion identity.
          </p>

        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 w-full max-w-6xl"
        >

          {styles.map((style, index) => {

            const isSelected = selected.includes(style);

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(style)}
                className={`
                  relative cursor-pointer rounded-3xl p-8 backdrop-blur-xl transition duration-300 border
                  ${isSelected
                    ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                    : "bg-white/5 border-white/10 hover:border-cyan-400"}
                `}
              >

                {/* Glow Dot */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 mb-6" />

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3">
                  {style}
                </h2>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  AI-curated fashion aesthetics for modern personalized styling experiences.
                </p>

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-5 right-5 bg-cyan-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}

              </motion.div>
            );
          })}

        </motion.div>

        {/* Selected Styles */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">

          {selected.map((item, index) => (
            <div
              key={index}
              className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300"
            >
              {item}
            </div>
          ))}

        </div>

        {/* Continue Button */}
        <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.96 }}
  onClick={() => router.push("/identity")}
  className="mt-16 bg-gradient-to-r from-purple-500 to-cyan-500 px-10 py-5 rounded-full text-lg font-semibold shadow-2xl"
>
  Continue to AI Styling
</motion.button>

      </div>

    </main>
  );
}