"use client";

import { useEffect, useState } from "react";
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

export default function OutfitHistoryPage() {

  const [outfitHistory, setoutfitHistory] =
    useState<Outfit[]>([]);

  useEffect(() => {

    const stored =
localStorage.getItem("outfitHistory");
    if (stored) {
      setoutfitHistory(JSON.parse(stored));
    }

  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">

      <Sidebar />

      {/* Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[320px] md:h-[500px] bg-purple-600 opacity-20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[320px] md:h-[500px] bg-cyan-500 opacity-20 blur-[120px]" />

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

          {outfitHistory.map((outfit, index) => (

            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-6 backdrop-blur-xl"
            >

              <div className="flex flex-col lg:flex-row gap-8">

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-[420px]">

                  {outfit.shirt && (
                    <img
                      src={outfit.shirt.image}
                      alt="shirt"
                      className="h-32 object-cover rounded-2xl"
                    />
                  )}

                  {outfit.pants && (
                    <img
                      src={outfit.pants.image}
                      alt="pants"
                      className="h-32 object-cover rounded-2xl"
                    />
                  )}

                  {outfit.shoes && (
                    <img
                      src={outfit.shoes.image}
                      alt="shoes"
                      className="h-32 object-cover rounded-2xl"
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

          ))}

        </div>

      </div>

    </main>
  );
}