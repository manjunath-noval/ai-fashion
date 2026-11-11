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
  WandSparkles,
  RotateCcw,
  Crown,
  Footprints,
  Watch,
  ArrowRight,
  Layers3,
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

const panel =
  "rounded-[26px] border border-white/[0.08] bg-[#11101a]/90 shadow-[0_18px_60px_rgba(0,0,0,0.22)]";
const muted = "text-[#9995aa]";
const accentText = "text-[#c4a5ff]";
const accentButton =
  "bg-gradient-to-r from-[#7650d8] via-[#895ce5] to-[#a16df0] text-white shadow-lg shadow-purple-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40";

export default function BuilderPage() {
  const [wardrobe, setWardrobe] = useState<FashionItem[]>([]);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [originalOutfit, setOriginalOutfit] = useState<Outfit | null>(null);
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
      } catch (storageError) {
        console.error("Unable to load builder history:", storageError);
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
      } catch (loadError) {
        console.error("Failed to load wardrobe:", loadError);
        if (active) {
          setError(
            "Unable to load your wardrobe. Please refresh and try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const shirts = wardrobe.filter((item) => item.category === "Shirts");
  const pants = wardrobe.filter((item) => item.category === "Pants");
  const shoes = wardrobe.filter((item) => item.category === "Shoes");
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
    shirts.length > 0 && pants.length > 0 && shoes.length > 0;

  const getOutfitKey = (newOutfit: Outfit) =>
    [
      newOutfit.shirt.id,
      newOutfit.pants.id,
      newOutfit.shoes.id,
      newOutfit.accessory?.id || "no-accessory",
    ].join("-");

  const handleReplaceItem = (label: string, replacement: FashionItem) => {
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

  const handleRemoveAccessory = () => {
    setOutfit((currentOutfit) =>
      currentOutfit ? { ...currentOutfit, accessory: undefined } : currentOutfit
    );
  };

  const handleResetOutfit = () => {
    if (!originalOutfit) return;
    setOutfit({ ...originalOutfit });
    setMessage("Outfit restored to its original generated version.");
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
          [
            item.shirt,
            item.pants,
            item.shoes,
            ...(item.accessory ? [item.accessory] : []),
          ],
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
      } catch (storageError) {
        console.error("Unable to reset builder history:", storageError);
      }
      setGenerating(false);
      return;
    }

    const newOutfit = randomItem(bestOutfits);
    const outfitKey = getOutfitKey(newOutfit);

    setOriginalOutfit({ ...newOutfit });
    setOutfit(newOutfit);
    setMessage("");
    const updatedHistory = [...previousOutfits, outfitKey];
    setPreviousOutfits(updatedHistory);

    try {
      localStorage.setItem(
        "auraBuilderHistory",
        JSON.stringify(updatedHistory)
      );
    } catch (storageError) {
      console.error("Unable to save builder history:", storageError);
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
    ? Math.round((outfitStyleScore / outfitStyleItems.length) * 100)
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
          !outfitPieces.some((piece) => piece.item.id === item.id)
      );

      return {
        label: insight.label,
        alternatives: alternatives.slice(0, 3),
        hasAlternative: alternatives.length > 0,
      };
    });

  const categoryStats = [
    { label: "Shirts", count: shirts.length, icon: Shirt },
    { label: "Bottoms", count: pants.length, icon: Layers3 },
    { label: "Shoes", count: shoes.length, icon: Footprints },
    { label: "Accessories", count: accessories.length, icon: Watch },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09080e] text-white">
      <Sidebar />

      <div className="min-h-screen px-4 pb-12 pt-7 sm:px-6 lg:ml-[232px] lg:px-9 lg:pt-9">
        <div className="mx-auto max-w-[1500px]">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className={`mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.28em] ${accentText}`}>
                <Sparkles size={14} />
                AURA / PERSONAL STYLING
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Outfit <span className={accentText}>Builder</span>
              </h1>
              <p className={`mt-2 max-w-xl text-sm sm:text-base ${muted}`}>
                Turn the pieces you own into a look that feels entirely yours.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-purple-300/15 bg-purple-400/[0.07] px-4 py-2 text-xs font-medium text-purple-200">
              <WandSparkles size={15} />
              Your wardrobe, reimagined
            </div>
          </header>

          <section className={`${panel} mb-6 overflow-hidden p-5 sm:p-6`}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={`mb-1 text-[10px] font-bold tracking-[0.22em] ${accentText}`}>
                  YOUR COLLECTION
                </p>
                <h2 className="text-lg font-bold">Wardrobe snapshot</h2>
                <p className={`mt-1 text-xs ${muted}`}>
                  Pieces available for outfit generation
                </p>
              </div>
              <span className="rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1.5 text-xs font-semibold text-purple-200">
                {wardrobe.length} total pieces
              </span>
            </div>

            {loading ? (
              <div className={`flex items-center gap-3 py-5 text-sm ${muted}`}>
                <LoaderCircle size={18} className="animate-spin" />
                Loading your wardrobe...
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-300">
                <AlertCircle size={18} />
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {categoryStats.map(({ label, count, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/[0.07] bg-[#0b0a11] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${muted}`}>{label}</span>
                      <Icon size={16} className="text-purple-300" />
                    </div>
                    <p className="mt-3 text-2xl font-black tabular-nums">{count}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={`${panel} relative mb-8 overflow-hidden p-5 sm:p-8`}>
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-purple-600/15 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-[90px]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-300/20 bg-purple-400/10 text-purple-200">
                  <Sparkles size={23} />
                </div>
                <p className={`mb-2 text-[10px] font-bold tracking-[0.24em] ${accentText}`}>
                  THE AURA STUDIO
                </p>
                <h2 className="max-w-xl text-2xl font-black leading-tight sm:text-3xl">
                  Create a look that
                  <span className="block text-purple-300">matches your energy.</span>
                </h2>
                <p className={`mt-3 max-w-lg text-sm leading-6 ${muted}`}>
                  Choose a style direction and let AURA combine your saved
                  clothing into a fresh outfit. Your explored combinations are
                  tracked so you can keep discovering new looks.
                </p>

                <div className="mt-7 max-w-md">
                  <label
                    htmlFor="outfit-vibe"
                    className="mb-2 block text-xs font-semibold text-[#d8d1e8]"
                  >
                    Select your style direction
                  </label>
                  <select
                    id="outfit-vibe"
                    value={selectedVibe}
                    onChange={(event) => setSelectedVibe(event.target.value)}
                    disabled={generating}
                    className="w-full rounded-xl border border-white/10 bg-[#0b0a11] px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/10 disabled:opacity-60"
                  >
                    <option value="Random">Surprise me — Random style</option>
                    {vibes.map((vibe) => (
                      <option key={vibe} value={vibe}>
                        {vibe}
                      </option>
                    ))}
                  </select>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className={muted}>Selected direction</span>
                    <span className="rounded-full border border-purple-300/20 bg-purple-400/10 px-2.5 py-1 font-semibold text-purple-200">
                      {selectedVibe === "Random" ? "Surprise me" : selectedVibe}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateOutfit}
                  disabled={loading || generating || !canGenerate}
                  className={`${accentButton} mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold`}
                >
                  {generating ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <WandSparkles size={18} />
                  )}
                  {generating ? "Creating your look..." : "Generate an outfit"}
                  {!generating && <ArrowRight size={16} />}
                </button>

                {!loading && !error && !canGenerate && (
                  <p className="mt-4 flex items-start gap-2 text-xs text-amber-300">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    Add at least one shirt, one pair of pants, and one pair of
                    shoes to enable outfit generation.
                  </p>
                )}
                {message && (
                  <p role="status" aria-live="polite" className="mt-4 text-xs text-amber-200">
                    {message}
                  </p>
                )}
              </div>

              <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-4">
                <div className="absolute h-64 w-64 rounded-full border border-purple-300/10 bg-gradient-to-br from-purple-500/15 to-transparent" />
                <div className="absolute h-48 w-48 rounded-full border border-purple-300/10" />
                <div className="relative flex h-52 w-52 flex-col items-center justify-center rounded-[38px] border border-purple-200/15 bg-gradient-to-br from-[#28203b] via-[#171322] to-[#100e18] shadow-[0_25px_80px_rgba(91,55,155,0.2)]">
                  <Crown size={34} className="mb-3 text-purple-200" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-purple-200/70">
                    AURA
                  </span>
                  <span className="mt-2 text-center text-xl font-black">
                    Style
                    <br />
                    Intelligence
                  </span>
                  <span className="mt-3 text-[10px] text-[#aaa1bb]">
                    PERSONALIZED FOR YOU
                  </span>
                </div>
                <Sparkles size={20} className="absolute right-5 top-8 text-purple-300/70" />
                <Sparkles size={14} className="absolute bottom-8 left-5 text-purple-300/50" />
              </div>
            </div>
            {canGenerate && (
              <div className="relative mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-4 text-xs">
                <span className={muted}>Unique combinations explored</span>
                <span className="font-bold text-purple-200">
                  {previousOutfits.length}
                </span>
              </div>
            )}
          </section>

          {outfit && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-10"
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className={`mb-2 text-[10px] font-bold tracking-[0.24em] ${accentText}`}>
                    YOUR GENERATED LOOK
                  </p>
                  <h2 className="text-2xl font-black sm:text-3xl">{outfit.vibe}</h2>
                  <p className={`mt-1 text-sm ${muted}`}>
                    A fresh combination built from your own collection.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={generateOutfit}
                    disabled={!canGenerate || generating}
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-300/20 bg-purple-400/10 px-4 py-2.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-400/15 disabled:opacity-40"
                  >
                    <RefreshCw size={14} />
                    Regenerate
                  </button>
                  {originalOutfit && (
                    <button
                      type="button"
                      onClick={handleResetOutfit}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-[#c4bfd0] transition hover:bg-white/[0.08]"
                    >
                      <RotateCcw size={14} />
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className={`${panel} mb-5 p-5`}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">Style compatibility</p>
                    <p className={`mt-1 text-xs ${muted}`}>
                      Match against your selected style tags
                    </p>
                  </div>
                  <span className="text-xl font-black text-purple-200">
                    {styleMatchPercentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${styleMatchPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-300"
                  />
                </div>
                <p className={`mt-2 text-[11px] ${muted}`}>
                  {styleMatchPercentage >= 75
                    ? "Excellent style coordination"
                    : styleMatchPercentage >= 50
                      ? "Good style coordination"
                      : "Your outfit has room for improvement"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {outfitPieces.map(({ label, item }, index) => (
                  <motion.article
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#11101a] transition hover:-translate-y-1 hover:border-purple-300/30"
                  >
                    <div className="relative h-[270px] w-full bg-[#0c0b12]">
                      <Image
                        src={item.image}
                        alt={item.name || item.category}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/65 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-100 backdrop-blur">
                        {label}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold">{item.name || item.category}</p>
                      <p className={`mt-1 text-xs ${muted}`}>{item.category}</p>
                      {item.styles && item.styles.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.styles.map((style) => (
                            <span
                              key={style}
                              className="rounded-full border border-purple-300/15 bg-purple-400/[0.08] px-2 py-1 text-[9px] text-purple-200"
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                      )}
                      {label === "Accessory" && (
                        <button
                          type="button"
                          onClick={handleRemoveAccessory}
                          className="mt-3 rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-[11px] font-semibold text-red-300 transition hover:bg-red-400/10"
                        >
                          Remove accessory
                        </button>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className={`${panel} mt-5 p-5`}>
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles size={17} className="text-purple-300" />
                  <h3 className="text-sm font-bold">Why this outfit?</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {outfitInsights.map((insight) => (
                    <div
                      key={insight.label}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3 text-xs"
                    >
                      <span className="text-[#d4cfdf]">{insight.label}</span>
                      <span className={insight.matches ? "text-emerald-300" : "text-amber-300"}>
                        {insight.matches ? "✓ Style match" : "Different style"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${panel} mt-5 p-5`}>
                <div className="mb-4 flex items-center gap-2">
                  <WandSparkles size={17} className="text-purple-300" />
                  <h3 className="text-sm font-bold">AURA style advisor</h3>
                </div>
                {outfitRecommendations.length === 0 ? (
                  <p className="text-sm text-emerald-300">
                    Excellent! Your outfit matches the selected style.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {outfitRecommendations.map((recommendation) => (
                      <div key={recommendation.label}>
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h4 className="text-xs font-semibold text-[#ddd7e9]">
                            {recommendation.label} alternatives
                          </h4>
                          <span className="text-[10px] text-purple-200">
                            {recommendation.alternatives.length} available
                          </span>
                        </div>
                        {recommendation.hasAlternative ? (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {recommendation.alternatives.map((alternative) => (
                              <div
                                key={alternative.id}
                                className="overflow-hidden rounded-xl border border-white/[0.07] bg-black/20"
                              >
                                <div className="relative h-36 w-full bg-[#0c0b12]">
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
                                  <p className="truncate text-xs font-semibold">
                                    {alternative.name || alternative.category}
                                  </p>
                                  <p className={`mt-1 text-[10px] ${muted}`}>
                                    {alternative.category}
                                  </p>
                                  {alternative.styles && alternative.styles.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {alternative.styles.map((style) => (
                                        <span
                                          key={style}
                                          className="rounded-full bg-purple-400/[0.08] px-2 py-1 text-[9px] text-purple-200"
                                        >
                                          {style}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleReplaceItem(recommendation.label, alternative)
                                    }
                                    className={`${accentButton} mt-3 w-full rounded-lg px-3 py-2 text-[10px] font-bold`}
                                  >
                                    Use this item
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-amber-300">
                            No matching alternative in your wardrobe.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className={`mt-4 text-[10px] ${muted}`}>
                  Suggestions are based on the style tags saved with your wardrobe items.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 size={16} />
                Outfit successfully generated.
              </div>
            </motion.section>
          )}

          {!outfit && !loading && !error && (
            <div className={`${panel} mt-8 flex flex-col items-center px-6 py-12 text-center`}>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-300/15 bg-purple-400/[0.08] text-purple-200">
                <Shirt size={25} />
              </div>
              <h3 className="text-lg font-bold">Your next look starts here</h3>
              <p className={`mt-2 max-w-md text-sm leading-6 ${muted}`}>
                Choose a style above and generate an outfit. Your selected pieces
                and style recommendations will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
