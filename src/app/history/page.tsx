
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

export default function OutfitHistoryPage() {
  const { user } = useAuth();

  const [outfitHistory, setOutfitHistory] =
    useState<StoredOutfit[]>([]);

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
      const stored = localStorage.getItem("outfitHistory");
      const parsed: unknown = stored ? JSON.parse(stored) : [];

      if (active) {
        setOutfitHistory(Array.isArray(parsed) ? parsed : []);
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
      console.error("Unable to load outfit history:", error);
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  void loadData();

  const refreshHistory = () => {
    try {
      const stored = localStorage.getItem("outfitHistory");
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      setOutfitHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      setOutfitHistory([]);
    }
  };

  window.addEventListener("outfit-history-updated", refreshHistory);

  return () => {
    active = false;
    window.removeEventListener("outfit-history-updated", refreshHistory);
  };
}, [user?.uid]);

  const getItem = (id: string) =>
    wardrobe.find((item) => item.id === id) ?? null;

  const resolvedHistory = outfitHistory.map((outfit) => ({
    ...outfit,
    shirt: getItem(outfit.shirtId),
    pants: getItem(outfit.pantsId),
    shoes: getItem(outfit.shoesId),
    watch: outfit.watchId ? getItem(outfit.watchId) : null,
  }));

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Sidebar />

      {/* Glow */}
      <div className="absolute top-0 left-0 pointer-events-none ..." />
      <div className="absolute bottom-0 right-0 pointer-events-none ..." />

      <div className="relative z-10 lg:ml-[280px] px-8 py-10 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300 mb-5">
            AI Outfit Timeline
          </div>

          <h1 className="text-5xl font-extrabold">
            Outfit
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}History
            </span>
          </h1>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {loading ? (
       <div className="text-center text-gray-400 py-10">
         Loading outfit history...
       </div>
            ) : resolvedHistory.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-[25px] p-10 text-center">
              <h2 className="text-2xl font-bold text-white">
                No outfit history yet
              </h2>
              <p className="text-gray-400 mt-3">
                Generate your first outfit to see it here.
              </p>
            </div>
          ) : (
            resolvedHistory.map((outfit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-6 backdrop-blur-xl"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-[420px]">
                    {outfit.shirt && (
                      <Image
                        src={outfit.shirt.image}
                        alt="shirt"
                        width={400}
                        height={300}
                        unoptimized
                        className="h-32 w-full object-cover rounded-2xl"
                      />
                    )}

                    {outfit.pants && (
                      <Image
                        src={outfit.pants.image}
                        alt="pants"
                        width={400}
                        height={300}
                        unoptimized
                        className="h-32 w-full object-cover rounded-2xl"
                      />
                    )}

                    {outfit.shoes && (
                      <Image
                        src={outfit.shoes.image}
                        alt="shoes"
                        width={400}
                        height={300}
                        unoptimized
                        className="h-32 w-full object-cover rounded-2xl"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <h2 className="text-3xl font-bold">
                      {outfit.mood}
                    </h2>

                    <div className="mt-5 flex gap-4">
                      <div className="px-5 py-2 rounded-full bg-white/10">
                        {outfit.score}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
