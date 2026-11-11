
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/config";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loginWithGoogle = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Unable to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070D] px-5 py-10 text-white">

      {/* Background lighting */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-600/[0.15] blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-600/[0.12] blur-[130px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#08070D_75%)]" />

      {/* Login container */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[470px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#111019]/90 p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl md:p-10"
      >
        {/* Top accent */}
        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

        {/* Logo */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-purple-600 to-violet-400 text-3xl font-black shadow-lg shadow-purple-900/30">
            A
          </div>

          <h2 className="text-xl font-black tracking-[0.28em]">
            AURA
          </h2>

          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
            AI Fashion Studio
          </p>
        </div>

        {/* Heading */}
        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-300">
              Your style journey starts here
            </span>
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Welcome to
            <span className="block bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              AURA AI.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-zinc-400">
            Your personal AI fashion studio. Sign in to explore your
            wardrobe, discover new aesthetics, and define your identity.
          </p>
        </div>

        {/* Login button */}
        <div className="mt-9">
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={loginWithGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-4 text-sm font-bold shadow-lg shadow-purple-950/30 transition duration-300 hover:shadow-purple-900/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing you in...
              </>
            ) : (
              <>
                {/* Google logo */}
                <svg
                  viewBox="0 0 48 48"
                  className="h-5 w-5 rounded-full bg-white p-0.5"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.27 5.64c4.25-3.93 6.7-9.72 6.7-17.29Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.27-5.64c-2.02 1.35-4.6 2.14-8.63 2.14-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>

                Continue with Google
              </>
            )}
          </motion.button>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mt-4 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-center text-xs text-red-300"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-600">
            Secure authentication
          </span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-sm text-purple-300">✦</span>
          <p className="text-xs leading-5 text-zinc-500">
            Your account is protected by Firebase Authentication.
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="absolute bottom-5 left-0 right-0 text-center text-[10px] tracking-wider text-zinc-700">
        AURA AI · DEFINE YOUR STYLE. OWN YOUR IDENTITY.
      </p>
    </main>
  );
}
