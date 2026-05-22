"use client";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function AnalyticsPage() {

  const analytics = {

    luxuryScore: "94%",

    dominantStyle:
      "Luxury Minimalist",

    favoriteColors:
      ["Black", "White", "Silver"],

    wardrobeBalance:
      "Excellent",

    accessoryUsage:
      "Moderate",

    fashionAura:
      "Calm Elite Energy",

  };

  return (

    <main className="min-h-screen bg-black text-white flex overflow-x-hidden">

      <Sidebar />

      <div className="flex-1 md:ml-[260px] p-5 md:p-10">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >

          <h1 className="text-3xl md:text-6xl font-black mb-4">

            Fashion Analytics

          </h1>

          <p className="text-gray-400 text-lg mb-12">

            AI-powered insights into your wardrobe identity.

          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-[35px] bg-white/5 border border-white/10 p-8"
            >

              <h2 className="text-gray-400 mb-4">

                Luxury Score

              </h2>

              <p className="text-5xl font-black text-cyan-400">

                {analytics.luxuryScore}

              </p>

            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-[35px] bg-white/5 border border-white/10 p-8"
            >

              <h2 className="text-gray-400 mb-4">

                Dominant Style

              </h2>

              <p className="text-3xl font-bold">

                {analytics.dominantStyle}

              </p>

            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-[35px] bg-white/5 border border-white/10 p-8"
            >

              <h2 className="text-gray-400 mb-4">

                Wardrobe Balance

              </h2>

              <p className="text-3xl font-bold">

                {analytics.wardrobeBalance}

              </p>

            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-[35px] bg-white/5 border border-white/10 p-8"
            >

              <h2 className="text-gray-400 mb-4">

                Favorite Colors

              </h2>

              <div className="flex gap-3 flex-wrap">

                {analytics.favoriteColors.map(
                  (color) => (

                    <div
                      key={color}
                      className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/20"
                    >

                      {color}

                    </div>

                  )
                )}

              </div>

            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-[35px] bg-white/5 border border-white/10 p-8"
            >

              <h2 className="text-gray-400 mb-4">

                Accessory Usage

              </h2>

              <p className="text-3xl font-bold">

                {analytics.accessoryUsage}

              </p>

            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-[35px] bg-white/5 border border-white/10 p-8"
            >

              <h2 className="text-gray-400 mb-4">

                Fashion Aura

              </h2>

              <p className="text-3xl font-bold text-cyan-300">

                {analytics.fashionAura}

              </p>

            </motion.div>

          </div>

        </motion.div>

      </div>

    </main>

  );

}