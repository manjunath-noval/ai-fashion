"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { motion } from "framer-motion";
import { ImagePlus, Shirt, Trash2, Sparkles, LoaderCircle } from "lucide-react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

type FashionItem = { id: string; image: string; category: string };

const categories = ["Shirts","Pants","Shoes","Jackets","Hoodies","Watches","Chains","Caps","Perfumes","Bags"];

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("This file is not a valid image."));
      image.onload = () => {
        const maxSide = 900;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("Image processing is not supported."));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
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
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      const user = auth.currentUser;
      if (!user) { setImages([]); setLoading(false); return; }
      try {
        const itemsQuery = query(collection(db, "wardrobe"), where("userId", "==", user.uid));
        const snapshot = await getDocs(itemsQuery);
        setImages(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<FashionItem, "id">) })));
      } catch (error) {
        console.error(error);
        setMessage("Could not load your wardrobe. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selectedFiles.length) return;
    const user = auth.currentUser;
    if (!user) { setMessage("Please sign in again before uploading."); return; }

    setUploading(true);
    setMessage("");
    try {
      for (const file of selectedFiles) {
        if (!file.type.startsWith("image/")) continue;
        const image = await compressImage(file);
        const docRef = await addDoc(collection(db, "wardrobe"), {
          userId: user.uid,
          image,
          category,
          createdAt: Date.now(),
        });
        setImages((previous) => [...previous, { id: docRef.id, image, category }]);
      }
      setMessage(`${selectedFiles.length} image${selectedFiles.length === 1 ? "" : "s"} added to ${category}.`);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please try a smaller image or check your connection.");
    } finally {
      setUploading(false);
    }
  };

  const groupedCount = images.filter((item) => item.category === category).length;

  return (
    <main className="aura-shell min-h-screen text-white">
      <Sidebar/>
      <div className="aura-main min-h-screen px-5 py-9 sm:px-8 xl:px-12 lg:ml-[372px]">
        <div className="mb-10">
          <p className="aura-eyebrow mb-3"><Sparkles size={14}/> YOUR DIGITAL CLOSET</p>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Your <span className="aura-gradient-text">Wardrobe</span></h1>
              <p className="mt-3 max-w-2xl text-slate-400">Build your personal fashion collection. AURA uses these pieces to create outfit combinations.</p>
            </div>
            <Link href="/dashboard" className="aura-outline-btn">Back to dashboard</Link>
          </div>
        </div>

        <section className="aura-panel rounded-[30px] p-5 sm:p-8">
          <h2 className="text-xl font-bold mb-2">Choose a category</h2>
          <p className="text-sm text-slate-500 mb-5">Select what you are uploading before choosing your photos.</p>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={`aura-pill ${category === item ? "aura-pill-active" : ""}`}>{item}</button>
            ))}
          </div>
          <div className="mt-8 rounded-[25px] border border-dashed border-cyan-300/30 bg-cyan-300/[.035] px-5 py-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-cyan-200"><ImagePlus size={28}/></div>
            <h3 className="text-2xl font-bold">Add {category.toLowerCase()}</h3>
            <p className="mt-2 text-sm text-slate-400">JPG, PNG or WEBP · Images are resized automatically for storage.</p>
            <label className={`aura-primary-btn mt-6 inline-flex cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}>
              {uploading ? <><LoaderCircle size={18} className="animate-spin"/> Uploading...</> : <><ImagePlus size={18}/> Select images</>}
              <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={handleUpload}/>
            </label>
            {message && <p className="mt-5 text-sm text-cyan-200">{message}</p>}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="aura-eyebrow mb-2">COLLECTION</p><h2 className="text-2xl font-bold">Your fashion pieces</h2></div>
            <span className="text-sm text-slate-400">{images.length} items · {groupedCount} {category.toLowerCase()}</span>
          </div>
          {loading ? <div className="aura-empty">Loading your collection...</div> :
            images.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {images.map((item) => (
                  <motion.article key={item.id} whileHover={{ y: -4 }} className="aura-piece-card overflow-hidden">
                    <img src={item.image} alt={item.category} className="h-52 w-full object-cover"/>
                    <div className="flex items-center justify-between p-4">
                      <div><p className="font-semibold">{item.category}</p><p className="mt-1 text-xs text-slate-500">In your wardrobe</p></div>
                      <Shirt size={18} className="text-cyan-300"/>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="aura-empty text-center">
                <Shirt size={30} className="mx-auto mb-3 text-slate-500"/>
                <p className="font-semibold text-white">Your collection is empty</p>
                <p className="mt-1 text-sm text-slate-400">Choose a category and upload your first fashion item.</p>
              </div>
            )}
        </section>
      </div>
    </main>
  );
}
