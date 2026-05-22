"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

export default function DashboardPage() {

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

const [wardrobe, setWardrobe] =
  useState<FashionItem[]>([]);

const [outfit, setOutfit] =
  useState<Outfit>({
    shirt: null,
    pants: null,
    shoes: null,
    watch: null,
    chain: null,
    cap: null,
    perfume: null,
    bag: null,
    mood: "AI Waiting",
    score: "0%",
});

const [occasion, setOccasion] =
  useState("College");

const [weather, setWeather] =
  useState("Normal");

  const [savedOutfits, setSavedOutfits] =
  useState<Outfit[]>([]);

  const [rating, setRating] =
  useState("");

  const [outfitHistory, setoutfitHistory] =
  useState<Outfit[]>([]);

useEffect(() => {

  const savedWardrobe =
    localStorage.getItem("wardrobe");

  if (savedWardrobe) {
    setWardrobe(JSON.parse(savedWardrobe));
  }

  const saved =
  localStorage.getItem("savedOutfits");

if (saved) {
  setSavedOutfits(JSON.parse(saved));
}

const outfitHistoryData =
  localStorage.getItem("outfitoutfitHistory");

if (outfitHistoryData) {
  setoutfitHistory(JSON.parse(outfitHistoryData));
}

}, []);

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

  const watches = wardrobe.filter(
    (item) => item.category === "Watches"
  );

  const chains = wardrobe.filter(
    (item) => item.category === "Chains"
  );

  const caps = wardrobe.filter(
    (item) => item.category === "Caps"
  );

  const perfumes = wardrobe.filter(
    (item) => item.category === "Perfumes"
  );

  const bags = wardrobe.filter(
    (item) => item.category === "Bags"
  );

  if (
    shirts.length === 0 ||
    pants.length === 0 ||
    shoes.length === 0
  ) {

    alert(
      "Please upload Shirts, Pants, and Shoes first."
    );

    return;
  }

  const randomShirt =
    shirts[Math.floor(Math.random() * shirts.length)];

  const randomPants =
    pants[Math.floor(Math.random() * pants.length)];

  const randomShoes =
    shoes[Math.floor(Math.random() * shoes.length)];

  const randomWatch =
    watches[Math.floor(Math.random() * watches.length)];

  const randomChain =
    chains[Math.floor(Math.random() * chains.length)];

  const randomCap =
    caps[Math.floor(Math.random() * caps.length)];

  const randomPerfume =
    perfumes[Math.floor(Math.random() * perfumes.length)];

  const randomBag =
    bags[Math.floor(Math.random() * bags.length)];

  let weatherMood = "";

  if (weather === "Hot") {
    weatherMood = "Lightweight Styling";
  }

  else if (weather === "Cold") {
    weatherMood = "Layered Winter Aura";
  }

  else if (weather === "Rainy") {
    weatherMood = "Dark Monochrome";
  }

  else {
    weatherMood = "Balanced Minimal";
  }

  let moods: string[] = [];

  if (occasion === "College") {
    moods = [
      "Street Minimal",
      "Relaxed Casual",
      "Modern Student",
    ];
  }

  else if (occasion === "Office") {
    moods = [
      "Elite Formal",
      "Modern Luxury",
      "Executive Minimal",
    ];
  }

  else if (occasion === "Date") {
    moods = [
      "Luxury Romantic",
      "Elegant Night",
      "Confident Aura",
    ];
  }

  else if (occasion === "Party") {
    moods = [
      "Bold Streetwear",
      "Night Luxe",
      "Elite Partywear",
    ];
  }

  const randomMood =
    moods[Math.floor(Math.random() * moods.length)];

  const randomScore =
    Math.floor(Math.random() * 10) + 90;

  const newOutfit = {
    shirt: randomShirt,
    pants: randomPants,
    shoes: randomShoes,

    watch: randomWatch || null,
    chain: randomChain || null,
    cap: randomCap || null,
    perfume: randomPerfume || null,
    bag: randomBag || null,

    mood: `${randomMood} • ${weatherMood}`,
    score: `${randomScore}%`,
  };

  setOutfit(newOutfit);

  setRating("");

  const updatedoutfitHistory =
    [newOutfit, ...outfitHistory];

  setoutfitHistory(updatedoutfitHistory);

  localStorage.setItem(
    "outfitoutfitHistory",
    JSON.stringify(updatedoutfitHistory)
  );
}; 

const saveOutfit = () => {

  const updated =
    [...savedOutfits, outfit];

  setSavedOutfits(updated);

  localStorage.setItem(
    "savedOutfits",
    JSON.stringify(updated)
  );

  alert("Outfit Saved Successfully");
};

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">

      <Sidebar />

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[320px] md:h-[500px] bg-purple-600 opacity-20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[320px] md:h-[500px] bg-cyan-500 opacity-20 blur-[120px]" />

      {/* Main Content */}
      <div className="relative z-10 px-8 py-10 max-w-7xl lg:ml-[280px]">

        {/* Header */}
        <div className="mb-10">

          <h1 className="text-5xl font-extrabold">
            Good Evening,
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Manju
            </span>
          </h1>

          <p className="mt-4 text-gray-400 text-lg">
            Your AI stylist has generated premium fashion recommendations.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

        <div className="flex flex-wrap gap-4 mt-6">

  {[
    "Hot",
    "Cold",
    "Rainy",
    "Normal",
  ].map((item) => (

    <button
      key={item}
      onClick={() => setWeather(item)}
      className={`
        px-5 py-2 rounded-full border transition
        ${
          weather === item
            ? "bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent"
            : "bg-white/5 border-white/10 hover:border-cyan-400"
        }
      `}
    >
      {item}
    </button>

  ))}

</div>

  {[
    "College",
    "Office",
    "Date",
    "Party",
  ].map((item) => (

    <button
      key={item}
      onClick={() => setOccasion(item)}
      className={`
        px-6 py-3 rounded-full border transition
        ${
          occasion === item
            ? "bg-gradient-to-r from-purple-500 to-cyan-500 border-transparent"
            : "bg-white/5 border-white/10 hover:border-cyan-400"
        }
      `}
    >
      {item}
    </button>

  ))}

</div>

        </div>

        {/* Outfit Card */}
        <motion.div
          key={outfit.mood}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 rounded-[25px] md:rounded-[40px] p-5 md:p-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,255,255,0.08)]"
        >

        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 md:p-10">

            {/* Left */}
            <div>

              <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300 mb-6">
                AI Generated Outfit
              </div>

              <h2 className="text-4xl font-bold leading-tight">
                {outfit.mood}
              </h2>

              <p className="mt-6 text-gray-300 max-w-xl leading-relaxed">
                👕 {outfit.shirt?.category}, 👖 {outfit.pants?.category}, and 👟 {outfit.shoes?.category} create a stylish look that matches your fashion identity.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <div className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
                {occasion} • {weather}
                </div>

              <div className="mt-8 space-y-4">

  {outfit.watch && (
    <div className="bg-white/10 rounded-2xl p-5">
      ⌚ {outfit.watch.category}
    </div>
  )}

  {outfit.chain && (
    <div className="bg-white/10 rounded-2xl p-5">
      ⛓️ {outfit.chain.category}
    </div>
  )}

  {outfit.cap && (
    <div className="bg-white/10 rounded-2xl p-5">
      🧢 {outfit.cap.category}
    </div>
  )}

  {outfit.perfume && (
    <div className="bg-white/10 rounded-2xl p-5">
      🌟 {outfit.perfume.category}
    </div>
  )}

  {outfit.bag && (
    <div className="bg-white/10 rounded-2xl p-5">
      👜 {outfit.bag.category}
    </div>
  )}

</div>

                <div className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
                  Style Score {outfit.score}
                </div>

                <div className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
                  {outfit.mood}
                </div>

              </div>

              {rating && (

  <div className="mt-4 px-5 py-2 rounded-full bg-white/10 inline-block text-sm text-cyan-300">

    User Feedback: {rating}

  </div>

)}

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={generateOutfit}
                className="mt-10 bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full text-lg font-semibold shadow-2xl"
              >
                Generate AI Outfit
              </motion.button>

            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.96 }}
  onClick={saveOutfit}
  className="mt-4 ml-4 bg-white/10 border border-white/10 px-8 py-4 rounded-full text-lg font-semibold hover:border-cyan-400 transition"
>
  Save Outfit
</motion.button>

<div className="flex gap-4 mt-6">

  <button
    onClick={() => setRating("Loved")}
    className={`
      px-6 py-3 rounded-full border transition
      ${
        rating === "Loved"
          ? "bg-green-500/20 border-green-400"
          : "bg-white/5 border-white/10"
      }
    `}
  >
    ❤️ Love It
  </button>

  <button
    onClick={() => setRating("Disliked")}
    className={`
      px-6 py-3 rounded-full border transition
      ${
        rating === "Disliked"
          ? "bg-red-500/20 border-red-400"
          : "bg-white/5 border-white/10"
      }
    `}
  >
    ❌ Dislike
  </button>

</div>

            </div>

            {/* Right Visual */}
           <div className="grid grid-cols-1 gap-4 w-[320px]">

  {outfit.shirt && (
    <img
      src={outfit.shirt.image}
      alt="shirt"
      className="w-full h-32 object-cover rounded-3xl border border-white/10"
    />
  )}

    {outfit.pants && (
      <img
      src={outfit.pants.image}
      alt="pants"
      className="w-full h-32 object-cover rounded-3xl border border-white/10"
    />
  )}

   {outfit.shoes && (
      <img
      src={outfit.shoes.image}
      alt="shoes"
      className="w-full h-32 object-cover rounded-3xl border border-white/10"
    />
  )}

</div>

</div>

      </motion.div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

          {/* Wardrobe */}
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-8">

            <h2 className="text-2xl font-bold mb-6">
              Wardrobe
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <div className="h-32 rounded-2xl bg-white/10 flex items-center justify-center text-gray-400">
                Shirts
              </div>

              <div className="h-32 rounded-2xl bg-white/10 flex items-center justify-center text-gray-400">
                Shoes
              </div>

              <div className="h-32 rounded-2xl bg-white/10 flex items-center justify-center text-gray-400">
                Jackets
              </div>

              <div className="h-32 rounded-2xl bg-white/10 flex items-center justify-center text-gray-400">
                Accessories
              </div>

            </div>

          </div>

          {/* AI Suggestions */}
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-8">

            <h2 className="text-2xl font-bold mb-6">
              AI Suggestions
            </h2>

            <div className="space-y-5">

              <div className="bg-white/10 rounded-2xl p-5">
                White sneakers improve your wardrobe versatility.
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                Neutral layering is trending this week.
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                Silver accessories match your fashion identity.
              </div>

            </div>

          </div>

          {/* Style Analytics */}
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-8">

            <h2 className="text-2xl font-bold mb-6">
              Style Analytics
            </h2>

            <div className="space-y-6">

              <div>
                <p className="text-gray-400 mb-2">
                  Favorite Palette
                </p>

                <div className="flex gap-3">

                  <div className="w-10 h-10 rounded-full bg-black border border-white/20" />
                  <div className="w-10 h-10 rounded-full bg-gray-400" />
                  <div className="w-10 h-10 rounded-full bg-white" />

                </div>

              </div>

              <div>
                <p className="text-gray-400 mb-2">
                  Fashion Aura
                </p>

                <h3 className="text-3xl font-bold text-cyan-300">
                  Elite Minimal
                </h3>
              </div>

              <div>
                <p className="text-gray-400 mb-2">
                  Confidence Level
                </p>

                <h3 className="text-3xl font-bold">
                  94%
                </h3>
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}