"use client";

import Link from "next/link";

import { useState } from "react";

import { Menu } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { signOut } from "firebase/auth";

import { auth } from "../../firebase/config";

import { useRouter } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Wardrobe",
    path: "/wardrobe",
  },
  {
    name: "AI Identity",
    path: "/identity",
  },
  {
    name: "Onboarding",
    path: "/onboarding",
  },
  {
    name: "Saved Outfits",
    path: "/saved",
  },
  {
    name: "History",
    path: "/history",
  },
  {
    name: "AI Stylist",
    path: "/stylist",
  },
  {
    name: "Persona",
    path: "/persona",
  },
  {
  name: "Outfit Builder",
  path: "/builder",
},
  {
   name: "Outfit Rating",
   path: "/rating",
  },
  {
  name: "AI Avatars",
  path: "/avatar",
},
{
  name: "Analytics",
  path: "/analytics",
},
  {
  name: "Daily Feed",
  path: "/feed",
},
];

export default function Sidebar() {

  const { user } = useAuth();

  const router = useRouter();

  const [showProfile, setShowProfile] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const logout = async () => {

    await signOut(auth);

    router.push("/sign-in");
  };

  return (

    <>

      {/* Mobile Menu Button */}
      <button
        onClick={() =>
          setMobileOpen(!mobileOpen)
        }
        className="fixed top-5 left-5 z-[100] lg:hidden bg-white/10 border border-white/10 p-3 rounded-full backdrop-blur-xl"
      >
        <Menu />
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-screen w-[220px] md:w-[260px]
          bg-white/5 border-r border-white/10
          backdrop-blur-2xl z-50 flex flex-col
          transition-transform duration-300

          ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"}

          lg:translate-x-0
        `}
      >

        {/* Logo */}
        <div className="px-8 py-8 border-b border-white/10">

          <h1 className="text-3xl font-extrabold text-white">
            AURA AI
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Fashion Intelligence
          </p>

        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 p-6 overflow-y-auto flex-1">

          {menuItems.map((item, index) => (

            <Link
              key={index}
              href={item.path}
              className="group relative px-5 py-4 rounded-2xl bg-white/5 border border-transparent hover:border-cyan-400 hover:bg-white/10 transition duration-300"
            >

              <span className="text-gray-300 group-hover:text-white text-lg font-medium">
                {item.name}
              </span>

            </Link>

          ))}

        </nav>

        {/* Floating Profile */}
        <div className="absolute bottom-6 left-6">

          {user && (

            <div>

              {/* Avatar Button */}
              <button
                onClick={() =>
                  setShowProfile(!showProfile)
                }
                className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,255,255,0.4)]"
              >

                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                )}

              </button>

              {/* Expandable Panel */}
              {showProfile && (

                <div className="absolute bottom-20 left-0 w-[280px] rounded-[30px] bg-black/80 backdrop-blur-2xl border border-white/10 p-6 shadow-[0_0_60px_rgba(0,255,255,0.12)]">

                  <div className="flex items-center gap-4">

                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="w-16 h-16 rounded-full border-2 border-cyan-400"
                      />
                    )}

                    <div>

                      <h2 className="text-xl font-bold">
                        {user.displayName}
                      </h2>

                      <p className="text-sm text-gray-400">
                        {user.email}
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 px-4 py-2 rounded-full bg-white/10 text-sm inline-block">
                    Elite Fashion Aura
                  </div>

                  <button
                    onClick={logout}
                    className="mt-6 w-full py-3 rounded-full bg-red-500/20 border border-red-500/20 hover:bg-red-500/30 transition"
                  >
                    Logout
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </aside>

    </>

  );
}