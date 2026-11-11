
"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarHeart,
  Check,
  CloudRain,
  Footprints,
  GraduationCap,
  Heart,
  Layers3,
  Search,
  Shirt,
  Snowflake,
  Sparkles,
  Sun,
  WandSparkles,
  Clock3,
  RefreshCw,
  Plus,
  History,
  BarChart3,
  Ruler,
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
  name?: string;
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

const occasions = [
  { name: "College", icon: GraduationCap },
  { name: "Office", icon: BriefcaseBusiness },
  { name: "Date", icon: CalendarHeart },
  { name: "Party", icon: Sparkles },
];

const weathers = [
  { name: "Hot", icon: Sun },
  { name: "Cold", icon: Snowflake },
  { name: "Rainy", icon: CloudRain },
  { name: "Normal", icon: Sparkles },
];

const quickActions = [
  {
    title: "My Wardrobe",
    description: "Explore your collection",
    href: "/wardrobe",
    icon: Shirt,
  },
  {
    title: "Outfit Builder",
    description: "Create a new combination",
    href: "/builder",
    icon: Layers3,
  },
  {
    title: "AI Stylist",
    description: "Get personal style advice",
    href: "/stylist",
    icon: WandSparkles,
  },
  {
    title: "Saved Outfits",
    description: "Your favourite looks",
    href: "/saved",
    icon: Bookmark,
  },
  {
    title: "Style History",
    description: "Revisit previous looks",
    href: "/history",
    icon: History,
  },
  {
    title: "Style Analytics",
    description: "Understand your wardrobe",
    href: "/analytics",
    icon: BarChart3,
  },
];

const panel =
  "rounded-2xl border border-white/[0.07] bg-[#111014]";

const muted = "text-[#92909e]";

function subscribeToOutfitHistory(callback: () => void) {
  window.addEventListener("outfit-history-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("outfit-history-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getOutfitHistorySnapshot() {
  return localStorage.getItem("outfitHistory") || "[]";
}

function getOutfitHistoryServerSnapshot() {
  return "[]";
}

export default function DashboardPage() {
  const { user } = useAuth();

  const [wardrobe, setWardrobe] = useState<FashionItem[]>([]);
  const [occasion, setOccasion] = useState("College");
  const [weather, setWeather] = useState("Normal");
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const recentOutfitsData = useSyncExternalStore(
  subscribeToOutfitHistory,
  getOutfitHistorySnapshot,
  getOutfitHistoryServerSnapshot
);

const recentOutfits = useMemo(() => {
  try {
    const stored: unknown = JSON.parse(recentOutfitsData);

    if (!Array.isArray(stored)) return [];

    return stored
      .filter(
        (item): item is StoredOutfit =>
          item &&
          typeof item.shirtId === "string" &&
          typeof item.pantsId === "string" &&
          typeof item.shoesId === "string"
      )
      .slice(0, 5);
  } catch {
    return [];
  }
}, [recentOutfitsData]);
  const [loadingWardrobe, setLoadingWardrobe] = useState(true);
  const [wardrobeError, setWardrobeError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [rating, setRating] = useState("");

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
            "We couldn't load your wardrobe. Check your connection and try again."
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
      watches: wardrobe.filter(
        (item) => item.category?.toLowerCase() === "watches"
      ).length,
    }),
    [wardrobe]
  );

  const firstName =
    user?.displayName?.trim().split(" ")[0] || "there";

  const totalItems = wardrobe.length;

  const wardrobeCompletion = Math.round(
    ([counts.shirts, counts.pants, counts.shoes].filter(
      (count) => count > 0
    ).length /
      3) *
      100
  );

  const recentOutfitItems = useMemo(() => {
    return recentOutfits
      .map((stored) => {
        const shirt = wardrobe.find(
          (item) => item.id === stored.shirtId
        );
        const pants = wardrobe.find(
          (item) => item.id === stored.pantsId
        );
        const shoes = wardrobe.find(
          (item) => item.id === stored.shoesId
        );

        if (!shirt || !pants || !shoes) return null;

        return { stored, shirt, pants, shoes };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, 5);
  }, [recentOutfits, wardrobe]);

  const generateOutfit = () => {
    if (loadingWardrobe || wardrobeError || generating) return;

    const pick = (category: string) => {
      const options = wardrobe.filter(
        (item) =>
          item.category?.toLowerCase() === category.toLowerCase()
      );

      return options.length
        ? options[Math.floor(Math.random() * options.length)]
        : null;
    };

    const shirt = pick("Shirts");
    const pants = pick("Pants");
    const shoes = pick("Shoes");

    if (!shirt || !pants || !shoes) {
      window.alert(
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
      mood: `${
        styles[occasion][
          Math.floor(Math.random() * styles[occasion].length)
        ]
      } · ${weatherStyle[weather]}`,
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

    try {
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

      const updatedHistory = [
        storedOutfit,
        ...readHistory("outfitHistory"),
      ].slice(0, 30);

      localStorage.setItem(
        "outfitHistory",
        JSON.stringify(updatedHistory)
      );

      localStorage.removeItem("outfitoutfitHistory");
      window.dispatchEvent(new Event("outfit-history-updated"));
    } catch (error) {
      console.error("Unable to store outfit history:", error);
    }

    setGenerating(false);
  };

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

      window.alert("Outfit saved successfully.");
    } catch (error) {
      console.error("Unable to save outfit:", error);
      window.alert("Unable to save outfit. Please try again.");
    }
  };

  const getTimeLabel = (timestamp: number) => {
    if (!timestamp) return "Recently created";

    return new Date(timestamp).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09080c] text-white">
      <Sidebar />

      <div className="min-h-screen px-4 pb-12 pt-6 sm:px-7 lg:ml-[232px] lg:px-9 xl:px-11">
        {/* Top bar */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="relative hidden w-full max-w-[390px] sm:block">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777481]"
            />
            <input
              type="search"
              placeholder="Search your style, outfits..."
              className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#121116] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#777481] focus:border-violet-500/50"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-[#121116] text-[#aaa7b4] transition hover:text-white"
            >
              <Bell size={18} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-800 text-sm font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Welcome heading */}
        <section className="mb-7">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-violet-300">
            <Sparkles size={13} />
            YOUR PERSONAL STYLE SPACE
          </p>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Good evening,{" "}
                <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  {firstName}
                </span>
              </h1>
              <p className={`mt-2 text-sm ${muted}`}>
                Your wardrobe, your identity. Make every look count.
              </p>
            </div>

            <Link
              href="/wardrobe"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#15131a] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-violet-400/50"
            >
              <Plus size={15} />
              Add clothing
            </Link>
          </div>
        </section>

        {/* Editorial hero */}
        <section className="relative mb-7 min-h-[270px] overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#17121f] sm:min-h-[300px]">
          <div className="absolute -right-12 top-[-110px] h-[390px] w-[390px] rounded-full bg-violet-600/30 blur-[2px] sm:right-[12%]" />
          <div className="absolute -right-5 bottom-[-150px] h-[300px] w-[300px] rounded-full bg-fuchsia-700/20 blur-[65px]" />

          <div className="relative z-10 grid min-h-[270px] items-center sm:min-h-[300px] sm:grid-cols-[1.15fr_.85fr]">
            <div className="relative z-20 px-6 py-8 sm:px-9 lg:px-11">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-violet-200">
                <Sparkles size={12} />
                AURA STYLE EDIT
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-violet-200/80">
                Your style, elevated
              </p>

              <h2 className="max-w-[500px] text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-[46px]">
                Dress like
                <br />
                <span className="text-violet-300">you mean it.</span>
              </h2>

              <p className="mt-4 max-w-[390px] text-sm leading-6 text-[#c1bacb]">
                Discover combinations from your own wardrobe and build a
                style that feels unmistakably yours.
              </p>

              <Link
                href="/builder"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110"
              >
                Create your look
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[48%] sm:w-[43%]">
              <div className="absolute bottom-[-30px] right-[5%] h-[240px] w-[240px] rounded-full bg-violet-500/30 sm:bottom-[-50px] sm:right-[12%] sm:h-[330px] sm:w-[330px]" />
              <Image
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=85"
                alt="Editorial fashion model"
                fill
                unoptimized
                sizes="(max-width: 640px) 45vw, 420px"
                className="object-cover object-top opacity-90 [mask-image:linear-gradient(to_right,transparent,black_35%)]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#17121f] via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-violet-300">
                YOUR WORKSPACE
              </p>
              <h2 className="text-lg font-semibold">Quick actions</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {quickActions.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-white/[0.07] bg-[#111014] p-4 transition duration-200 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-[#17131e]"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/20">
                  <Icon size={18} />
                </div>

                <h3 className="text-xs font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-1 text-[10px] leading-4 text-[#85818f]">
                  {description}
                </p>
                <ArrowUpRight
                  size={14}
                  className="mt-3 text-[#77717f] transition group-hover:text-violet-300"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Main three-column dashboard */}
        <section className="mb-8 grid gap-4 xl:grid-cols-[1.12fr_0.95fr_0.93fr]">
          {/* Today's style pick */}
          <div className={`${panel} p-5`}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.17em] text-violet-300">
                  AURA RECOMMENDS
                </p>
                <h2 className="text-base font-semibold">
                  Today&apos;s style pick
                </h2>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <WandSparkles size={18} />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                { label: "Shirt", item: outfit?.shirt },
                { label: "Pants", item: outfit?.pants },
                { label: "Shoes", item: outfit?.shoes },
              ].map(({ label, item }) => (
                <div
                  key={label}
                  className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#1c1921]"
                >
                  {item?.image ? (
                    <Image
                      src={item.image}
                      alt={label}
                      fill
                      unoptimized
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-[#77717f]">
                      {label === "Shirt" ? (
                        <Shirt size={22} />
                      ) : label === "Pants" ? (
                        <Ruler size={22} />
                      ) : (
                        <Footprints size={22} />
                      )}
                      <span className="text-[10px]">{label}</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 text-[9px] font-semibold">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold">
              {outfit?.mood || "Your next look is waiting"}
            </h3>
            <p className={`mt-1 text-xs leading-5 ${muted}`}>
              {outfit
                ? `${outfit.occasion} · ${outfit.weather} weather · Style score ${outfit.score}`
                : "Generate a coordinated look using pieces from your wardrobe."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={generateOutfit}
                disabled={
                  loadingWardrobe || generating || !!wardrobeError
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-3 py-2.5 text-[11px] font-bold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles size={14} />
                {generating ? "Creating..." : "Generate look"}
              </button>

              <button
                type="button"
                onClick={saveOutfit}
                disabled={!outfit}
                aria-label="Save outfit"
                className="flex h-9 w-10 items-center justify-center rounded-xl border border-white/10 text-[#b9b4c2] transition hover:border-violet-400/40 hover:text-white disabled:opacity-30"
              >
                <Bookmark size={16} />
              </button>
            </div>

            {outfit && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRating("Loved")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] ${
                    rating === "Loved"
                      ? "bg-violet-500/20 text-violet-200"
                      : "bg-white/[0.04] text-[#96919e]"
                  }`}
                >
                  <Heart size={12} />
                  Love it
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRating("Try another");
                    generateOutfit();
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[10px] text-[#96919e]"
                >
                  <RefreshCw size={12} />
                  Try another
                </button>
              </div>
            )}
          </div>

          {/* Wardrobe overview */}
          <div className={`${panel} p-5`}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.17em] text-violet-300">
                  YOUR COLLECTION
                </p>
                <h2 className="text-base font-semibold">
                  Wardrobe overview
                </h2>
              </div>
              <Link
                href="/wardrobe"
                aria-label="Open wardrobe"
                className="text-[#918b9c] transition hover:text-white"
              >
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  {loadingWardrobe || wardrobeError ? "—" : totalItems}
                </p>
                <p className={`mt-1 text-xs ${muted}`}>
                  Total wardrobe pieces
                </p>
              </div>
              <div className="rounded-xl bg-violet-500/10 px-3 py-2 text-right">
                <p className="text-lg font-semibold text-violet-300">
                  {loadingWardrobe || wardrobeError
                    ? "—"
                    : `${wardrobeCompletion}%`}
                </p>
                <p className="text-[9px] text-[#9b94a6]">
                  Core categories
                </p>
              </div>
            </div>

            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400 transition-all"
                style={{
                  width: `${loadingWardrobe || wardrobeError ? 0 : wardrobeCompletion}%`,
                }}
              />
            </div>

            <div className="space-y-3">
              {[
                { label: "Shirts", count: counts.shirts, icon: Shirt },
                { label: "Pants", count: counts.pants, icon: Ruler },
                { label: "Shoes", count: counts.shoes, icon: Footprints },
                { label: "Watches", count: counts.watches, icon: Clock3 },
              ].map(({ label, count, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-[#aaa3b4]">
                      <Icon size={15} />
                    </div>
                    <span className="text-xs text-[#c4bfca]">
                      {label}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {loadingWardrobe || wardrobeError ? "—" : count}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/wardrobe"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-[11px] font-semibold text-[#c5bfce] transition hover:border-violet-400/40 hover:text-white"
            >
              Explore wardrobe
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Style insights */}
          <div className={`${panel} p-5`}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.17em] text-violet-300">
                  YOUR STYLE DATA
                </p>
                <h2 className="text-base font-semibold">
                  Style insights
                </h2>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <BarChart3 size={18} />
              </div>
            </div>

            <div className="rounded-xl bg-[#191620] p-4">
              <p className={`text-[10px] ${muted}`}>
                Outfit combinations generated
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {recentOutfits.length}
              </p>
              <p className="mt-1 text-[10px] text-[#77717f]">
                Recent history entries
              </p>
            </div>

            <div className="mt-3 rounded-xl bg-[#191620] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className={`text-[10px] ${muted}`}>
                  Core wardrobe coverage
                </p>
                <span className="text-xs font-semibold text-violet-300">
                  {loadingWardrobe || wardrobeError
                    ? "—"
                    : `${wardrobeCompletion}%`}
                </span>
              </div>

              <div className="flex gap-1.5">
                {[
                  counts.shirts,
                  counts.pants,
                  counts.shoes,
                ].map((count, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${
                      count > 0 ? "bg-violet-500" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-2 text-[10px] text-[#77717f]">
                Shirts · Pants · Shoes
              </p>
            </div>

            <Link
              href="/analytics"
              className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.07] px-4 py-3 text-xs font-semibold text-[#c5bfce] transition hover:border-violet-400/40 hover:text-white"
            >
              View detailed analytics
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>

        {/* Outfit preferences */}
        <section className={`${panel} mb-8 p-5 sm:p-6`}>
          <div className="mb-4">
            <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-violet-300">
              PERSONALIZE YOUR LOOK
            </p>
            <h2 className="text-base font-semibold">
              Set your style preferences
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className={`mb-3 text-[11px] font-semibold ${muted}`}>
                OCCASION
              </p>
              <div className="flex flex-wrap gap-2">
                {occasions.map(({ name, icon: Icon }) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setOccasion(name)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] transition ${
                      occasion === name
                        ? "border-violet-400/50 bg-violet-500/15 text-violet-200"
                        : "border-white/[0.07] bg-white/[0.025] text-[#aaa5b1] hover:border-white/20"
                    }`}
                  >
                    <Icon size={14} />
                    {name}
                    {occasion === name && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className={`mb-3 text-[11px] font-semibold ${muted}`}>
                WEATHER
              </p>
              <div className="flex flex-wrap gap-2">
                {weathers.map(({ name, icon: Icon }) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setWeather(name)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] transition ${
                      weather === name
                        ? "border-violet-400/50 bg-violet-500/15 text-violet-200"
                        : "border-white/[0.07] bg-white/[0.025] text-[#aaa5b1] hover:border-white/20"
                    }`}
                  >
                    <Icon size={14} />
                    {name}
                    {weather === name && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recent outfits */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-violet-300">
                YOUR STYLE JOURNEY
              </p>
              <h2 className="text-lg font-semibold">
                Recent outfits
              </h2>
            </div>

            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-300 transition hover:text-white"
            >
              View history
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {loadingWardrobe ? (
            <div className={`${panel} p-8 text-center text-sm ${muted}`}>
              Loading your outfits...
            </div>
          ) : wardrobeError ? (
            <div className={`${panel} flex flex-wrap items-center justify-between gap-4 p-6`}>
              <p className="text-sm text-rose-300">
                {wardrobeError}
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((previous) => previous + 1)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold hover:border-violet-400/40"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          ) : recentOutfitItems.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {recentOutfitItems.map(
                ({ stored, shirt, pants, shoes }, index) => (
                  <Link
                    href="/history"
                    key={`${stored.createdAt}-${index}`}
                    className={`${panel} group overflow-hidden p-2 transition hover:-translate-y-1 hover:border-violet-400/30`}
                  >
                    <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-xl">
                      {[shirt, pants, shoes].map((item) => (
                        <div
                          key={item.id}
                          className="relative aspect-[3/4] bg-[#201c27]"
                        >
                          <Image
                            src={item.image}
                            alt={item.category}
                            fill
                            unoptimized
                            sizes="100px"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="px-1 pb-1 pt-3">
                      <p className="truncate text-xs font-semibold">
                        {stored.mood || "Saved style"}
                      </p>
                      <p className="mt-1 text-[10px] text-[#85808e]">
                        {stored.occasion} · {getTimeLabel(stored.createdAt)}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div className={`${panel} flex flex-col items-center px-5 py-10 text-center`}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                <Sparkles size={22} />
              </div>
              <h3 className="text-sm font-semibold">
                Your style story starts here
              </h3>
              <p className={`mt-2 max-w-sm text-xs leading-5 ${muted}`}>
                Generate your first outfit and it will appear here for
                quick access.
              </p>
              <button
                type="button"
                onClick={generateOutfit}
                disabled={loadingWardrobe || !!wardrobeError}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-4 py-2.5 text-xs font-bold disabled:opacity-40"
              >
                <Sparkles size={14} />
                Generate first outfit
              </button>
            </div>
          )}
        </section>

        <footer className="mt-10 border-t border-white/[0.06] pt-5 text-center text-[10px] text-[#66616e]">
          AURA AI · Your personal fashion space
        </footer>
      </div>
    </main>
  );
}
