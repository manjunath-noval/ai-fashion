
"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db, auth } from "../../firebase/config";
import { motion } from "framer-motion";
import {
  ImagePlus,
  Shirt,
  Sparkles,
  LoaderCircle,
  Search,
  ArrowUpDown,
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


function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select a valid image."));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () =>
      reject(new Error("Could not read this image."));

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

        canvas.width = Math.max(
          1,
          Math.round(image.width * scale)
        );

        canvas.height = Math.max(
          1,
          Math.round(image.height * scale)
        );

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Image processing is not supported."));
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
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
  const [loadError, setLoadError] = useState("");
  const [editingItem, setEditingItem] = useState<FashionItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Shirts");
  const [editStyles, setEditStyles] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
const [deletingId, setDeletingId] = useState<string | null>(null);
const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<FashionItem, "id">),
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
        if (active) {
          setLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const user = auth.currentUser;

    if (!user) {
      setMessage("Please sign in again before uploading.");
      return;
    }

    setUploading(true);
    setMessage("");

    let successful = 0;
    let skipped = 0;
    let failed = 0;

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        skipped++;
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
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
      successful > 0
        ? `${successful} image${successful === 1 ? "" : "s"} uploaded`
        : "",
      skipped > 0
        ? `${skipped} skipped (unsupported format or over 10 MB)`
        : "",
      failed > 0
        ? `${failed} failed to upload`
        : "",
    ].filter(Boolean);

    setMessage(
      results.length
        ? results.join(" · ")
        : "No images were uploaded. Please check your selected files."
    );

        setUploading(false);
  };

  // EDIT ITEM
  const handleEdit = (item: FashionItem) => {
  setEditingItem(item);
  setEditName(item.name || "");
  setEditCategory(item.category);
  setEditStyles(item.styles || []);
  setMessage("");
};

  // SAVE EDIT
  const handleSaveEdit = async () => {
    const user = auth.currentUser;

    if (!user || !editingItem) {
      setMessage("Please log in to edit wardrobe items.");
      return;
    }

    if (!editName.trim()) {
      setMessage("Item name cannot be empty.");
      return;
    }

    try {
      setSavingEdit(true);

      await updateDoc(doc(db, "wardrobe", editingItem.id), {
  name: editName.trim(),
  category: editCategory,
  styles: editStyles,
});

      setImages((prev) =>
  prev.map((item) =>
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
      setMessage("Wardrobe item updated successfully.");
    } catch (error) {
      console.error("Error updating wardrobe item:", error);
      setMessage("Unable to update item. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  // DELETE ITEM
  const handleDelete = async (itemId: string) => {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please log in to delete wardrobe items.");
      return;
    }

    try {
      setDeletingId(itemId);

      await deleteDoc(doc(db, "wardrobe", itemId));

      setImages((prev) => prev.filter((item) => item.id !== itemId));
      setConfirmDeleteId(null);
      setMessage("Wardrobe item deleted successfully.");
    } catch (error) {
      console.error("Error deleting wardrobe item:", error);
      setMessage("Unable to delete item. Please try again.");
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
          item.category.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = a.createdAt || 0;
        const dateB = b.createdAt || 0;

        return sortOrder === "newest"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [images, activeFilter, searchTerm, sortOrder]);

  return (
    <main className="aura-shell min-h-screen text-white">
      <Sidebar />

      <div className="aura-main min-h-screen px-5 py-9 sm:px-8 xl:px-12 lg:ml-[372px]">
        <div className="mb-10">
          <p className="aura-eyebrow mb-3">
            <Sparkles size={14} /> YOUR DIGITAL CLOSET
          </p>

          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                Your <span className="aura-gradient-text">Wardrobe</span>
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                Build your personal fashion collection. AURA uses these
                pieces to create outfit combinations.
              </p>
            </div>

            <Link href="/dashboard" className="aura-outline-btn">
              Back to dashboard
            </Link>
          </div>
        </div>

        <section className="aura-panel rounded-[30px] p-5 sm:p-8">
          <h2 className="text-xl font-bold mb-2">
            Choose a category
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Select what you are uploading before choosing your photos.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                disabled={uploading}
                className={`aura-pill ${
                  category === item ? "aura-pill-active" : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[25px] border border-dashed border-cyan-300/30 bg-cyan-300/[.035] px-5 py-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-cyan-200">
              <ImagePlus size={28} />
            </div>

            <h3 className="text-2xl font-bold">
              Add {category.toLowerCase()}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              JPG, PNG or WEBP · Maximum 10 MB per image · Images are
              resized automatically.
            </p>

            <label
              className={`aura-primary-btn mt-6 inline-flex cursor-pointer ${
                uploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {uploading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus size={18} />
                  Select images
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className="mt-5 text-sm text-cyan-200"
              >
                {message}
              </p>
            )}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="aura-eyebrow mb-2">COLLECTION</p>
              <h2 className="text-2xl font-bold">
                Your fashion pieces
              </h2>
            </div>

            <span className="text-sm text-slate-400">
              {images.length} items · {filteredImages.length} shown
            </span>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by filename or category..."
                aria-label="Search wardrobe"
                className="w-full rounded-2xl border border-white/10 bg-white/[.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
              />
            </div>

            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-slate-300">
              <ArrowUpDown size={16} className="text-cyan-300" />
              <span className="sr-only">Sort wardrobe</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
                aria-label="Sort wardrobe"
              >
                <option value="newest" className="bg-slate-900">
                  Newest first
                </option>
                <option value="oldest" className="bg-slate-900">
                  Oldest first
                </option>
              </select>
            </label>
          </div>

          <div className="mb-6 flex flex-wrap gap-2.5">
            {["All Items", ...categories].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveFilter(item)}
                className={`aura-pill ${
                  activeFilter === item ? "aura-pill-active" : ""
                }`}
              >
                {item}
                {item === "All Items"
                  ? ` (${images.length})`
                  : ` (${images.filter(
                      (image) => image.category === item
                    ).length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="aura-empty">
              Loading your collection...
            </div>
          ) : loadError ? (
            <div className="aura-empty text-center">
              <p className="text-rose-300">{loadError}</p>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filteredImages.map((item) => (
  <motion.article
    key={item.id}
    whileHover={{ y: -4 }}
    className="aura-piece-card overflow-hidden"
  >
    <Image
      src={item.image}
      alt={item.name || item.category}
      width={400}
      height={208}
      unoptimized
      className="h-52 w-full object-cover"
    />

    <div className="flex items-center justify-between gap-2 p-4">
      <div className="min-w-0">
        <p className="font-semibold">{item.category}</p>
        <p
          className="mt-1 truncate text-xs text-slate-500"
          title={item.name || "Older wardrobe item"}
        >
          {item.name || "In your wardrobe"}
        </p>
      </div>

      <Shirt size={18} className="shrink-0 text-cyan-300" />
    </div>

    <div className="flex gap-2 px-4 pb-4">
      <button
        type="button"
        onClick={() => handleEdit(item)}
        className="aura-outline-btn flex-1 justify-center"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() => setConfirmDeleteId(item.id)}
        className="flex-1 rounded-xl border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-400/10"
      >
        Delete
      </button>
    </div>

    {confirmDeleteId === item.id && (
      <div className="px-4 pb-4">
        <p className="mb-3 text-sm text-red-200">
          Are you sure you want to delete this item?
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            disabled={deletingId === item.id}
            className="flex-1 rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {deletingId === item.id ? "Deleting..." : "Confirm"}
          </button>

          <button
            type="button"
            onClick={() => setConfirmDeleteId(null)}
            disabled={deletingId === item.id}
            className="aura-outline-btn flex-1 justify-center"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </motion.article>
))}
            </div>
          ) : (
            <div className="aura-empty text-center">
              <Shirt
                size={30}
                className="mx-auto mb-3 text-slate-500"
              />

              <p className="font-semibold text-white">
                {images.length === 0
                  ? "Your collection is empty"
                  : searchTerm.trim()
                    ? "No matching items found"
                    : `No ${activeFilter.toLowerCase()} found`}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {images.length === 0
                  ? "Choose a category and upload your first fashion item."
                  : "Try another search or category filter."}
              </p>
            </div>
          )}
        </section>
      </div>
      {/* EDIT ITEM MODAL */}
{editingItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-wardrobe-title"
      className="aura-panel w-full max-w-md rounded-3xl p-6"
    >
      <h2 id="edit-wardrobe-title" className="mb-5 text-2xl font-bold">
        Edit Wardrobe Item
      </h2>

      <label className="mb-2 block text-sm text-slate-300">
        Item name
      </label>

      <input
        type="text"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        placeholder="Enter item name"
        className="mb-5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-cyan-400"
      />

      <label className="mb-2 block text-sm text-slate-300">
        Category
      </label>

      <select
        value={editCategory}
        onChange={(e) => setEditCategory(e.target.value)}
        className="mb-6 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400"
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
            </select>

      <div className="mb-6">
        <label className="mb-3 block text-sm text-slate-300">
          Fashion styles
        </label>

        <div className="grid grid-cols-2 gap-2">
          {styleOptions.map((style) => (
            <label
              key={style}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs transition ${
                editStyles.includes(style)
                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                  : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              <input
                type="checkbox"
                checked={editStyles.includes(style)}
                onChange={(event) => {
                  setEditStyles((previous) =>
                    event.target.checked
                      ? [...previous, style]
                      : previous.filter((item) => item !== style)
                  );
                }}
                className="accent-cyan-400"
              />

              {style}
            </label>
          ))}
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Select multiple styles that match this item.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSaveEdit}
          disabled={savingEdit}
          className="aura-primary-btn flex-1 justify-center disabled:opacity-50"
        >
          {savingEdit ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => setEditingItem(null)}
          disabled={savingEdit}
          className="aura-outline-btn flex-1 justify-center"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
