
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Shirt,
  Fingerprint,
  UserRound,
  Bookmark,
  History,
  WandSparkles,
  Layers3,
  Star,
  ScanFace,
  ChartNoAxesCombined,
  Newspaper,
  LogOut,
  Sparkles,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Wardrobe", path: "/wardrobe", icon: Shirt },
  { name: "AI Identity", path: "/identity", icon: Fingerprint },
  { name: "Onboarding", path: "/onboarding", icon: UserRound },
  { name: "Saved Outfits", path: "/saved", icon: Bookmark },
  { name: "History", path: "/history", icon: History },
  { name: "AI Stylist", path: "/stylist", icon: WandSparkles },
  { name: "Persona", path: "/persona", icon: UserRound },
  { name: "Outfit Builder", path: "/builder", icon: Layers3 },
  { name: "Outfit Rating", path: "/rating", icon: Star },
  { name: "AI Avatars", path: "/avatar", icon: ScanFace },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "Daily Feed", path: "/feed", icon: Newspaper },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <>
      <button
        aria-label="Open navigation"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[70] lg:hidden rounded-xl border border-white/10 bg-[#15151a] p-3 text-white shadow-xl"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`aura-sidebar fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-white/10 transition-transform duration-300 lg:w-[340px] ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="block border-b border-white/10 px-8 py-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-cyan-500/10">
              <Sparkles size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                AURA AI
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Fashion Intelligence
              </p>
            </div>
          </div>
        </Link>

        <div className="px-6 pt-7 pb-3 text-[10px] font-bold tracking-[.22em] text-slate-500">
          WORKSPACE
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 pb-5">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const active =
              pathname === path ||
              (path !== "/dashboard" && pathname.startsWith(path + "/"));

            return (
              <Link
                key={path}
                href={path}
                onClick={() => setMobileOpen(false)}
                className={`aura-nav-link ${
                  active ? "aura-nav-active" : ""
                }`}
              >
                <Icon size={19} />
                <span>{name}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-3">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={44}
                height={44}
                unoptimized
                className="h-11 w-11 rounded-full object-cover ring-2 ring-cyan-400/70"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-lg font-bold">
                {user?.displayName?.[0] || user?.email?.[0] || "A"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.displayName || "AURA Member"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || "Personal style profile"}
              </p>
            </div>

            <button
              aria-label="Log out"
              onClick={logout}
              title="Log out"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={18} />
            </button>
          </div>

          <p className="px-2 pt-3 text-center text-[10px] tracking-wider text-slate-600">
            AURA AI · PERSONAL STYLE STUDIO
          </p>
        </div>
      </aside>
    </>
  );
}
