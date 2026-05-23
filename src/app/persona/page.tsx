"use client";

import { useState } from "react";

import Sidebar from "../components/Sidebar";

import { motion } from "framer-motion";

const styles = [
  "Anime",
  "Luxury",
  "Streetwear",
  "Cyberpunk",
  "Korean Fashion",
  "Old Money",
  "Futuristic AI",
];

export default function PersonaPage() {

  const [selectedStyle, setSelectedStyle] =
    useState("");

  const [image, setImage] =
    useState<string | null>(null);

  const [generated, setGenerated] =
    useState(false);

const [personaText, setPersonaText] =
  useState("");

  const handleUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(file);

    setImage(imageUrl);
  };

const generatePersona = async () => {

  if (!image || !selectedStyle) {

    alert(
      "Upload image and choose style first."
    );

    return;
  }

  setGenerated(true);

  try {

    const response =
      await fetch(

        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      `Create a stylish AI fashion persona description for a ${selectedStyle} aesthetic. Make it cinematic, premium, futuristic, and emotionally powerful.`,
                  },
                ],
              },
            ],
          }),
        }

      );

    const data =
      await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI could not generate persona.";

    setPersonaText(text);

  } catch (error) {

    console.error(error);

    setPersonaText(
      "AI persona generation failed."
    );

  }

};

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">

      <Sidebar />

      {/* Glow */}
      <div className="absolute top-0 left-0 pointer-events-none ..."/>
<div className="absolute bottom-0 right-0 pointer-events-none ..."/>

      <div className="relative z-10 lg:ml-[280px] px-8 py-10 max-w-7xl">

        {/* Header */}
        <div className="mb-12">

          <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300 mb-5">
            AI Fashion Persona
          </div>

          <h1 className="text-5xl font-extrabold">
            Generate Your
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Fashion Identity
            </span>
          </h1>

        </div>

        {/* Upload */}
        <div className="bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-8 backdrop-blur-xl">

          <h2 className="text-2xl font-bold mb-6">
            Upload Your Profile Image
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mb-8"
          />

          {/* Style Selection */}
          <h2 className="text-2xl font-bold mb-5">
            Choose Aesthetic
          </h2>

          <div className="flex flex-wrap gap-4">

            {styles.map((style) => (

              <button
                key={style}
                onClick={() =>
                  setSelectedStyle(style)
                }
                className={`
                  px-6 py-3 rounded-full border transition
                  ${
                    selectedStyle === style
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 border-transparent"
                      : "bg-white/5 border-white/10 hover:border-cyan-400"
                  }
                `}
              >
                {style}
              </button>

            ))}

          </div>

          {/* Generate Button */}
          <button
            onClick={generatePersona}
            className="mt-10 bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full text-lg font-semibold"
          >
            Generate Persona
          </button>

        </div>

        {/* Persona Result */}
        {generated && image && (

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-8 backdrop-blur-xl"
          >

            <div className="flex flex-col lg:flex-row gap-5 md:p-10 items-center">

              {/* Image */}
              <img
                src={image}
                alt="persona"
                className="w-[320px] h-[420px] object-cover rounded-[25px] md:rounded-[40px] border border-white/10"
              />

              {/* Details */}
              <div>

                <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-sm text-cyan-300 mb-6">
                  AI Generated Persona
                </div>

                <h2 className="text-5xl font-extrabold">
                  {selectedStyle}
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {" "}Aura
                  </span>
                </h2>

                <p className="mt-6 text-gray-400 text-lg max-w-xl leading-relaxed whitespace-pre-line">
                  {personaText}
                  Your AI fashion identity reflects premium aesthetics,
                  futuristic styling energy, and visually balanced fashion confidence.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">

                  <div className="px-5 py-2 rounded-full bg-white/10">
                    Elite Style
                  </div>

                  <div className="px-5 py-2 rounded-full bg-white/10">
                    Viral Aesthetic
                  </div>

                  <div className="px-5 py-2 rounded-full bg-white/10">
                    Fashion Identity
                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        )}

      </div>

    </main>
  );
}