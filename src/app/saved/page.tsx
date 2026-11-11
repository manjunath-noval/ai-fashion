"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import {
  Bookmark,
  CalendarDays,
  CloudSun,
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

function readSavedOutfits(): StoredOutfit[] {
  try {
    const stored = localStorage.getItem("savedOutfits");
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? (parsed as StoredOutfit[]) : [];
  } catch {
    return [];
  }
}

function formatSavedDate(timestamp: number) {
  if (!timestamp) return "Saved outfit";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Saved outfit";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function SavedPage() {
  const { user } = useAuth();

  const [savedOutfits, setSavedOutfits] = useState<StoredOutfit[]>([]);
  const [wardrobe, setWardrobe] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!user?.uid) {
        if (active) {
          setSavedOutfits([]);
          setWardrobe([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const parsed = readSavedOutfits();

        if (active) setSavedOutfits(parsed);

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
        console.error("Unable to load saved outfits:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();

    const refreshSavedOutfits = () => {
      setSavedOutfits(readSavedOutfits());
    };

    window.addEventListener("saved-outfits-updated", refreshSavedOutfits);
    window.addEventListener("storage", refreshSavedOutfits);

    return () => {
      active = false;
      window.removeEventListener("saved-outfits-updated", refreshSavedOutfits);
      window.removeEventListener("storage", refreshSavedOutfits);
    };
  }, [user?.uid]);

  const resolvedSavedOutfits = useMemo<ResolvedOutfit[]>(() => {
    const getItem = (id: string) =>
      wardrobe.find((item) => item.id === id) ?? null;

    return savedOutfits.map((outfit) => ({
      ...outfit,
      shirt: getItem(outfit.shirtId),
      pants: getItem(outfit.pantsId),
      shoes: getItem(outfit.shoesId),
      watch: outfit.watchId ? getItem(outfit.watchId) : null,
    }));
  }, [savedOutfits, wardrobe]);

  const availableCount = resolvedSavedOutfits.filter(
    (outfit) => outfit.shirt || outfit.pants || outfit.shoes
  ).length;

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
                <Bookmark size={14} />
                YOUR PERSONAL COLLECTION
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Saved{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent">
                  outfits.
                </span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
                Your favorite AURA combinations, collected in one place and
                ready to inspire your next look.
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-[300px]">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5">
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/35">
                  Saved looks
                </p>
                <p className="mt-1.5 text-2xl font-semibold tabular-nums text-white">
                  {savedOutfits.length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5">
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/35">
                  With wardrobe items
                </p>
                <p className="mt-1.5 text-2xl font-semibold tabular-nums text-white">
                  {availableCount}
                </p>
              </div>
            </div>
          </header>

          {/* Collection heading */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white/85">
                Your collection
              </h2>
              <p className="mt-1 text-xs text-white/35">
                {loading
                  ? "Loading your saved looks..."
                  : `${savedOutfits.length} ${savedOutfits.length === 1 ? "look" : "looks"} saved`}
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] text-white/40 sm:flex">
              <Sparkles size={13} className="text-violet-300" />
              Curated by you
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[360px] animate-pulse rounded-[26px] border border-white/[0.06] bg-white/[0.025]"
                />
              ))}
            </div>
          ) : resolvedSavedOutfits.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/[0.12] bg-white/[0.02] px-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] border border-violet-300/15 bg-violet-500/10 text-violet-200">
                <Bookmark size={26} />
              </div>
              <h3 className="text-xl font-semibold text-white/85">
                Your collection starts here
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                Save outfits from Outfit Builder and they’ll appear here, ready
                whenever you need a little style inspiration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {resolvedSavedOutfits.map((outfit, index) => {
                const pieces = [
                  { label: "Top", item: outfit.shirt },
                  { label: "Bottom", item: outfit.pants },
                  { label: "Shoes", item: outfit.shoes },
                  { label: "Watch", item: outfit.watch },
                ].filter(
                  (piece): piece is { label: string; item: FashionItem } =>
                    Boolean(piece.item)
                );

                return (
                  <motion.article
                    key={`${outfit.createdAt}-${outfit.shirtId}-${outfit.pantsId}-${index}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.2) }}
                    whileHover={{ y: -4 }}
                    className="group overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#100e18]/90 shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition-colors hover:border-violet-300/20"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-200">
                          <Sparkles size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white/80">
                            {outfit.mood || "Personal style"}
                          </p>
                          <p className="mt-0.5 text-[10px] text-white/35">
                            {formatSavedDate(outfit.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300/15 bg-amber-300/[0.07] px-2.5 py-1.5 text-[10px] font-medium text-amber-200/90">
                        <Star size={11} />
                        {outfit.score || "Saved"}
                      </div>
                    </div>

                    {/* Outfit pieces */}
                    <div className="grid grid-cols-3 gap-2 p-4">
                      {[
                        { label: "Top", item: outfit.shirt, icon: Shirt },
                        { label: "Bottom", item: outfit.pants, icon: Shirt },
                        { label: "Shoes", item: outfit.shoes, icon: Shirt },
                      ].map(({ label, item, icon: PieceIcon }) => (
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
                              className="h-36 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-40"
                            />
                          ) : (
                            <div className="flex h-36 flex-col items-center justify-center gap-2 text-white/20 sm:h-40">
                              <PieceIcon size={20} />
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

                    {/* Metadata */}
                    <div className="px-5 pb-5">
                      <div className="flex flex-wrap gap-2">
                        {outfit.occasion && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/55">
                            <CalendarDays size={11} className="text-violet-300" />
                            {outfit.occasion}
                          </span>
                        )}
                        {outfit.weather && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/55">
                            <CloudSun size={11} className="text-violet-300" />
                            {outfit.weather}
                          </span>
                        )}
                        {outfit.watchId && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/55">
                            <Watch size={11} className="text-violet-300" />
                            Accessory saved
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
                            className="h-11 w-11 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-[10px] text-white/35">
                              ACCESSORY
                            </p>
                            <p className="mt-0.5 text-xs text-white/70">
                              {outfit.watch.category}
                            </p>
                          </div>
                        </div>
                      )}

                      {pieces.length === 0 && (
                        <p className="mt-3 text-[11px] text-amber-200/60">
                          Some wardrobe pieces are no longer available.
                        </p>
                      )}
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
