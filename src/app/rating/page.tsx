
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface OutfitAnalysis {
  luxuryScore: string;
  confidence: string;
  style: string;
  suggestion: string;
}

export default function RatingPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<OutfitAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setResult(null);
    setLoading(false);

    event.target.value = "";
  };

  const analyzeOutfit = () => {
    if (!image || loading) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 10) + 90;
      const randomConfidence = Math.floor(Math.random() * 10) + 90;

      const randomStyle =
        styleTypes[Math.floor(Math.random() * styleTypes.length)];

      const randomSuggestion =
        suggestions[Math.floor(Math.random() * suggestions.length)];

      setResult({
        luxuryScore: `${randomScore}%`,
        confidence: `${randomConfidence}%`,
        style: randomStyle,
        suggestion: randomSuggestion,
      });

      setLoading(false);
    }, 1200);
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08070D] text-white">
      <Sidebar />

      <div className="min-h-screen lg:ml-[232px]">
        <div className="pointer-events-none fixed right-0 top-0 -z-0 h-[420px] w-[420px] rounded-full bg-purple-700/10 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-8 md:px-10 md:py-10">

          {/* Header */}
          <header className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                AURA Intelligence
              </p>
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              Outfit <span className="text-purple-400">Rating</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 md:text-base">
              Discover your outfit&apos;s aesthetic, explore your style
              identity, and get suggestions to elevate your look.
            </p>
          </header>

          {/* Main Layout */}
          <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1.05fr_0.95fr]">

            {/* Upload Section */}
            <section className="rounded-[28px] border border-white/[0.08] bg-[#111019] p-5 md:p-7">

              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">Upload Your Outfit</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Start with a photo of your look
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5 text-purple-300"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {image ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black"
                  >
                    <div className="relative h-[380px] w-full md:h-[480px]">
                      <Image
                        src={image}
                        alt="Uploaded outfit preview"
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 650px"
                        className="object-contain"
                      />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-xl">
                      <div>
                        <p className="text-sm font-semibold">Outfit uploaded</p>
                        <p className="text-xs text-gray-400">
                          Ready for style analysis
                        </p>
                      </div>

                      <button
                        onClick={resetAnalysis}
                        className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold transition hover:bg-white/20"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.label
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex min-h-[380px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-purple-400/30 bg-purple-500/[0.04] px-5 text-center transition hover:border-purple-400/60 hover:bg-purple-500/[0.08] md:min-h-[480px]"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[25px] border border-purple-400/20 bg-purple-500/10">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-9 w-9 text-purple-300"
                      >
                        <path d="M12 16V4m-5 5 5-5 5 5" />
                        <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                      </svg>
                    </div>

                    <p className="text-lg font-bold">
                      Drop your outfit here
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Or click to browse your device
                    </p>

                    <span className="mt-6 rounded-full border border-purple-400/20 bg-purple-500/10 px-5 py-2 text-xs font-semibold text-purple-300">
                      Choose Image
                    </span>

                    <p className="mt-5 text-xs text-gray-600">
                      Supports JPG, PNG and other image formats
                    </p>
                  </motion.label>
                )}
              </AnimatePresence>

              {image && (
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={analyzeOutfit}
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-4 font-bold shadow-lg shadow-purple-900/20 transition hover:from-purple-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Analyzing Outfit...
                    </>
                  ) : (
                    <>
                      <span>✦</span>
                      Analyze My Outfit
                    </>
                  )}
                </motion.button>
              )}

              <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                <span className="text-purple-400">✦</span>
                Your uploaded image is previewed locally in this page.
              </div>
            </section>

            {/* Analysis Section */}
            <section className="flex flex-col gap-6">

              {/* Analysis Overview */}
              <div className="rounded-[28px] border border-white/[0.08] bg-[#111019] p-6 md:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">Style Analysis</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Your outfit evaluation
                    </p>
                  </div>

                  <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    AURA Score
                  </span>
                </div>

                {result ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-7"
                  >
                    {/* Score */}
                    <div className="rounded-2xl border border-purple-400/15 bg-gradient-to-br from-purple-500/10 to-transparent p-6">
                      <p className="text-sm text-gray-400">Luxury Score</p>

                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-6xl font-black tracking-tight text-purple-300">
                          {result.luxuryScore}
                        </span>
                        <span className="mb-2 text-sm text-gray-500">
                          Outfit rating
                        </span>
                      </div>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: result.luxuryScore }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-400"
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                        <p className="text-xs text-gray-500">
                          Confidence Level
                        </p>
                        <p className="mt-3 text-3xl font-bold text-white">
                          {result.confidence}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                        <p className="text-xs text-gray-500">Style Identity</p>
                        <p className="mt-3 text-base font-bold leading-6 text-purple-300">
                          {result.style}
                        </p>
                      </div>
                    </div>

                    {/* Suggestion */}
                    <div className="rounded-2xl border border-purple-400/15 bg-purple-500/[0.06] p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-lg text-purple-300">✦</span>
                        <p className="text-sm font-bold">
                          AURA Style Suggestion
                        </p>
                      </div>

                      <p className="text-sm leading-7 text-gray-300">
                        {result.suggestion}
                      </p>
                    </div>

                    <button
                      onClick={resetAnalysis}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Analyze Another Outfit
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-2xl text-purple-300">
                      ✦
                    </div>

                    <p className="font-semibold text-gray-200">
                      Your style report awaits
                    </p>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                      Upload an outfit and select Analyze to see your
                      personalized style report here.
                    </p>

                    {loading && (
                      <div className="mt-6 flex items-center gap-2 text-sm text-purple-300">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400/30 border-t-purple-400" />
                        Preparing your report...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Style Categories */}
              <div className="rounded-[28px] border border-white/[0.08] bg-[#111019] p-6 md:p-7">
                <p className="font-bold">What AURA Evaluates</p>
                <p className="mt-1 text-sm text-gray-500">
                  Your outfit report includes these style categories.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    ["01", "Luxury Aesthetic", "Overall premium appearance"],
                    ["02", "Style Identity", "Your dominant fashion direction"],
                    ["03", "Outfit Confidence", "Your generated confidence score"],
                    ["04", "Style Improvement", "Suggestions to elevate your look"],
                  ].map(([number, title, description]) => (
                    <div
                      key={number}
                      className="flex items-center gap-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-xs font-bold text-purple-300">
                        {number}
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-gray-200">
                          {title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-10 border-t border-white/[0.07] pt-6 text-center">
            <p className="text-xs tracking-wide text-gray-600">
              AURA AI · YOUR STYLE, REDEFINED
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
