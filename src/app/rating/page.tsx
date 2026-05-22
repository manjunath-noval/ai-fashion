"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const styleTypes = [
  "Luxury Minimalist",
  "Cyber Streetwear",
  "Elite Formal",
  "Modern Casual",
  "Old Money",
];

const suggestions = [
  "Add silver accessories for a cleaner luxury aesthetic.",
  "Neutral layering would improve outfit balance.",
  "White sneakers would increase versatility.",
  "A structured jacket would elevate the silhouette.",
  "Minimal accessories create a premium look.",
];

export default function RatingPage() {

  const [image, setImage] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<any>(null);

  const analyzeOutfit = () => {

    const randomScore =
      Math.floor(Math.random() * 10) + 90;

    const randomConfidence =
      Math.floor(Math.random() * 10) + 90;

    const randomStyle =
      styleTypes[
        Math.floor(
          Math.random() * styleTypes.length
        )
      ];

    const randomSuggestion =
      suggestions[
        Math.floor(
          Math.random() * suggestions.length
        )
      ];

    setResult({

      luxuryScore:
        `${randomScore}%`,

      confidence:
        `${randomConfidence}%`,

      style:
        randomStyle,

      suggestion:
        randomSuggestion,

    });

  };

  return (

    <main className="min-h-screen bg-black text-white flex overflow-x-hidden">

      <Sidebar />

      <div className="flex-1 md:ml-[260px] p-5 md:p-10">

        <h1 className="text-3xl md:text-6xl font-black mb-4">

          AI Outfit Rating

        </h1>

        <p className="text-gray-400 text-lg mb-10">

          Upload your outfit and receive AI fashion analysis.

        </p>

        <label className="cursor-pointer">

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {

              const file =
                e.target.files?.[0];

              if (file) {

                setImage(
                  URL.createObjectURL(file)
                );

              }

            }}
          />

          <div className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold text-lg hover:scale-105 transition">

            Upload Outfit

          </div>

        </label>

        {image && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >

            <img
              src={image}
              alt="outfit"
              className="w-[320px] h-[420px] object-cover rounded-[35px] border border-white/10"
            />

            <button
              onClick={analyzeOutfit}
              className="mt-8 px-8 py-4 rounded-full bg-cyan-500 text-black font-bold hover:scale-105 transition"
            >

              Analyze Outfit

            </button>

          </motion.div>

        )}

        {result && (

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-[25px] md:rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-10 max-w-3xl"
          >

            <h2 className="text-5xl font-black text-cyan-400 mb-8">

              AI Analysis

            </h2>

            <div className="space-y-6 text-xl">

              <p>

                <span className="text-gray-400">
                  Luxury Score:
                </span>{" "}

                {result.luxuryScore}

              </p>

              <p>

                <span className="text-gray-400">
                  Confidence Level:
                </span>{" "}

                {result.confidence}

              </p>

              <p>

                <span className="text-gray-400">
                  Style Type:
                </span>{" "}

                {result.style}

              </p>

              <p>

                <span className="text-gray-400">
                  AI Suggestion:
                </span>{" "}

                {result.suggestion}

              </p>

            </div>

          </motion.div>

        )}

      </div>

    </main>

  );

}