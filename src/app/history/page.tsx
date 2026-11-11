"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  CloudSun,
  History,
  Shirt,
  Sparkles,
  Star,
  Watch,
} from "lucide-react";

type FashionItem = {
  id: string;
  image: string;
  category: string;
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

type ResolvedOutfit = StoredOutfit & {
  shirt: FashionItem | null;
  pants: FashionItem | null;
  shoes: FashionItem | null;
  watch: FashionItem | null;
};

function readOutfitHistory(): StoredOutfit[] {
  try {
    const stored = localStorage.getItem("outfitHistory");
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? (parsed as StoredOutfit[]) : [];
  } catch {
    return [];
  }
}

function formatDate(timestamp: number) {
  if (!timestamp) return "Date unavailable";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(timestamp: number) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function OutfitHistoryPage() {
  const { user } = useAuth();

  const [outfitHistory, setOutfitHistory] = useState<StoredOutfit[]>([]);
  const [wardrobe, setWardrobe] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!user?.uid) {
        if (active) {
          setOutfitHistory([]);
          setWardrobe([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const parsed = readOutfitHistory();
        if (active) setOutfitHistory(parsed);

        const wardrobeQuery = query(
          collection(db, "wardrobe"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(wardrobeQuery);
        const items = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<FashionItem, "id">),
        }));

        if (active) setWardrobe(items);
      } catch (error) {
        console.error("Unable to load outfit history:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();

    const refreshHistory = () => {
      setOutfitHistory(readOutfitHistory());
    };

    window.addEventListener("outfit-history-updated", refreshHistory);

    return () => {
      active = false;
      window.removeEventListener("outfit-history-updated", refreshHistory);
    };
  }, [user?.uid]);

  const resolvedHistory = useMemo<ResolvedOutfit[]>(() => {
    const getItem = (id: string) =>
      wardrobe.find((item) => item.id === id) ?? null;

    return outfitHistory.map((outfit) => ({
      ...outfit,
      shirt: getItem(outfit.shirtId),
      pants: getItem(outfit.pantsId),
      shoes: getItem(outfit.shoesId),
      watch: outfit.watchId ? getItem(outfit.watchId) : null,
    }));
  }, [outfitHistory, wardrobe]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08070d] text-white">
      <Sidebar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-[-180px] h-[480px] w-[480px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-[-180px] h-[480px] w-[480px] rounded-full bg-fuchsia-700/[0.08] blur-[140px]" />
      </div>

      <div className="relative z-10 min-h-screen px-4 pb-12 pt-7 sm:px-7 lg:ml-[232px] lg:px-9 lg:pt-9">
        <div className="mx-auto max-w-[1450px]">
          {/* Header */}
          <header className="mb-9 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-violet-200">
                <History size={14} />
                YOUR STYLE TIMELINE
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Outfit{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent">
                  history.
                </span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Revisit the combinations you’ve created and see how your style
                has evolved over time.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-3.5">
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/35">
                Looks generated
              </p>
              <p className="mt-1.5 text-2xl font-semibold tabular-nums text-white">
                {outfitHistory.length}
              </p>
            </div>
          </header>

          {/* Timeline header */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white/85">
                Your journey
              </h2>
              <p className="mt-1 text-xs text-white/35">
                {loading
                  ? "Loading your outfit timeline..."
                  : `${outfitHistory.length} ${outfitHistory.length === 1 ? "outfit" : "outfits"} in your history`}
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] text-white/40 sm:flex">
              <Clock3 size={13} className="text-violet-300" />
              Your style, over time
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-[26px] border border-white/[0.06] bg-white/[0.025]"
                />
              ))}
            </div>
          ) : resolvedHistory.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/[0.12] bg-white/[0.02] px-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] border border-violet-300/15 bg-violet-500/10 text-violet-200">
                <History size={26} />
              </div>
              <h3 className="text-xl font-semibold text-white/85">
                Your style journey starts here
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                Generate your first combination in Outfit Builder. Your
                creations will appear here so you can revisit them anytime.
              </p>
            </div>
          ) : (
            <div className="relative space-y-5">
              <div className="absolute bottom-8 left-[19px] top-8 hidden w-px bg-gradient-to-b from-violet-400/35 via-violet-400/10 to-transparent sm:block" />

              {resolvedHistory.map((outfit, index) => {
                const pieces = [
                  { label: "Top", item: outfit.shirt },
                  { label: "Bottom", item: outfit.pants },
                  { label: "Shoes", item: outfit.shoes },
                ];

                return (
                  <motion.article
                    key={`${outfit.createdAt}-${outfit.shirtId}-${outfit.pantsId}-${index}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.18) }}
                    className="relative sm:pl-10"
                  >
                    <div className="absolute left-[12px] top-7 z-10 hidden h-4 w-4 rounded-full border-[3px] border-[#08070d] bg-violet-400 shadow-[0_0_16px_rgba(167,139,250,0.4)] sm:block" />

                    <div className="overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#100e18]/90 shadow-[0_18px_55px_rgba(0,0,0,0.16)] transition-colors hover:border-violet-300/20">
                      <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row">
                        {/* Outfit preview */}
                        <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 lg:max-w-[490px]">
                          {pieces.map(({ label, item }) => (
                            <div
                              key={label}
                              className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20"
                            >
                              {item ? (
                                <Image
                                  src={item.image}
                                  alt={item.category || label}
                                  width={400}
                                  height={420}
                                  unoptimized
                                  className="h-32 w-full object-cover sm:h-40"
                                />
                              ) : (
                                <div className="flex h-32 flex-col items-center justify-center gap-2 text-white/20 sm:h-40">
                                  <Shirt size={19} />
                                  <span className="text-[10px]">Unavailable</span>
                                </div>
                              )}
                              <div className="border-t border-white/[0.05] px-2.5 py-2">
                                <p className="text-[9px] uppercase tracking-[0.12em] text-white/30">
                                  {label}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] font-medium text-white/65">
                                  {item?.category || "Not available"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Details */}
                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/15 bg-violet-300/[0.07] px-2.5 py-1.5 text-[10px] font-medium text-violet-200/90">
                              <Sparkles size={11} />
                              {outfit.mood || "Personal style"}
                            </span>
                            {outfit.score && (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-2.5 py-1.5 text-[10px] text-amber-200/85">
                                <Star size={11} />
                                {outfit.score}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-4 text-xl font-semibold text-white/90 sm:text-2xl">
                            {outfit.occasion || "Outfit combination"}
                          </h3>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {outfit.weather && (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/50">
                                <CloudSun size={11} className="text-violet-300" />
                                {outfit.weather}
                              </span>
                            )}
                            {outfit.watchId && (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/50">
                                <Watch size={11} className="text-violet-300" />
                                Watch included
                              </span>
                            )}
                          </div>

                          {outfit.watchId && outfit.watch && (
                            <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5">
                              <Image
                                src={outfit.watch.image}
                                alt={outfit.watch.category || "Watch"}
                                width={64}
                                height={64}
                                unoptimized
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="text-[9px] uppercase tracking-[0.12em] text-white/30">
                                  ACCESSORY
                                </p>
                                <p className="mt-0.5 text-xs text-white/70">
                                  {outfit.watch.category}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-[11px] text-white/35">
                            <CalendarDays size={13} className="text-violet-300/80" />
                            {formatDate(outfit.createdAt)}
                            {formatTime(outfit.createdAt) && (
                              <>
                                <span className="text-white/15">·</span>
                                {formatTime(outfit.createdAt)}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
