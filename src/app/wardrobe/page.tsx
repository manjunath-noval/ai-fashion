"use client";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import {
  db,
  auth,
} from "@/firebase/config";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

type FashionItem = {
  image: string;
  category: string;
};

export default function WardrobePage() {

  const [images, setImages] = useState<FashionItem[]>([]);

  const [category, setCategory] = useState("Shirts");
useEffect(() => {

  const fetchWardrobe =
    async () => {

      const snapshot =
        await getDocs(
          collection(
            db,
            "wardrobe"
          )
        );

      const items =
        snapshot.docs
          .map((doc) => doc.data())
          .filter(
            (item) =>
              item.userId ===
              auth.currentUser?.uid
          );

      setImages(items as FashionItem[]);

    };

  fetchWardrobe();

}, []);

const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = event.target.files;

    if (!files) return;

   const newItems:any= await Promise.all(

  Array.from(files).map(

    (file) =>

      new Promise((resolve) => {

        const reader = new FileReader();

        reader.onload = () => {

          resolve({
            image: reader.result,
            category,
          });

        };

        reader.readAsDataURL(file);

      })

  )

);

for (const item of newItems) {

  await addDoc(

    collection(db, "wardrobe"),

    {

      userId:
        auth.currentUser?.uid,

      image:
        item.image,

      category:
        item.category,

      createdAt:
        Date.now(),

    }

  );

}

setImages((prev) => {

  const updated = [...prev, ...newItems];

  return updated;
});
 for (const item of newItems) {

  await addDoc(
    collection(db, "wardrobe"),
    {
      image: item.image,
      category: item.category,
      createdAt: Date.now(),
    }
  );

}
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">

      <Sidebar />

      {/* Background Glow */}
      <div className="absolute top-0 left-0 pointer-events-none ..."/>
<div className="absolute bottom-0 right-0 pointer-events-none ..."/>

      <div className="relative z-10 lg:ml-[280px] px-8 py-10 max-w-7xl">

        {/* Header */}
        <div className="mb-12">

          <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300 mb-5">
            AI Smart Wardrobe
          </div>

          <h1 className="text-5xl font-extrabold">
            Build Your
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Fashion Collection
            </span>
          </h1>

          <p className="mt-5 text-gray-400 max-w-2xl text-lg leading-relaxed">
            Upload categorized fashion items to create your intelligent AI wardrobe.
          </p>

        </div>

        {/* Upload Box */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="border-2 border-dashed border-white/10 rounded-[25px] md:rounded-[40px] p-14 bg-white/5 backdrop-blur-xl"
        >

          {/* Category Selection */}
          <div className="mb-8">

            <h2 className="text-xl font-bold mb-4">
              Select Category
            </h2>

            <div className="flex flex-wrap gap-4">

              { [
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
].map((item) => (

                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`
                    px-6 py-3 rounded-full border transition
                    ${
                      category === item
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 border-transparent"
                        : "bg-white/5 border-white/10 hover:border-cyan-400"
                    }
                  `}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

          {/* Upload Area */}
          <div className="text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-4xl mb-8">
              +
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Upload {category}
            </h2>

            <p className="text-gray-400 mb-8">
              AI will organize and analyze your fashion collection.
            </p>

            <label className="cursor-pointer">

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />

              <div className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition">
                Select Images
              </div>

            </label>

          </div>

        </motion.div>

        {/* Wardrobe Grid */}
        {images.length > 0 && (

          <div className="mt-16">

            <h2 className="text-3xl font-bold mb-8">
              Your Fashion Collection
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {images.map((item, index) => (

                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="relative rounded-[30px] overflow-hidden border border-white/10 bg-white/5"
                >

                  <img
                    src={item.image}
                    alt="fashion"
                    className="w-full h-[320px] object-cover"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-4">

                    <p className="text-sm text-gray-400">
                      Category
                    </p>

                    <h3 className="text-lg font-bold">
                      {item.category}
                    </h3>

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        )}

      </div>

    </main>
  );
}