
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

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

      try {
        const stored = localStorage.getItem("savedOutfits");
        const parsed: unknown = stored ? JSON.parse(stored) : [];

        if (active) {
          setSavedOutfits(Array.isArray(parsed) ? parsed : []);
        }

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
        console.error("Unable to load saved outfits:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();

    const refreshSavedOutfits = () => {
      try {
        const stored = localStorage.getItem("savedOutfits");
        const parsed: unknown = stored ? JSON.parse(stored) : [];
        setSavedOutfits(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSavedOutfits([]);
      }
    };

    window.addEventListener("saved-outfits-updated", refreshSavedOutfits);
    window.addEventListener("storage", refreshSavedOutfits);

    return () => {
      active = false;
      window.removeEventListener("saved-outfits-updated", refreshSavedOutfits);
      window.removeEventListener("storage", refreshSavedOutfits);
    };
  }, [user?.uid]);

  const getItem = (id: string) =>
    wardrobe.find((item) => item.id === id) ?? null;

  const resolvedSavedOutfits = savedOutfits.map((outfit) => ({
    ...outfit,
    shirt: getItem(outfit.shirtId),
    pants: getItem(outfit.pantsId),
    shoes: getItem(outfit.shoesId),
    watch: outfit.watchId ? getItem(outfit.watchId) : null,
  }));

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Sidebar />

      {/* Background Glow */}
      <div className="absolute top-0 left-0 pointer-events-none ..." />
      <div className="absolute bottom-0 right-0 pointer-events-none ..." />

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
        {loading ? (
  <div className="text-gray-400 text-xl">
    Loading saved outfits...
  </div>
) : resolvedSavedOutfits.length === 0 ? (
          <div className="text-gray-400 text-xl">
            No saved outfits yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resolvedSavedOutfits.map((outfit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-6 backdrop-blur-xl"
              >
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {outfit.shirt && (
                    <Image
                      src={outfit.shirt.image}
                      alt="shirt"
                      width={400}
                      height={300}
                      unoptimized
                      className="h-28 w-full object-cover rounded-2xl"
                    />
                  )}

                  {outfit.pants && (
                    <Image
                      src={outfit.pants.image}
                      alt="pants"
                      width={400}
                      height={300}
                      unoptimized
                      className="h-28 w-full object-cover rounded-2xl"
                    />
                  )}

                  {outfit.shoes && (
                    <Image
                      src={outfit.shoes.image}
                      alt="shoes"
                      width={400}
                      height={300}
                      unoptimized
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
