
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  Shirt,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase/config";
import Sidebar from "../components/Sidebar";

type FashionItem = {
  id: string;
  image: string;
  category: string;
  name?: string;
  styles?: string[];
};

type Outfit = {
  shirt: FashionItem;
  pants: FashionItem;
  shoes: FashionItem;
  accessory?: FashionItem;
  vibe: string;
};

const vibes = [
  "Luxury Streetwear",
  "Minimal Elite",
  "Cyber Aura",
  "Old Money Core",
];

export default function BuilderPage() {
  const [wardrobe, setWardrobe] = useState<FashionItem[]>([]);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("Random");
  const [previousOutfits, setPreviousOutfits] = useState<string[]>([]);

 useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    try {
      const stored = localStorage.getItem("auraBuilderHistory");
      const parsed: unknown = stored ? JSON.parse(stored) : [];

      if (Array.isArray(parsed)) {
        setPreviousOutfits(
          parsed.filter((item): item is string => typeof item === "string")
        );
      }
    } catch (error) {
      console.error("Unable to load builder history:", error);
    }
  }, 0);

  return () => window.clearTimeout(timeoutId);
}, []);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      if (!user) {
        setWardrobe([]);
        setLoading(false);
        setError("Please sign in to access your wardrobe.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const itemsQuery = query(
          collection(db, "wardrobe"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(itemsQuery);

        if (!active) return;

        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<FashionItem, "id">),
        }));

        setWardrobe(items);
      } catch (err) {
        console.error("Failed to load wardrobe:", err);

        if (active) {
          setError(
            "Unable to load your wardrobe. Please refresh and try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const shirts = wardrobe.filter(
    (item) => item.category === "Shirts"
  );

  const pants = wardrobe.filter(
    (item) => item.category === "Pants"
  );

  const shoes = wardrobe.filter(
    (item) => item.category === "Shoes"
  );

  const accessories = wardrobe.filter((item) =>
    ["Watches", "Chains", "Caps"].includes(item.category)
  );
  const getStyleMatches = (item: FashionItem, vibe: string) => {
  if (vibe === "Random") return true;

  return item.styles?.includes(vibe) ?? false;
};

const getStyleScore = (items: FashionItem[], vibe: string) => {
  if (vibe === "Random") return 0;

  return items.filter((item) => getStyleMatches(item, vibe)).length;
};

  const canGenerate =
    shirts.length > 0 &&
    pants.length > 0 &&
    shoes.length > 0;

  const getOutfitKey = (newOutfit: Outfit) => {
  return [
    newOutfit.shirt.id,
    newOutfit.pants.id,
    newOutfit.shoes.id,
    newOutfit.accessory?.id || "no-accessory",
  ].join("-");
};
  const handleReplaceItem = (
  label: string,
  replacement: FashionItem
) => {
  setOutfit((currentOutfit) => {
    if (!currentOutfit) return currentOutfit;

    switch (label) {
      case "Shirt":
        return { ...currentOutfit, shirt: replacement };

      case "Pants":
        return { ...currentOutfit, pants: replacement };

      case "Shoes":
        return { ...currentOutfit, shoes: replacement };

      case "Accessory":
        return { ...currentOutfit, accessory: replacement };

      default:
        return currentOutfit;
    }
  });
};

  const generateOutfit = () => {
  if (!canGenerate) {
    setMessage(
      "Add at least one shirt, one pair of pants, and one pair of shoes to your wardrobe."
    );
    return;
  }

  setGenerating(true);
  setMessage("");

  if (selectedVibe !== "Random") {
  setMessage(`Creating your ${selectedVibe} look...`);
}

  const randomItem = <T,>(items: T[]): T =>
    items[Math.floor(Math.random() * items.length)];

  const styleShirts = shirts.filter((item) =>
  getStyleMatches(item, selectedVibe)
);

const stylePants = pants.filter((item) =>
  getStyleMatches(item, selectedVibe)
);

const styleShoes = shoes.filter((item) =>
  getStyleMatches(item, selectedVibe)
);

const styleAccessories = accessories.filter((item) =>
  getStyleMatches(item, selectedVibe)
);

const availableShirts = styleShirts.length > 0 ? styleShirts : shirts;
const availablePants = stylePants.length > 0 ? stylePants : pants;
const availableShoes = styleShoes.length > 0 ? styleShoes : shoes;

const availableAccessories =
  styleAccessories.length > 0 ? styleAccessories : accessories;

  const possibleOutfits: Outfit[] = [];

  for (const shirt of availableShirts) {
  for (const pant of availablePants) {
    for (const shoe of availableShoes) {
        if (availableAccessories.length > 0) {
          for (const accessory of availableAccessories) {
            possibleOutfits.push({
              shirt,
              pants: pant,
              shoes: shoe,
              accessory,
              vibe:
                selectedVibe === "Random"
                  ? randomItem(vibes)
                  : selectedVibe,
            });
          }
        } else {
          possibleOutfits.push({
            shirt,
            pants: pant,
            shoes: shoe,
            vibe:
              selectedVibe === "Random"
                ? randomItem(vibes)
                : selectedVibe,
          });
        }
      }
    }
  }

  const unseenOutfits = possibleOutfits.filter(
  (item) => !previousOutfits.includes(getOutfitKey(item))
);

const rankedOutfits = unseenOutfits
  .map((item) => ({
    outfit: item,
    score: getStyleScore(
      [item.shirt, item.pants, item.shoes, ...(item.accessory ? [item.accessory] : [])],
      selectedVibe
    ),
  }))
  .sort((a, b) => b.score - a.score);

const bestScore = rankedOutfits[0]?.score ?? 0;

const bestOutfits = rankedOutfits
  .filter((item) => item.score === bestScore)
  .map((item) => item.outfit);

  if (unseenOutfits.length === 0) {
    setMessage(
      "You've explored all available combinations! Your outfit history has been reset."
    );
    setPreviousOutfits([]);
    try {
  localStorage.setItem("auraBuilderHistory", "[]");
} catch (error) {
  console.error("Unable to reset builder history:", error);
}
    setGenerating(false);
    return;
  }

  const newOutfit = randomItem(bestOutfits);
  const outfitKey = getOutfitKey(newOutfit);

  setOutfit(newOutfit);
  setMessage("");
  const updatedHistory = [...previousOutfits, outfitKey];

setPreviousOutfits(updatedHistory);

try {
  localStorage.setItem(
    "auraBuilderHistory",
    JSON.stringify(updatedHistory)
  );
} catch (error) {
  console.error("Unable to save builder history:", error);
}
  setGenerating(false);
};
   
  const outfitStyleItems = outfit
  ? [
      outfit.shirt,
      outfit.pants,
      outfit.shoes,
      ...(outfit.accessory ? [outfit.accessory] : []),
    ]
  : [];

const outfitStyleScore = outfit
  ? getStyleScore(outfitStyleItems, selectedVibe)
  : 0;

const styleMatchPercentage = outfitStyleItems.length
  ? Math.round(
      (outfitStyleScore / outfitStyleItems.length) * 100
    )
  : 0;

const outfitPieces = outfit
  ? [
      { label: "Shirt", item: outfit.shirt },
      { label: "Pants", item: outfit.pants },
      { label: "Shoes", item: outfit.shoes },
      ...(outfit.accessory
        ? [{ label: "Accessory", item: outfit.accessory }]
        : []),
    ]
  : [];

const outfitInsights = outfitPieces.map(({ label, item }) => ({
  label,
  matches: getStyleMatches(item, selectedVibe),
}));

  const outfitRecommendations = outfitInsights
  .filter((insight) => !insight.matches)
  .map((insight) => {
    const categoryItems =
      insight.label === "Shirt"
        ? shirts
        : insight.label === "Pants"
          ? pants
          : insight.label === "Shoes"
            ? shoes
            : accessories;

    const alternatives = categoryItems.filter(
      (item) =>
        getStyleMatches(item, selectedVibe) &&
        !outfitPieces.some(
          (piece) => piece.item.id === item.id
        )
    );

    return {
      label: insight.label,
      alternatives: alternatives.slice(0, 3),
      hasAlternative: alternatives.length > 0,
    };
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <Sidebar />

      <div className="min-h-screen px-5 py-9 md:ml-[260px] md:p-10">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-[0.25em] text-cyan-300">
            <Sparkles size={16} />
            AURA INTELLIGENCE
          </p>

          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">
            AI Outfit <span className="text-cyan-400">Builder</span>
          </h1>

          <p className="max-w-2xl text-lg text-gray-400">
            Your wardrobe, your style. Generate fresh outfit
            combinations using your personal fashion collection.
          </p>
        </div>

        {/* Wardrobe status */}
        <section className="mb-8 rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                Wardrobe Overview
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Your available clothing items
              </p>
            </div>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              {wardrobe.length} items
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 py-5 text-gray-400">
              <LoaderCircle size={20} className="animate-spin" />
              Loading your wardrobe...
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-sm text-red-300">
              <AlertCircle size={20} />
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Shirts", count: shirts.length },
                { label: "Pants", count: pants.length },
                { label: "Shoes", count: shoes.length },
                { label: "Accessories", count: accessories.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <p className="text-sm text-gray-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-black text-cyan-300">
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Generator */}
        <section className="relative overflow-hidden rounded-[30px] border border-purple-400/20 bg-gradient-to-br from-purple-500/10 via-black to-cyan-500/10 p-6 md:p-10">
          <div className="relative z-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Sparkles size={28} />
            </div>

            <h2 className="text-2xl font-black md:text-3xl">
              Create Your Next Look
            </h2>

            <div className="mt-6">
  <label
    htmlFor="outfit-vibe"
    className="mb-3 block text-sm font-semibold text-gray-300"
  >
    Choose your style
  </label>

  <select
    id="outfit-vibe"
    value={selectedVibe}
    onChange={(e) => setSelectedVibe(e.target.value)}
    disabled={generating}
    className="w-full max-w-sm rounded-xl border border-white/10 bg-black/60 p-3 text-white outline-none focus:border-cyan-400"
  >
    <option value="Random">Surprise Me — Random Style</option>

    {vibes.map((vibe) => (
      <option key={vibe} value={vibe}>
        {vibe}
      </option>
    ))}
  </select>
</div>
          <div className="mt-3 flex items-center gap-2 text-sm">
  <Sparkles size={15} className="text-cyan-300" />
  <span className="text-gray-400">Selected style:</span>
  <span className="font-semibold text-cyan-300">
    {selectedVibe === "Random" ? "Surprise Me" : selectedVibe}
  </span>
</div>
            <p className="mt-3 max-w-xl text-gray-400">
              Let AURA combine your existing wardrobe into a
              fresh outfit. Every generation creates a new
              random combination.
            </p>

            <button
              type="button"
              onClick={generateOutfit}
              disabled={loading || generating || !canGenerate}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 text-lg font-bold shadow-lg shadow-purple-500/20 transition hover:scale-105 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {generating ? (
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <Sparkles size={20} />
              )}

              Generate Outfit
            </button>

            {!loading && !error && !canGenerate && (
              <p className="mt-4 text-sm text-amber-300">
                <AlertCircle
                  size={16}
                  className="mr-2 inline"
                />
                Add shirts, pants, and shoes to enable outfit
                generation.
              </p>
            )}

            {message && (
              <p
                role="status"
                aria-live="polite"
                className="mt-4 text-sm text-amber-300"
              >
                {message}
              </p>
            )}

            {canGenerate && (
  <p className="mt-4 text-sm text-gray-400">
    Unique combinations explored:{" "}
    <span className="font-bold text-cyan-300">
      {previousOutfits.length}
    </span>
  </p>
)}
          </div>

          <Sparkles
            size={150}
            className="absolute -right-8 -top-8 text-white/[0.035]"
          />
        </section>

        {/* Generated outfit */}
        {outfit && (
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-cyan-300">
                  YOUR GENERATED LOOK
                </p>

                <h2 className="text-3xl font-black md:text-5xl">
                  {outfit.vibe}
                </h2>

                <p className="mt-2 text-gray-400">
                  A fresh combination from your wardrobe.
                </p>
              </div>

              <button
                type="button"
                onClick={generateOutfit}
                disabled={!canGenerate}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:opacity-40"
              >
                <RefreshCw size={17} />
                Regenerate
              </button>
            </div>

            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
  <div className="mb-3 flex items-center justify-between">
    <span className="text-sm font-medium text-gray-400">
      Style compatibility
    </span>

    <span className="text-lg font-black text-cyan-300">
      {styleMatchPercentage}%
    </span>
  </div>

  <div className="h-2 overflow-hidden rounded-full bg-white/10">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${styleMatchPercentage}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-full rounded-full bg-cyan-400"
    />
  </div>

  <p className="mt-2 text-xs text-gray-500">
    {styleMatchPercentage >= 75
      ? "Excellent style coordination"
      : styleMatchPercentage >= 50
        ? "Good style coordination"
        : "Your outfit has room for improvement"}
  </p>
</div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
  <h3 className="mb-4 font-bold text-white">
    <Sparkles size={16} className="mr-2 inline text-cyan-300" />
    Why this outfit?
  </h3>

  <div className="space-y-3">
    {outfitInsights.map((insight) => (
      <div
        key={insight.label}
        className="flex items-center justify-between gap-3 text-sm"
      >
        <span className="text-gray-300">{insight.label}</span>

        <span
          className={
            insight.matches
              ? "text-green-300"
              : "text-yellow-300"
          }
        >
          {insight.matches ? "✓ Style Match" : "Different Style"}
        </span>
      </div>
    ))}
  </div>
</div>

      <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
  <div className="mb-4 flex items-center gap-2">
    <Sparkles size={18} className="text-cyan-300" />
    <h3 className="font-bold text-white">
      AURA Style Advisor
    </h3>
  </div>

  {outfitRecommendations.length === 0 ? (
    <p className="text-sm text-green-300">
      Excellent! Your outfit matches the selected style.
    </p>
  ) : (
    <div className="space-y-4">
  {outfitRecommendations.map((recommendation) => (
    <div
      key={recommendation.label}
      className="rounded-xl border border-white/10 bg-black/30 p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="font-semibold text-white">
          {recommendation.label} Alternatives
        </h4>

        <span className="text-xs text-cyan-300">
          {recommendation.alternatives.length} available
        </span>
      </div>

      {recommendation.hasAlternative ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {recommendation.alternatives.map((alternative) => (
            <div
              key={alternative.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]"
            >
              <div className="relative h-36 w-full">
                <Image
                  src={alternative.image}
                  alt={alternative.name || alternative.category}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-3">
                <p className="truncate text-sm font-semibold text-white">
                  {alternative.name || alternative.category}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {alternative.category}
                </p>

                {alternative.styles && alternative.styles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {alternative.styles.map((style) => (
                      <span
                        key={style}
                        className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-200"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
  type="button"
  onClick={() =>
    handleReplaceItem(
      recommendation.label,
      alternative
    )
  }
  className="mt-3 w-full rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-black transition hover:bg-cyan-300"
>
  Use This Item
</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-yellow-300">
          No matching alternative in your wardrobe.
        </p>
      )}
    </div>
  ))}
</div>
  )}

  <p className="mt-4 text-xs text-gray-500">
    Suggestions are based on your saved wardrobe styles.
  </p>
</div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {outfitPieces.map(({ label, item }, index) => (
                <motion.article
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="overflow-hidden rounded-[25px] border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <div className="relative h-[300px] w-full">
                    <Image
                      src={item.image}
                      alt={item.category}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                        {label}
                      </p>
                      <p className="mt-1 font-bold">
                        {item.category}
                      </p>
                      {item.styles && item.styles.length > 0 && (
  <div className="mt-2 flex flex-wrap gap-1.5">
    {item.styles.map((style) => (
      <span
        key={style}
        className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] font-medium text-cyan-200"
      >
        {style}
      </span>
    ))}
  </div>
)}
                    </div>

                    <Shirt
                      size={20}
                      className="text-cyan-300"
                    />
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-green-300">
              <CheckCircle2 size={18} />
              Outfit successfully generated.
            </div>
          </motion.section>

        )}
      </div>
    </main>
  );
}
