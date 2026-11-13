
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Heart,
  Palette,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const feeds = [
  {
    id: "minimal",
    aura: "Minimal Elite",
    mood: "Calm Confidence",
    color: "Black & Silver",
    category: "Minimal",
    recommendation:
      "Monochrome layering with premium sneakers creates a timeless luxury aura.",
    gradient: "from-zinc-300/20 via-violet-500/20 to-zinc-500/10",
    accent: "text-violet-300",
    tag: "Quiet sophistication",
  },
  {
    id: "cyber",
    aura: "Cyber Street",
    mood: "Bold Energy",
    color: "Purple & Cyan",
    category: "Streetwear",
    recommendation:
      "Oversized silhouettes with futuristic accessories bring a bold energy to your everyday look.",
    gradient: "from-purple-500/25 via-fuchsia-500/15 to-cyan-500/20",
    accent: "text-fuchsia-300",
    tag: "Futuristic expression",
  },
  {
    id: "classic",
    aura: "Old Money Core",
    mood: "Quiet Luxury",
    color: "Cream & Brown",
    category: "Classic",
    recommendation:
      "Structured neutral layering creates effortless sophistication.",
    gradient: "from-amber-200/15 via-stone-400/15 to-orange-500/10",
    accent: "text-amber-200",
    tag: "Timeless refinement",
  },
];

const looks = [
  {
    id: "look-1",
    name: "Urban Monochrome",
    category: "Streetwear",
    mood: "Bold & modern",
    colors: "Black · Grey · White",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85",
  },
  {
    id: "look-2",
    name: "Quiet Luxury",
    category: "Classic",
    mood: "Elegant & refined",
    colors: "Cream · Beige · Brown",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
  },
  {
    id: "look-3",
    name: "Modern Minimal",
    category: "Minimal",
    mood: "Clean & effortless",
    colors: "White · Black · Grey",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85",
  },
  {
    id: "look-4",
    name: "Street Expression",
    category: "Streetwear",
    mood: "Creative & confident",
    colors: "Dark tones · Purple",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=900&q=85",
  },
  {
    id: "look-5",
    name: "Classic Layers",
    category: "Classic",
    mood: "Timeless & polished",
    colors: "Brown · Cream · Tan",
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900&q=85",
  },
  {
    id: "look-6",
    name: "Minimal Street",
    category: "Minimal",
    mood: "Relaxed & versatile",
    colors: "Grey · Black · White",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85",
  },
];

const categories = ["All", "Minimal", "Streetwear", "Classic"];

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState(feeds[0]);
  const [savedLooks, setSavedLooks] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem("nova-feed-saved");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [likedLooks, setLikedLooks] = useState<string[]>([]);

  const today = feeds[new Date().getDate() % feeds.length];


  const toggleSave = (id: string) => {
    setSavedLooks((current) => {
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      localStorage.setItem("nova-feed-saved", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLike = (id: string) => {
    setLikedLooks((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const filteredLooks =
    selectedCategory === "All"
      ? looks
      : looks.filter((look) => look.category === selectedCategory);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08070d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute -bottom-48 left-[20%] h-[450px] w-[450px] rounded-full bg-fuchsia-700/[0.07] blur-[140px]" />
      </div>

      <Sidebar />

      <div className="relative min-h-screen lg:ml-[232px]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
                NOVA intelligence
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px]">
                Your style universe.
              </h1>
              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                Discover aesthetics, explore looks and find your next outfit.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs text-zinc-400">
              <CalendarDays size={14} className="text-violet-300" />
              Daily inspiration
            </div>
          </motion.div>

          {/* Daily style feature */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[28px] border border-violet-400/15 bg-gradient-to-br from-[#211638] via-[#151020] to-[#100d17] p-6 sm:p-9 lg:p-11"
          >
            <div className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full border border-violet-300/10" />
            <div className="pointer-events-none absolute -right-8 -top-16 h-72 w-72 rounded-full border border-violet-300/[0.08]" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-violet-200">
                    <Sparkles size={17} />
                  </div>
                  <span className="text-sm font-medium text-violet-200">
                    Today&apos;s style direction
                  </span>
                </div>

                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-zinc-300">
                  {today.tag}
                </div>

                <h2 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {today.aura}
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-300/75 sm:text-base">
                  Discover a style direction that reflects your personality
                  and gives your everyday outfits a distinctive identity.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                      Today&apos;s mood
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-100">
                      {today.mood}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                      Signature colors
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-100">
                      {today.color}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStyle(today)}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  Explore this aesthetic
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="relative flex min-h-[280px] items-center justify-center sm:min-h-[340px]">
                <div className="absolute h-64 w-64 rounded-full bg-violet-500/15 blur-[65px]" />

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 35,
                    ease: "linear",
                  }}
                  className="absolute h-64 w-64 rounded-full border border-dashed border-violet-300/20 sm:h-72 sm:w-72"
                />

                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className={`relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br ${today.gradient} shadow-[0_0_80px_rgba(139,92,246,0.16)] sm:h-60 sm:w-60`}
                >
                  <div className="absolute inset-4 rounded-full border border-white/10" />
                  <div className="text-center">
                    <Sparkles size={34} className={`mx-auto mb-4 ${today.accent}`} />
                    <p className="text-xl font-bold tracking-wide">NOVA</p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                      Style energy
                    </p>
                  </div>
                </motion.div>

                <Sparkles className="absolute right-[12%] top-[17%] text-violet-200/70" size={19} />
                <Zap className="absolute bottom-[17%] left-[12%] text-fuchsia-200/70" size={20} />
              </div>
            </div>
          </motion.section>

          {/* Aesthetic selector */}
          <section className="mt-10">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Explore aesthetics</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Choose a style direction to explore
                </p>
              </div>
              <span className="text-xs text-zinc-500">
                {feeds.length} style identities
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {feeds.map((feed, index) => (
                <motion.button
                  key={feed.id}
                  onClick={() => setSelectedStyle(feed)}
                  whileHover={{ y: -4 }}
                  className={`group relative overflow-hidden rounded-[22px] border bg-[#121019]/90 p-5 text-left transition ${
                    selectedStyle.id === feed.id
                      ? "border-violet-400/50 shadow-[0_0_30px_rgba(139,92,246,0.10)]"
                      : "border-white/[0.075] hover:border-violet-400/25"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feed.gradient} opacity-60`} />
                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-violet-200">
                        <Palette size={19} />
                      </div>
                      <span className="text-[10px] font-semibold tracking-widest text-white/40">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{feed.aura}</h3>
                    <p className="mt-1 text-xs text-zinc-400">{feed.tag}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                      <span className="text-zinc-400">{feed.mood}</span>
                      <span className="flex items-center gap-1 text-violet-300">
                        Explore <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Selected aesthetic */}
          <motion.section
            key={selectedStyle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 rounded-[24px] border border-white/[0.075] bg-[#121019]/90 p-6 sm:p-8"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <Sparkles size={19} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
                  Selected style direction
                </p>
                <h3 className="mt-1 text-lg font-semibold">{selectedStyle.aura}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
                  {selectedStyle.recommendation}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
                  <span className="rounded-full border border-white/10 px-3 py-1.5">
                    {selectedStyle.mood}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5">
                    {selectedStyle.color}
                  </span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Outfit discovery */}
          <section className="mt-11">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                  <Sun size={14} />
                  Curated inspiration
                </div>
                <h2 className="text-2xl font-bold">Discover your next look.</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Explore outfit inspiration across different aesthetics.
                </p>
              </div>
              <span className="text-xs text-zinc-500">
                {savedLooks.length} saved looks
              </span>
            </div>

            {/* Category filters */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    selectedCategory === category
                      ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
                      : "border-white/10 bg-white/[0.025] text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Look cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredLooks.map((look, index) => (
                <motion.article
                  key={look.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="group overflow-hidden rounded-[22px] border border-white/[0.075] bg-[#121019]/90 transition hover:border-violet-400/25"
                >
                  <div
                    className="relative h-[310px] overflow-hidden bg-zinc-900 bg-cover bg-center sm:h-[340px]"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(8,7,13,0.75), transparent 55%), url("${look.image}")`,
                    }}
                  >
                    <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
                      {look.category}
                    </div>

                    <div className="absolute right-4 top-4 flex gap-2">
                      <button
                        onClick={() => toggleLike(look.id)}
                        aria-label={likedLooks.includes(look.id) ? "Unlike look" : "Like look"}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-md transition hover:bg-black/70 ${
                          likedLooks.includes(look.id) ? "text-pink-400" : "text-white"
                        }`}
                      >
                        <Heart size={16} fill={likedLooks.includes(look.id) ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => toggleSave(look.id)}
                        aria-label={savedLooks.includes(look.id) ? "Remove saved look" : "Save look"}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-md transition hover:bg-black/70 ${
                          savedLooks.includes(look.id) ? "text-violet-300" : "text-white"
                        }`}
                      >
                        <Bookmark size={16} fill={savedLooks.includes(look.id) ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                        NOVA lookbook
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-white">
                        {look.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-zinc-400">{look.mood}</span>
                      <span className="text-zinc-500">{look.colors}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <span className="text-xs text-zinc-500">
                        {savedLooks.includes(look.id) ? "Saved to your collection" : "Style inspiration"}
                      </span>
                      <button
                        onClick={() => toggleSave(look.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-violet-300 transition hover:text-violet-200"
                      >
                        {savedLooks.includes(look.id) ? "Saved" : "Save look"}
                        <Bookmark size={13} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredLooks.length === 0 && (
              <p className="py-12 text-center text-sm text-zinc-500">
                No looks found in this category.
              </p>
            )}
          </section>

          {/* Footer */}
          <div className="mt-10 flex items-center gap-2 border-t border-white/[0.06] pt-5 text-xs text-zinc-600">
            <Sparkles size={13} className="text-violet-400" />
            Your style universe, powered by NOVA AI.
          </div>
        </div>
      </div>
    </main>
  );
}
