
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ImagePlus,
  LoaderCircle,
  Palette,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const styles = [
  {
    name: "Anime",
    description: "Expressive and artistic",
    icon: "✦",
  },
  {
    name: "Luxury",
    description: "Refined and sophisticated",
    icon: "◇",
  },
  {
    name: "Streetwear",
    description: "Urban and contemporary",
    icon: "✧",
  },
  {
    name: "Cyberpunk",
    description: "Bold futuristic energy",
    icon: "⌁",
  },
  {
    name: "Korean Fashion",
    description: "Clean and effortless",
    icon: "♡",
  },
  {
    name: "Old Money",
    description: "Timeless elegance",
    icon: "♜",
  },
  {
    name: "Futuristic AI",
    description: "Next-generation identity",
    icon: "◎",
  },
];

export default function PersonaPage() {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [personaText, setPersonaText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setGenerated(false);
    setPersonaText("");
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setGenerated(false);
    setPersonaText("");
  };

  const generatePersona = async () => {
    if (!image || !selectedStyle) {
      alert("Upload an image and choose a style first.");
      return;
    }

    setIsGenerating(true);
    setGenerated(false);
    setPersonaText("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Create a stylish AI fashion persona description for a ${selectedStyle} aesthetic. Make it cinematic, premium, futuristic, and emotionally powerful.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API request failed: ${response.status}`);
      }

      const data = await response.json();

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI could not generate persona.";

      setPersonaText(text);
      setGenerated(true);
    } catch (error) {
      console.error(error);
      setPersonaText("AI persona generation failed. Please try again.");
      setGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#08070d] text-white">
      {/* Background lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute -bottom-48 left-[20%] h-[450px] w-[450px] rounded-full bg-fuchsia-700/[0.07] blur-[140px]" />
      </div>

      <Sidebar />

      <div className="relative min-h-screen lg:ml-[232px]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-9"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
              AURA intelligence
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px]">
              Fashion persona
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Transform your fashion aesthetic into a distinctive digital identity.
            </p>
          </motion.div>

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-6 overflow-hidden rounded-[26px] border border-violet-400/15 bg-gradient-to-br from-[#211638] via-[#151020] to-[#100d17] p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-violet-300/10" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-200">
                  <WandSparkles size={17} />
                  Your identity, reimagined
                </div>

                <h2 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
                  Create a fashion identity that feels uniquely yours.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300/70">
                  Choose your aesthetic, upload your profile image, and generate your persona description with AI.
                </p>
              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-200">
                <Sparkles size={35} />
              </div>
            </div>
          </motion.section>

          {/* Main workspace */}
          <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">

            {/* Upload section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[24px] border border-white/[0.075] bg-[#121019]/90 p-5 sm:p-7"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <ImagePlus size={19} />
                </div>

                <div>
                  <h2 className="font-semibold">Profile image</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Upload an image to begin
                  </p>
                </div>
              </div>

              {image ? (
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <Image
                    src={image}
                    alt="Persona preview"
                    width={600}
                    height={500}
                    unoptimized
                    className="h-[320px] w-full object-contain sm:h-[380px]"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-red-500/80"
                    aria-label="Remove uploaded image"
                  >
                    <X size={17} />
                  </button>

                  <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs text-zinc-200">
                    Image uploaded
                  </div>
                </div>
              ) : (
                <label className="group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-violet-400/25 bg-violet-500/[0.035] px-5 text-center transition hover:border-violet-300/50 hover:bg-violet-500/[0.07] sm:min-h-[380px]">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/10 text-violet-300 transition group-hover:scale-105">
                    <ImagePlus size={28} />
                  </div>

                  <p className="text-base font-semibold text-zinc-200">
                    Drop your image here
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    Or click to browse your device
                  </p>

                  <span className="mt-5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-violet-200">
                    Choose image
                  </span>

                  <span className="mt-4 text-[11px] text-zinc-600">
                    JPG, PNG, WEBP and other supported image formats
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              )}

              {image && (
                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-zinc-300 transition hover:border-violet-400/30 hover:text-white">
                  <ImagePlus size={16} />
                  Change image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              )}

              <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-zinc-500">
                <Sparkles size={14} className="mt-0.5 shrink-0 text-violet-400" />
                Choose a clear profile image for your persona preview.
              </div>
            </motion.section>

            {/* Style selection */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="rounded-[24px] border border-white/[0.075] bg-[#121019]/90 p-5 sm:p-7"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-300">
                  <Palette size={19} />
                </div>

                <div>
                  <h2 className="font-semibold">Choose your aesthetic</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Select your fashion identity
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {styles.map((style, index) => {
                  const isSelected = selectedStyle === style.name;

                  return (
                    <motion.button
                      key={style.name}
                      type="button"
                      whileTap={{ scale: 0.985 }}
                      onClick={() => {
                        setSelectedStyle(style.name);
                        setGenerated(false);
                        setPersonaText("");
                      }}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-violet-400/40 bg-violet-500/[0.12]"
                          : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.045]"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                          isSelected
                            ? "bg-violet-400/15 text-violet-200"
                            : "bg-white/[0.045] text-zinc-400"
                        }`}
                      >
                        {style.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-100">
                          {style.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {style.description}
                        </p>
                      </div>

                      {isSelected ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-400 text-black">
                          <Check size={14} />
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600">
                          0{index + 1}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-7 border-t border-white/[0.07] pt-6">
                <div className="mb-4 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Generation readiness</span>
                  <span className="text-violet-300">
                    {image && selectedStyle ? "Ready" : "Incomplete"}
                  </span>
                </div>

                <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    animate={{
                      width: image && selectedStyle ? "100%" : image || selectedStyle ? "50%" : "0%",
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={generatePersona}
                  disabled={isGenerating}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(124,58,237,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Generating your persona...
                    </>
                  ) : (
                    <>
                      <WandSparkles size={18} />
                      Generate my persona
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[11px] text-zinc-600">
                  Powered by your configured Gemini API integration
                </p>
              </div>
            </motion.section>
          </div>

          {/* Generated result */}
          {isGenerating && (
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-violet-400/15 bg-violet-500/[0.06] p-5">
              <LoaderCircle size={22} className="animate-spin text-violet-300" />
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Creating your fashion identity
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Your AI persona is being prepared...
                </p>
              </div>
            </div>
          )}

          {generated && image && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-7 overflow-hidden rounded-[26px] border border-violet-400/15 bg-gradient-to-br from-[#1b1428] via-[#121019] to-[#100d17] p-5 sm:p-8"
            >
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                    AURA creation
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Your generated persona
                  </h2>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-start">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <Image
                    src={image}
                    alt="Your generated fashion persona"
                    width={600}
                    height={700}
                    unoptimized
                    className="h-[360px] w-full object-cover"
                  />
                </div>

                <div className="py-1">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-3 py-1.5 text-xs text-violet-200">
                    <Sparkles size={13} />
                    AI generated identity
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {selectedStyle}
                    <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                      {" "}Aura
                    </span>
                  </h2>

                  <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/20 p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Your persona description
                    </p>

                    <p className="whitespace-pre-line text-sm leading-7 text-zinc-300 sm:text-base">
                      {personaText}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Elite Style", "Viral Aesthetic", "Fashion Identity"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-zinc-300"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          <div className="mt-8 flex items-center gap-2 border-t border-white/[0.06] pt-5 text-xs text-zinc-600">
            <Zap size={13} className="text-violet-400" />
            Your style. Your identity. Your AURA.
          </div>
        </div>
      </div>
    </main>
  );
}
