
"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

type FashionItem = {
  image: string;
  category: string;
};

type Outfit = {
  shirt: FashionItem | null;
  pants: FashionItem | null;
  shoes: FashionItem | null;

  watch?: FashionItem | null;
  chain?: FashionItem | null;
  cap?: FashionItem | null;
  perfume?: FashionItem | null;
  bag?: FashionItem | null;

  mood: string;
  score: string;
};

const EMPTY_HISTORY: Outfit[] = [];

let cachedRaw: string | null | undefined;
let cachedHistory: Outfit[] = EMPTY_HISTORY;

function getOutfitHistory(): Outfit[] {
  if (typeof window === "undefined") {
    return EMPTY_HISTORY;
  }

  const stored = localStorage.getItem("outfitHistory");

  if (stored === cachedRaw) {
    return cachedHistory;
  }

  cachedRaw = stored;

  try {
    const parsed: unknown = stored ? JSON.parse(stored) : [];

    cachedHistory = Array.isArray(parsed)
      ? (parsed as Outfit[])
      : EMPTY_HISTORY;
  } catch {
    cachedHistory = EMPTY_HISTORY;
  }

  return cachedHistory;
}

function subscribeToHistory(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("outfit-history-updated", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("outfit-history-updated", callback);
  };
}

export default function OutfitHistoryPage() {
  const outfitHistory = useSyncExternalStore(
    subscribeToHistory,
    getOutfitHistory,
    () => EMPTY_HISTORY
  );

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Sidebar />

      {/* Glow */}
      <div className="absolute top-0 left-0 pointer-events-none ..." />
      <div className="absolute bottom-0 right-0 pointer-events-none ..." />

      <div className="relative z-10 lg:ml-[280px] px-8 py-10 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300 mb-5">
            AI Outfit Timeline
          </div>

          <h1 className="text-5xl font-extrabold">
            Outfit
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}History
            </span>
          </h1>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {outfitHistory.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-[25px] p-10 text-center">
              <h2 className="text-2xl font-bold text-white">
                No outfit history yet
              </h2>
              <p className="text-gray-400 mt-3">
                Generate your first outfit to see it here.
              </p>
            </div>
          ) : (
            outfitHistory.map((outfit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-6 backdrop-blur-xl"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-[420px]">
                    {outfit.shirt && (
                      <Image
                        src={outfit.shirt.image}
                        alt="shirt"
                        width={400}
                        height={300}
                        unoptimized
                        className="h-32 w-full object-cover rounded-2xl"
                      />
                    )}

                    {outfit.pants && (
                      <Image
                        src={outfit.pants.image}
                        alt="pants"
                        width={400}
                        height={300}
                        unoptimized
                        className="h-32 w-full object-cover rounded-2xl"
                      />
                    )}

                    {outfit.shoes && (
                      <Image
                        src={outfit.shoes.image}
                        alt="shoes"
                        width={400}
                        height={300}
                        unoptimized
                        className="h-32 w-full object-cover rounded-2xl"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <h2 className="text-3xl font-bold">
                      {outfit.mood}
                    </h2>

                    <div className="mt-5 flex gap-4">
                      <div className="px-5 py-2 rounded-full bg-white/10">
                        {outfit.score}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
