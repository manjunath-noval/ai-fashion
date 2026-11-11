"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowUpDown,
  Check,
  CheckCircle2,
  CirclePlus,
  CloudUpload,
  ImagePlus,
  Layers3,
  LoaderCircle,
  Package,
  Pencil,
  Search,
  Shirt,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

type FashionItem = {
  id: string;
  image: string;
  category: string;
  name?: string;
  styles?: string[];
  createdAt?: number;
};

const categories = [
  "Shirts",
  "Pants",
  "Shoes",
  "Jackets",
  "Hoodies",
  "Watches",
  "Chains",
  "Caps",
  "Perfumes",
  "Bags",
];

const styleOptions = [
  "Luxury Streetwear",
  "Minimal Elite",
  "Cyber Aura",
  "Old Money Core",
];

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const categoryIcons: Record<string, string> = {
  Shirts: "👕",
  Pants: "👖",
  Shoes: "👟",
  Jackets: "🧥",
  Hoodies: "🧶",
  Watches: "⌚",
  Chains: "⛓️",
  Caps: "🧢",
  Perfumes: "🧴",
  Bags: "👜",
};

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select a valid image."));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read this image."));

    reader.onload = () => {
      const image = new window.Image();

      image.onerror = () =>
        reject(new Error("This file is not a valid image."));

      image.onload = () => {
        const maxSide = 900;
        const scale = Math.min(
          1,
          maxSide / Math.max(image.width, image.height)
        );
        const canvas = document.createElement("canvas");

        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Image processing is not supported."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

function formatDate(timestamp?: number) {
  if (!timestamp) return "Recently added";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default function WardrobePage() {
  const [images, setImages] = useState<FashionItem[]>([]);
  const [category, setCategory] = useState("Shirts");
  const [activeFilter, setActiveFilter] = useState("All Items");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loadError, setLoadError] = useState("");
  const [editingItem, setEditingItem] = useState<FashionItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Shirts");
  const [editStyles, setEditStyles] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      const user = auth.currentUser;

      if (!user) {
        if (active) {
          setImages([]);
          setLoading(false);
        }
        return;
      }

      try {
        const itemsQuery = query(
          collection(db, "wardrobe"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(itemsQuery);

        if (active) {
          setImages(
            snapshot.docs.map((itemDoc) => ({
              id: itemDoc.id,
              ...(itemDoc.data() as Omit<FashionItem, "id">),
            }))
          );
        }
      } catch (error) {
        console.error("Wardrobe loading error:", error);
        if (active) {
          setLoadError(
            "Could not load your wardrobe. Please refresh and try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadItems();

    return () => {
      active = false;
    };
  }, []);

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const user = auth.currentUser;

    if (!user) {
      showMessage("Please sign in again before uploading.", "error");
      return;
    }

    setUploading(true);
    setMessage("");

    let successful = 0;
    let skipped = 0;
    let failed = 0;

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type) || file.size > MAX_FILE_SIZE) {
        skipped++;
        continue;
      }

      try {
        const image = await compressImage(file);
        const createdAt = Date.now();
        const fileName = file.name.toLowerCase();
        const styles: string[] = [];

        if (
          fileName.includes("oversized") ||
          fileName.includes("street") ||
          fileName.includes("graphic")
        ) {
          styles.push("Luxury Streetwear");
        }

        if (
          fileName.includes("minimal") ||
          fileName.includes("plain") ||
          fileName.includes("basic")
        ) {
          styles.push("Minimal Elite");
        }

        if (
          fileName.includes("cyber") ||
          fileName.includes("techwear") ||
          fileName.includes("futuristic")
        ) {
          styles.push("Cyber Aura");
        }

        if (
          fileName.includes("formal") ||
          fileName.includes("classic") ||
          fileName.includes("tailored")
        ) {
          styles.push("Old Money Core");
        }

        const docRef = await addDoc(collection(db, "wardrobe"), {
          userId: user.uid,
          image,
          category,
          name: file.name,
          styles,
          createdAt,
        });

        setImages((previous) => [
          ...previous,
          {
            id: docRef.id,
            image,
            category,
            name: file.name,
            styles,
            createdAt,
          },
        ]);
        successful++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        failed++;
      }
    }

    const results = [
      successful
        ? `${successful} image${successful === 1 ? "" : "s"} uploaded`
        : "",
      skipped ? `${skipped} skipped (unsupported format or over 10 MB)` : "",
      failed ? `${failed} failed to upload` : "",
    ].filter(Boolean);

    showMessage(
      results.length
        ? results.join(" · ")
        : "No images were uploaded. Please check your selected files.",
      successful > 0 ? "success" : "error"
    );
    setUploading(false);
  };

  const handleEdit = (item: FashionItem) => {
    setEditingItem(item);
    setEditName(item.name || "");
    setEditCategory(item.category);
    setEditStyles(item.styles || []);
    setMessage("");
  };

  const handleSaveEdit = async () => {
    const user = auth.currentUser;

    if (!user || !editingItem) {
      showMessage("Please log in to edit wardrobe items.", "error");
      return;
    }

    if (!editName.trim()) {
      showMessage("Item name cannot be empty.", "error");
      return;
    }

    try {
      setSavingEdit(true);
      await updateDoc(doc(db, "wardrobe", editingItem.id), {
        name: editName.trim(),
        category: editCategory,
        styles: editStyles,
      });

      setImages((previous) =>
        previous.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: editName.trim(),
                category: editCategory,
                styles: editStyles,
              }
            : item
        )
      );

      setEditingItem(null);
      showMessage("Wardrobe item updated successfully.");
    } catch (error) {
      console.error("Error updating wardrobe item:", error);
      showMessage("Unable to update item. Please try again.", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    const user = auth.currentUser;

    if (!user) {
      showMessage("Please log in to delete wardrobe items.", "error");
      return;
    }

    try {
      setDeletingId(itemId);
      await deleteDoc(doc(db, "wardrobe", itemId));
      setImages((previous) => previous.filter((item) => item.id !== itemId));
      setConfirmDeleteId(null);
      showMessage("Wardrobe item deleted successfully.");
    } catch (error) {
      console.error("Error deleting wardrobe item:", error);
      showMessage("Unable to delete item. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredImages = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return images
      .filter((item) => {
        const matchesCategory =
          activeFilter === "All Items" ||
          item.category.toLowerCase() === activeFilter.toLowerCase();
        const matchesSearch =
          !search ||
          (item.name || "").toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search) ||
          (item.styles || []).some((style) => style.toLowerCase().includes(search));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = a.createdAt || 0;
        const dateB = b.createdAt || 0;
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [images, activeFilter, searchTerm, sortOrder]);

  const categoryCounts = useMemo(
    () =>
      categories.map((item) => ({
        name: item,
        count: images.filter(
          (image) => image.category.toLowerCase() === item.toLowerCase()
        ).length,
      })),
    [images]
  );

  return (
    <main className="aura-shell min-h-screen text-white">
      <Sidebar />

      <div className="aura-main min-h-screen px-5 py-7 sm:px-8 xl:px-10 lg:ml-[232px]">
        <div className="mx-auto w-full max-w-[1600px]">
          <header className="mb-8">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-slate-300">Wardrobe</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-200">
                <Sparkles size={13} />
                YOUR PERSONAL COLLECTION
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-violet-300">
                  <span className="h-px w-7 bg-violet-400" />
                  THE DIGITAL CLOSET
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Your <span className="aura-gradient-text">Wardrobe.</span>
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Every piece has potential. Organize your collection and let
                  AURA turn your clothes into your next great look.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-3">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-slate-500">
                    TOTAL PIECES
                  </p>
                  <p className="mt-1 text-2xl font-black tabular-nums">
                    {images.length.toString().padStart(2, "0")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aura-primary-btn min-h-[50px] justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CirclePlus size={18} />
                  Add clothing
                </button>
              </div>
            </div>
          </header>

          <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              {
                label: "All pieces",
                value: images.length,
                icon: Package,
                active: activeFilter === "All Items",
                onClick: () => setActiveFilter("All Items"),
              },
              ...categories.slice(0, 4).map((item) => ({
                label: item,
                value: images.filter((entry) => entry.category === item).length,
                icon: Layers3,
                active: activeFilter === item,
                onClick: () => setActiveFilter(item),
              })),
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <button
                  key={stat.label}
                  type="button"
                  onClick={stat.onClick}
                  className={`group rounded-2xl border p-4 text-left transition duration-200 ${
                    stat.active
                      ? "border-violet-400/40 bg-violet-500/[0.12]"
                      : "border-white/[0.07] bg-[#111015] hover:border-violet-400/25 hover:bg-white/[0.045]"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        stat.active
                          ? "bg-violet-500/20 text-violet-200"
                          : "bg-white/[0.05] text-slate-400"
                      }`}
                    >
                      <Icon size={17} />
                    </span>
                    {stat.active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                    )}
                  </div>
                  <p className="text-2xl font-black tabular-nums">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
                </button>
              );
            })}
          </section>

          <section className="mb-9 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
            <div className="relative overflow-hidden rounded-[26px] border border-violet-300/15 bg-[#15111d] p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-violet-200">
                  <CloudUpload size={13} />
                  BUILD YOUR COLLECTION
                </div>
                <h2 className="max-w-xl text-2xl font-black tracking-tight sm:text-3xl">
                  Make room for your
                  <span className="block aura-gradient-text">next signature look.</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Upload clear photos of your clothing. AURA keeps your pieces
                  organized so you can discover new combinations.
                </p>

                <div className="mt-5">
                  <p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-slate-500">
                    SELECT UPLOAD CATEGORY
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        disabled={uploading}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                          category === item
                            ? "border-violet-400/50 bg-violet-500/15 text-violet-100"
                            : "border-white/[0.08] bg-black/10 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <label
                    className={`aura-primary-btn min-h-11 cursor-pointer justify-center ${
                      uploading ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    {uploading ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <ImagePlus size={17} />
                    )}
                    {uploading ? "Uploading items..." : "Upload images"}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      disabled={uploading}
                      onChange={handleUpload}
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    JPG, PNG or WEBP · Up to 10 MB each
                  </span>
                </div>

                {message && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mt-5 inline-flex max-w-full items-start gap-2 rounded-xl border px-3 py-2 text-xs ${
                      messageType === "error"
                        ? "border-rose-400/20 bg-rose-400/[0.07] text-rose-200"
                        : "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
                    }`}
                  >
                    {messageType === "error" ? (
                      <X size={14} className="mt-0.5 shrink-0" />
                    ) : (
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                    )}
                    {message}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#111015] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-violet-300">
                    COLLECTION MIX
                  </p>
                  <h3 className="mt-2 text-lg font-bold">Category breakdown</h3>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-200">
                  <Layers3 size={18} />
                </span>
              </div>
              <div className="space-y-3">
                {categoryCounts
                  .filter((item) => item.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 4)
                  .map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setActiveFilter(item.name)}
                      className="group flex w-full items-center gap-3 text-left"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.045] text-base">
                        {categoryIcons[item.name]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-300 group-hover:text-white">
                            {item.name}
                          </span>
                          <span className="tabular-nums text-slate-500">
                            {item.count}
                          </span>
                        </span>
                        <span className="block h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <span
                            className="block h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400"
                            style={{
                              width: `${images.length ? (item.count / images.length) * 100 : 0}%`,
                            }}
                          />
                        </span>
                      </span>
                    </button>
                  ))}
                {images.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-center">
                    <p className="text-xs text-slate-500">
                      Your category insights will appear as you add pieces.
                    </p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveFilter("All Items")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-xs font-semibold text-slate-300 transition hover:border-violet-400/30 hover:text-white"
              >
                View full collection
                <ArrowDownWideNarrow size={14} />
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-[10px] font-bold tracking-[0.22em] text-violet-300">
                  YOUR STYLE INVENTORY
                </p>
                <h2 className="text-2xl font-black tracking-tight">
                  Your fashion pieces
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredImages.length} of {images.length} pieces shown
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[220px] flex-1 sm:flex-none">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search your wardrobe..."
                    aria-label="Search wardrobe"
                    className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#111015] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 sm:w-[260px]"
                  />
                </div>
                <label className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.09] bg-[#111015] px-3 text-slate-400">
                  <ArrowUpDown size={15} />
                  <span className="sr-only">Sort wardrobe</span>
                  <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    aria-label="Sort wardrobe"
                    className="max-w-[125px] bg-transparent text-xs text-slate-300 outline-none"
                  >
                    <option value="newest" className="bg-[#111015]">
                      Newest first
                    </option>
                    <option value="oldest" className="bg-[#111015]">
                      Oldest first
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {["All Items", ...categories].map((item) => {
                const count =
                  item === "All Items"
                    ? images.length
                    : images.filter((image) => image.category === item).length;
                const active = activeFilter === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveFilter(item)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      active
                        ? "border-violet-400/50 bg-violet-500/15 text-violet-100"
                        : "border-white/[0.08] bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {item}
                    <span className={`ml-2 ${active ? "text-violet-200" : "text-slate-600"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-white/[0.07] bg-[#111015]">
                <LoaderCircle size={28} className="animate-spin text-violet-300" />
                <p className="mt-4 text-sm text-slate-400">
                  Loading your collection...
                </p>
              </div>
            ) : loadError ? (
              <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/[0.05] p-8 text-center">
                <p className="text-sm text-rose-200">{loadError}</p>
              </div>
            ) : filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredImages.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.25) }}
                    whileHover={{ y: -4 }}
                    className="group overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#111015] transition-colors hover:border-violet-400/25"
                  >
                    <div className="relative aspect-[4/4.6] overflow-hidden bg-[#1b1821]">
                      <Image
                        src={item.image}
                        alt={item.name || item.category}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                        {item.category}
                      </span>
                      <span className="absolute bottom-3 left-3 text-[10px] text-white/70">
                        {formatDate(item.createdAt)}
                      </span>
                      <div className="absolute right-3 top-3 flex gap-1.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          aria-label={`Edit ${item.name || item.category}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:bg-violet-600"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          aria-label={`Delete ${item.name || item.category}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:bg-rose-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-white">
                            {item.name || item.category}
                          </h3>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {item.category}
                          </p>
                        </div>
                        <span className="mt-0.5 text-base">
                          {categoryIcons[item.category] || "✦"}
                        </span>
                      </div>

                      {item.styles && item.styles.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.styles.slice(0, 2).map((style) => (
                            <span
                              key={style}
                              className="rounded-full border border-violet-400/15 bg-violet-400/[0.07] px-2 py-1 text-[9px] font-medium text-violet-200"
                            >
                              {style}
                            </span>
                          ))}
                          {item.styles.length > 2 && (
                            <span className="px-1 py-1 text-[9px] text-slate-500">
                              +{item.styles.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="mt-3 text-[10px] text-slate-600">
                          No style tags yet
                        </p>
                      )}

                      <AnimatePresence>
                        {confirmDeleteId === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 overflow-hidden"
                          >
                            <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-3">
                              <p className="text-xs font-medium text-rose-100">
                                Delete this wardrobe item?
                              </p>
                              <div className="mt-2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  disabled={deletingId === item.id}
                                  className="flex-1 rounded-lg bg-rose-500 px-2 py-2 text-[11px] font-bold text-white disabled:opacity-50"
                                >
                                  {deletingId === item.id ? "Deleting..." : "Delete"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  disabled={deletingId === item.id}
                                  className="flex-1 rounded-lg border border-white/10 px-2 py-2 text-[11px] font-semibold text-slate-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/[0.11] bg-[#111015] px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
                  <Shirt size={28} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">
                  {images.length === 0
                    ? "Your collection starts here"
                    : searchTerm.trim()
                      ? "No matching pieces found"
                      : `No ${activeFilter.toLowerCase()} yet`}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {images.length === 0
                    ? "Choose a category and upload your first clothing photo. Your personal style collection will grow from here."
                    : "Try a different category or search term to find what you are looking for."}
                </p>
                {images.length === 0 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aura-primary-btn mt-5 justify-center"
                  >
                    <ImagePlus size={16} />
                    Add your first piece
                  </button>
                )}
              </div>
            )}
          </section>

          <footer className="mt-12 border-t border-white/[0.06] py-6 text-center text-[11px] text-slate-600">
            AURA AI · Your personal fashion space
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !savingEdit) {
                setEditingItem(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-wardrobe-title"
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[26px] border border-white/10 bg-[#15121b] p-6 shadow-2xl shadow-black/50"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-violet-300">
                    COLLECTION DETAILS
                  </p>
                  <h2
                    id="edit-wardrobe-title"
                    className="mt-2 text-2xl font-black"
                  >
                    Edit wardrobe item
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  disabled={savingEdit}
                  aria-label="Close edit dialog"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Item name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                placeholder="Enter item name"
                className="mb-5 h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50"
              />

              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Category
              </label>
              <select
                value={editCategory}
                onChange={(event) => setEditCategory(event.target.value)}
                className="mb-6 h-12 w-full rounded-xl border border-white/10 bg-[#100e14] px-4 text-sm text-white outline-none focus:border-violet-400/50"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <div className="mb-7">
                <label className="mb-3 block text-xs font-semibold text-slate-300">
                  Fashion styles
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {styleOptions.map((style) => {
                    const selected = editStyles.includes(style);
                    return (
                      <label
                        key={style}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs transition ${
                          selected
                            ? "border-violet-400/40 bg-violet-400/10 text-violet-100"
                            : "border-white/[0.08] bg-white/[0.025] text-slate-400 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => {
                            setEditStyles((previous) =>
                              event.target.checked
                                ? [...previous, style]
                                : previous.filter((item) => item !== style)
                            );
                          }}
                          className="h-4 w-4 accent-violet-500"
                        />
                        <span className="flex-1">{style}</span>
                        {selected && <Check size={14} />}
                      </label>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-slate-600">
                  Select every style that fits this item.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  disabled={savingEdit}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.04] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="aura-primary-btn flex-1 justify-center disabled:opacity-50"
                >
                  {savingEdit && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {savingEdit ? "Saving changes..." : "Save changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
