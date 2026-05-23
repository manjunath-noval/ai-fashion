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

export default function SavedPage() {

  const [savedOutfits, setSavedOutfits] =
    useState<Outfit[]>([]);

  useEffect(() => {

    const saved =
      localStorage.getItem("savedOutfits");

    if (saved) {
      setSavedOutfits(JSON.parse(saved));
    }

  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">

      <Sidebar />

      {/* Background Glow */}
      <div className="absolute top-0 left-0 pointer-events-none ..."/>
<div className="absolute bottom-0 right-0 pointer-events-none ..."/>

      <div className="relative z-10 lg:ml-[280px] px-8 py-10 max-w-7xl">

        {/* Header */}
        <div className="mb-12">

          <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300 mb-5">
            AI Saved Collection
          </div>

          <h1 className="text-5xl font-extrabold">
            Your Saved
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Outfits
            </span>
          </h1>

          <p className="mt-5 text-gray-400 text-lg">
            AI-curated outfits you saved from your personal fashion journey.
          </p>

        </div>

        {/* Saved Grid */}
        {savedOutfits.length === 0 ? (

          <div className="text-gray-400 text-xl">
            No saved outfits yet.
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {savedOutfits.map((outfit, index) => (

              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-6 backdrop-blur-xl"
              >

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                  {outfit.shirt && (
                    <img
                      src={outfit.shirt.image}
                      alt="shirt"
                      className="h-28 w-full object-cover rounded-2xl"
                    />
                  )}

                  {outfit.pants && (
                    <img
                      src={outfit.pants.image}
                      alt="pants"
                      className="h-28 w-full object-cover rounded-2xl"
                    />
                  )}

                  {outfit.shoes && (
                    <img
                      src={outfit.shoes.image}
                      alt="shoes"
                      className="h-28 w-full object-cover rounded-2xl"
                    />
                  )}

                </div>

                {/* Info */}
                <div className="mt-6">

                  <h2 className="text-2xl font-bold">
                    {outfit.mood}
                  </h2>

                  <div className="flex gap-4 mt-4">

                    <div className="px-4 py-2 rounded-full bg-white/10 text-sm">
                      {outfit.score}
                    </div>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}