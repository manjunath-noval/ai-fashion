
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CloudRain,
  Sun,
  Snowflake,
  Sparkles,
  Shirt,
  Footprints,
  RefreshCw,
  Bookmark,
  Heart,
  BriefcaseBusiness,
  GraduationCap,
  CalendarHeart,
  PartyPopper,
  WandSparkles,
  Layers3,
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../components/Sidebar";

type FashionItem = {
  id: string;
  image: string;
  category: string;
  userId?: string;
};

type Outfit = {
  shirt: FashionItem;
  pants: FashionItem;
  shoes: FashionItem;
  watch?: FashionItem | null;
  mood: string;
  score: string;
  occasion: string;
  weather: string;
};
type StoredOutfit = {
  shirtId: string;
  pantsId: string;
  shoesId: string;
  watchId: string | null;
  mood: string;
  score: string;
  occasion: string;
  weather: string;
  createdAt: number;
};

const occasions = [
  { name: "College", icon: GraduationCap },
  { name: "Office", icon: BriefcaseBusiness },
  { name: "Date", icon: CalendarHeart },
  { name: "Party", icon: PartyPopper },
];

const weathers = [
  { name: "Hot", icon: Sun },
  { name: "Cold", icon: Snowflake },
  { name: "Rainy", icon: CloudRain },
  { name: "Normal", icon: Sparkles },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const [wardrobe, setWardrobe] = useState<FashionItem[]>([]);
  const [occasion, setOccasion] = useState("College");
  const [weather, setWeather] = useState("Normal");
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loadingWardrobe, setLoadingWardrobe] = useState(true);
  const [wardrobeError, setWardrobeError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [rating, setRating] = useState("");

  // Load wardrobe from Firestore with error handling and retry support.
  useEffect(() => {
    let active = true;

    const loadWardrobe = async () => {
      if (!user?.uid) {
        if (active) {
          setWardrobe([]);
          setWardrobeError("");
          setLoadingWardrobe(false);
        }
        return;
      }

      setLoadingWardrobe(true);
      setWardrobeError("");

      try {
        const wardrobeQuery = query(
          collection(db, "wardrobe"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(wardrobeQuery);

        const items = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<FashionItem, "id">),
        }));

        if (active) {
          setWardrobe(items);
        }
      } catch (error) {
        console.error("Unable to load wardrobe:", error);

        if (active) {
          setWardrobeError(
            "We couldn't load your wardrobe. Check your internet connection and try again."
          );
        }
      } finally {
        if (active) {
          setLoadingWardrobe(false);
        }
      }
    };

    void loadWardrobe();

    return () => {
      active = false;
    };
  }, [user?.uid, reloadKey]);

  // Calculate wardrobe category counts.
  const counts = useMemo(
    () => ({
      shirts: wardrobe.filter(
        (item) => item.category?.toLowerCase() === "shirts"
      ).length,
      pants: wardrobe.filter(
        (item) => item.category?.toLowerCase() === "pants"
      ).length,
      shoes: wardrobe.filter(
        (item) => item.category?.toLowerCase() === "shoes"
      ).length,
    }),
    [wardrobe]
  );

  // Generate an outfit using the user's wardrobe.
 const generateOutfit = () => {
  if (loadingWardrobe || wardrobeError) return;

  const pick = (category: string) => {
    const options = wardrobe.filter(
      (item) => item.category?.toLowerCase() === category.toLowerCase()
    );

    return options.length
      ? options[Math.floor(Math.random() * options.length)]
      : null;
  };

  const shirt = pick("Shirts");
  const pants = pick("Pants");
  const shoes = pick("Shoes");

  if (!shirt || !pants || !shoes) {
    alert(
      "Add at least one shirt, one pair of pants, and one pair of shoes to your wardrobe first."
    );
    return;
  }

  setGenerating(true);

  const styles: Record<string, string[]> = {
    College: ["Relaxed Campus", "Modern Student", "Street Minimal"],
    Office: ["Executive Minimal", "Smart Professional", "Modern Classic"],
    Date: ["Effortless Elegance", "Refined Casual", "Evening Minimal"],
    Party: ["Night Luxe", "Contemporary Statement", "Bold Minimal"],
  };

  const weatherStyle: Record<string, string> = {
    Hot: "Lightweight Edit",
    Cold: "Layered Essential",
    Rainy: "All-weather Edit",
    Normal: "Balanced Minimal",
  };

  const watch = pick("Watches");

  const nextOutfit: Outfit = {
    shirt,
    pants,
    shoes,
    watch,
    mood: `${styles[occasion][Math.floor(Math.random() * styles[occasion].length)]} · ${weatherStyle[weather]}`,
    score: `${Math.floor(Math.random() * 8) + 92}%`,
    occasion,
    weather,
  };

  setOutfit(nextOutfit);
  setRating("");

  const storedOutfit: StoredOutfit = {
    shirtId: shirt.id,
    pantsId: pants.id,
    shoesId: shoes.id,
    watchId: watch?.id ?? null,
    mood: nextOutfit.mood,
    score: nextOutfit.score,
    occasion,
    weather,
    createdAt: Date.now(),
  };

  localStorage.setItem(
    "auraLatestOutfit",
    JSON.stringify(storedOutfit)
  );

  const readHistory = (key: string): StoredOutfit[] => {
    try {
      const stored: unknown = JSON.parse(
        localStorage.getItem(key) || "[]"
      );

      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  };

  const existingHistory = readHistory("outfitHistory");

  const updatedHistory = [
    storedOutfit,
    ...existingHistory,
  ].slice(0, 30);

  localStorage.setItem(
    "outfitHistory",
    JSON.stringify(updatedHistory)
  );

  localStorage.removeItem("outfitoutfitHistory");

  window.dispatchEvent(new Event("outfit-history-updated"));

  setGenerating(false);
};

  // Save the currently generated outfit.
  const saveOutfit = () => {
  if (!outfit) return;

  try {
    const storedOutfit: StoredOutfit = {
      shirtId: outfit.shirt.id,
      pantsId: outfit.pants.id,
      shoesId: outfit.shoes.id,
      watchId: outfit.watch?.id ?? null,
      mood: outfit.mood,
      score: outfit.score,
      occasion: outfit.occasion,
      weather: outfit.weather,
      createdAt: Date.now(),
    };

    const existing = JSON.parse(
      localStorage.getItem("savedOutfits") || "[]"
    );

    const validSaved = Array.isArray(existing)
      ? existing.filter(
          (item) =>
            item &&
            typeof item.shirtId === "string" &&
            typeof item.pantsId === "string" &&
            typeof item.shoesId === "string"
        )
      : [];

    localStorage.setItem(
      "savedOutfits",
      JSON.stringify([storedOutfit, ...validSaved].slice(0, 30))
    );

    window.dispatchEvent(new Event("saved-outfits-updated"));

    alert("Outfit saved successfully.");
  } catch (error) {
    console.error("Unable to save outfit:", error);
    alert("Unable to save outfit. Please try again.");
  }
};

  const firstName = user?.displayName?.trim().split(" ")[0] || "there";

  return (
    <main className="aura-shell min-h-screen text-white">
      <Sidebar />

      <div className="aura-main lg:ml-[372px] min-h-screen px-5 sm:px-8 xl:px-12 py-9">
        <header className="mb-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="aura-eyebrow mb-3">
                <Sparkles size={14} /> YOUR PERSONAL STYLE SPACE
              </p>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight">
                Good evening,{" "}
                <span className="aura-gradient-text">{firstName}</span>
              </h1>

              <p className="text-slate-400 mt-3 text-base sm:text-lg">
                Your wardrobe. Your identity. A sharper everyday look.
              </p>
            </div>

            <Link href="/wardrobe" className="aura-outline-btn">
              <Layers3 size={17} /> Manage wardrobe{" "}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </header>

        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="text-sm text-slate-400 font-semibold mr-2">
              WEATHER
            </span>

            {weathers.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setWeather(name)}
                className={`aura-pill ${weather === name ? "aura-pill-active" : ""}`}
              >
                <Icon size={15} />
                {name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm text-slate-400 font-semibold mr-2">
              OCCASION
            </span>

            {occasions.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setOccasion(name)}
                className={`aura-pill ${occasion === name ? "aura-pill-active" : ""}`}
              >
                <Icon size={15} />
                {name}
              </button>
            ))}
          </div>
        </section>

        <section className="aura-hero-card relative overflow-hidden rounded-[30px] sm:rounded-[38px] p-6 sm:p-9 xl:p-11">
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-cyan-400/10 blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-28 left-1/4 w-80 h-80 rounded-full bg-fuchsia-500/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid xl:grid-cols-[1.05fr_.95fr] gap-9 items-center">
            <div>
              <div className="aura-chip mb-7">
                <WandSparkles size={15} /> AI GENERATED OUTFIT
              </div>

              <p className="text-cyan-200/80 text-sm font-semibold tracking-[.18em] uppercase mb-3">
                Your style direction
              </p>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black leading-tight">
                {outfit?.mood || "Your next look starts here."}
              </h2>

              <p className="text-slate-300 leading-7 mt-5 max-w-xl">
                {outfit
                  ? `A ${outfit.occasion.toLowerCase()} look selected from your own wardrobe for ${outfit.weather.toLowerCase()} weather.`
                  : "Choose your occasion and weather, then generate a coordinated outfit using the clothes you have uploaded."}
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <span className="aura-chip">
                  {occasion} · {weather}
                </span>

                {outfit && (
                  <span className="aura-chip text-cyan-200">
                    Style score {outfit.score}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={generateOutfit}
                  disabled={
                    generating || loadingWardrobe || !!wardrobeError
                  }
                  className="aura-primary-btn disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles size={18} />
                  {loadingWardrobe
                    ? "Loading wardrobe..."
                    : generating
                      ? "Creating..."
                      : wardrobeError
                        ? "Wardrobe unavailable"
                        : "Generate my outfit"}
                </button>

                <button
                  onClick={saveOutfit}
                  disabled={!outfit}
                  className="aura-outline-btn disabled:opacity-40"
                >
                  <Bookmark size={17} /> Save look
                </button>
              </div>

              {wardrobeError && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="text-sm text-rose-300">
                    {wardrobeError}
                  </p>

                  <button
                    type="button"
                    onClick={() => setReloadKey((previous) => previous + 1)}
                    className="aura-feedback"
                  >
                    <RefreshCw size={15} /> Retry
                  </button>
                </div>
              )}

              {outfit && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setRating("Loved")}
                    className={`aura-feedback ${rating === "Loved" ? "selected" : ""}`}
                  >
                    <Heart size={15} /> Love it
                  </button>

                  <button
                    onClick={() => setRating("Try another")}
                    className={`aura-feedback ${rating === "Try another" ? "selected" : ""}`}
                  >
                    <RefreshCw size={15} /> Try another
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  label: "SHIRT",
                  item: outfit?.shirt,
                  fallback: "Upload shirts",
                  icon: Shirt,
                },
                {
                  label: "PANTS",
                  item: outfit?.pants,
                  fallback: "Upload pants",
                  icon: Layers3,
                },
                {
                  label: "SHOES",
                  item: outfit?.shoes,
                  fallback: "Upload shoes",
                  icon: Footprints,
                },
              ].map(({ label, item, fallback, icon: Icon }) => (
                <div key={label} className="aura-outfit-slot">
                  {item?.image ? (
                    <Image
                      src={item.image}
                      alt={label}
                      width={400}
                      height={400}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center p-3">
                      <Icon size={25} className="text-cyan-200 mb-3" />
                      <span className="text-xs tracking-widest text-slate-400">
                        {label}
                      </span>
                      <span className="text-sm text-slate-300 mt-2">
                        {outfit ? "Not selected" : fallback}
                      </span>
                    </div>
                  )}

                  <span className="absolute bottom-3 left-3 text-[10px] tracking-[.2em] font-bold bg-black/65 px-2.5 py-1.5 rounded-full">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-7">
          {[
            {
              label: "WARDROBE ITEMS",
              value: wardrobe.length,
              detail: "Pieces in your collection",
              icon: Layers3,
            },
            {
              label: "SHIRTS",
              value: counts.shirts,
              detail: "Ready to style",
              icon: Shirt,
            },
            {
              label: "PANTS",
              value: counts.pants,
              detail: "Bottom wear",
              icon: Layers3,
            },
            {
              label: "SHOES",
              value: counts.shoes,
              detail: "Complete the look",
              icon: Footprints,
            },
          ].map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="aura-stat-card">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold tracking-[.14em] text-slate-400">
                  {label}
                </span>
                <Icon size={18} className="text-cyan-300" />
              </div>

              <div className="text-3xl font-black mt-5">
                {loadingWardrobe || wardrobeError ? "—" : value}
              </div>

              <p className="text-sm text-slate-500 mt-1">{detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-9">
          <div className="flex justify-between items-end gap-4 mb-5">
            <div>
              <p className="aura-eyebrow mb-2">YOUR COLLECTION</p>
              <h3 className="text-2xl font-bold">Recently added pieces</h3>
            </div>

            <Link
              href="/wardrobe"
              className="text-cyan-300 hover:text-white text-sm font-semibold"
            >
              View wardrobe{" "}
              <ArrowUpRight size={15} className="inline" />
            </Link>
          </div>

          {loadingWardrobe ? (
            <div className="aura-empty">
              Loading your wardrobe...
            </div>
          ) : wardrobeError ? (
            <div className="aura-empty flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <p className="font-semibold text-white">
                  Unable to load your wardrobe.
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {wardrobeError}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReloadKey((previous) => previous + 1)}
                className="aura-outline-btn"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          ) : wardrobe.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
              {wardrobe.slice(-5).reverse().map((item) => (
                <div key={item.id} className="aura-piece-card">
                  <Image
                    src={item.image}
                    alt={item.category}
                    width={400}
                    height={300}
                    unoptimized
                    className="w-full h-44 object-cover"
                  />

                  <div className="p-3">
                    <p className="text-sm font-semibold">{item.category}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Your collection
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="aura-empty flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <p className="font-semibold text-white">
                  Your wardrobe is waiting.
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Upload shirts, pants and shoes to start generating outfits.
                </p>
              </div>

              <Link href="/wardrobe" className="aura-primary-btn">
                Add your first pieces <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
