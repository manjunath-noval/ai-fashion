"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { auth } from "../../firebase/config";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();

  const { user } = useAuth();

const loginWithGoogle = async () => {

  try {

    const provider =
      new GoogleAuthProvider();

    const result =
      await signInWithPopup(
        auth,
        provider
      );

    if (result.user) {
      window.location.href =
        "/dashboard";
    }

  } catch (error) {

    console.error(error);

    alert("Login Failed");

  }

};

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-0 pointer-events-none ..."/>
<div className="absolute bottom-0 right-0 pointer-events-none ..."/>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-white/5 border border-white/10 rounded-[25px] md:rounded-[40px] p-12 backdrop-blur-2xl text-center max-w-xl w-full"
      >

        <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-300 mb-6">
          AI Fashion Authentication
        </div>

        <h1 className="text-5xl font-extrabold leading-tight">
          Welcome To
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}Aura AI
          </span>
        </h1>

        <p className="mt-6 text-gray-400 text-lg">
          Continue with Google to access your AI-powered fashion identity.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={loginWithGoogle}
          className="relative z-50 mt-10 bg-gradient-to-r from-purple-500 to-cyan-500 px-10 py-5 rounded-full text-lg font-semibold shadow-2xl"
        >
          Continue With Google
        </motion.button>

      </motion.div>

    </main>
  );
}