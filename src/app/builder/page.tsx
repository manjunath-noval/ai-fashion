
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

type FashionItem = {
  image: string;
  category: string;
};

type Outfit = {
  shirt?: FashionItem;
  pants?: FashionItem;
  shoes?: FashionItem;
  accessory?: FashionItem;
  vibe: string;
};

export default function BuilderPage() {
  const [wardrobe] = useState<FashionItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const storedWardrobe = localStorage.getItem("wardrobe");

      return storedWardrobe
        ? (JSON.parse(storedWardrobe) as FashionItem[])
        : [];
    } catch {
      return [];
    }
  });

  const [outfit, setOutfit] = useState<Outfit | null>(null);

  const generateOutfit = () => {
    const shirts = wardrobe.filter(
      (item) => item.category === "Shirts"
    );

    const pants = wardrobe.filter(
      (item) => item.category === "Pants"
    );

    const shoes = wardrobe.filter(
      (item) => item.category === "Shoes"
    );

    const accessories = wardrobe.filter(
      (item) =>
        item.category === "Watches" ||
        item.category === "Chains" ||
        item.category === "Caps"
    );

    if (
      shirts.length === 0 ||
      pants.length === 0 ||
      shoes.length === 0
    ) {
      alert("Upload shirts, pants, and shoes first.");
      return;
    }

    const vibes = [
      "Luxury Streetwear",
      "Minimal Elite",
      "Cyber Aura",
      "Old Money Core",
    ];

    setOutfit({
      shirt: shirts[Math.floor(Math.random() * shirts.length)],
      pants: pants[Math.floor(Math.random() * pants.length)],
      shoes: shoes[Math.floor(Math.random() * shoes.length)],
      accessory:
        accessories.length > 0
          ? accessories[
              Math.floor(Math.random() * accessories.length)
            ]
          : undefined,
      vibe: vibes[Math.floor(Math.random() * vibes.length)],
    });
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <Sidebar />

      <div className="flex-1 md:ml-[260px] p-5 md:p-10">
        <h1 className="text-3xl md:text-6xl font-black mb-4">
          AI Outfit Builder
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          Generate intelligent outfits using your wardrobe.
        </p>

        <button
          onClick={generateOutfit}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 font-semibold text-lg hover:scale-105 transition"
        >
          Generate Outfit
        </button>

        {outfit && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-[25px] md:rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-10"
          >
            <h2 className="text-5xl font-black text-cyan-400 mb-8">
              {outfit.vibe}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {outfit.shirt && (
                <Image
                  src={outfit.shirt.image}
                  alt="shirt"
                  width={400}
                  height={300}
                  unoptimized
                  className="rounded-[30px] h-[300px] w-full object-cover border border-white/10"
                />
              )}

              {outfit.pants && (
                <Image
                  src={outfit.pants.image}
                  alt="pants"
                  width={400}
                  height={300}
                  unoptimized
                  className="rounded-[30px] h-[300px] w-full object-cover border border-white/10"
                />
              )}

              {outfit.shoes && (
                <Image
                  src={outfit.shoes.image}
                  alt="shoes"
                  width={400}
                  height={300}
                  unoptimized
                  className="rounded-[30px] h-[300px] w-full object-cover border border-white/10"
                />
              )}

              {outfit.accessory && (
                <Image
                  src={outfit.accessory.image}
                  alt="accessory"
                  width={400}
                  height={300}
                  unoptimized
                  className="rounded-[30px] h-[300px] w-full object-cover border border-white/10"
                />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
