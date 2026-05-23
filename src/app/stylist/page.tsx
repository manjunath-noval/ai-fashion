"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function StylistPage() {

  const [input, setInput] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([

  
      {
        sender: "ai",
        text: "Hello. I’m your AI Fashion Stylist. Ask me anything about outfits, styling, occasions, or fashion moods.",
      },
    ]);

const [loading, setLoading] =
  useState(false);

  const [wardrobe, setWardrobe] =
  useState<any[]>([]);

  useEffect(() => {

  const storedWardrobe =
    localStorage.getItem("wardrobe");

  if (storedWardrobe) {

    setWardrobe(
      JSON.parse(storedWardrobe)
    );

  }

}, []);

const sendMessage = async () => {

  if (!input.trim()) return;

  const userMessage: Message = {
    sender: "user",
    text: input,
  };

  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  const currentInput = input;

  const conversationContext =
  messages
    .map(
      (msg) =>
        `${msg.sender}: ${msg.text}`
    )
    .join("\n");

const wardrobeContext =
  wardrobe
    .map(
      (item) =>
        `${item.category}`
    )
    .join(", ");

  setInput("");
  setLoading(true);

  setLoading(true);
  try {
const genAI =
  new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY!
  );

const model =
  genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

const result =
  await model.generateContent(
`
You are a luxury AI fashion stylist.

User wardrobe:
${wardrobeContext}

Previous conversation:
${conversationContext}

Current request:
${currentInput}

Give stylish, premium, personalized fashion advice.
`
  );

const response =
  await result.response;

const aiText =
  response.text();

const aiMessage: Message = {
  sender: "ai",
  text: aiText,
};

setMessages((prev) => [
  ...prev,
  aiMessage,
]);

setLoading(false);

}
  catch (error) {

    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "Something went wrong with AI response.",
      },
    ]);
    setLoading(false);

  }

};

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">

      <Sidebar />

      {/* Glow */}
      <div className="absolute top-0 left-0 pointer-events-none ..."/>
<div className="absolute bottom-0 right-0 pointer-events-none ..."/>

      <div className="relative z-10 lg:ml-[280px] px-8 py-10 max-w-5xl">

        {/* Header */}
        <div className="mb-10">

          <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300 mb-5">
            AI Fashion Stylist
          </div>

          <h1 className="text-5xl font-extrabold">
            Conversational
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}AI Styling
            </span>
          </h1>

        </div>

        {/* Chat Box */}
        <div className="bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-6 backdrop-blur-xl h-[600px] flex flex-col">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">

            {messages.map((message, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[80%] rounded-3xl p-5 ${
                  message.sender === "user"
                    ? "ml-auto bg-gradient-to-r from-purple-500 to-cyan-500"
                    : "bg-white/10 border border-white/10"
                }`}
              >

                {message.text}

              </motion.div>

            ))}


            {loading && (

  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-[220px] rounded-3xl p-5 bg-white/10 border border-white/10"
  >

    <div className="flex items-center gap-2">

      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />

      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-100" />

      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-200" />

      <span className="ml-3 text-sm text-gray-300">
        AI is thinking...
      </span>

    </div>

  </motion.div>

)}

          </div>

          {/* Input */}
          <div className="mt-6 flex gap-4">

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask your AI stylist..."
              className="flex-1 bg-white/10 border border-white/10 rounded-full px-6 py-4 outline-none"
            />

            <button
  disabled={loading}
  onClick={sendMessage}
className="bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 rounded-full disabled:opacity-50"            >
              Send
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}