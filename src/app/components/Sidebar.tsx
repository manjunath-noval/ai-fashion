
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
  Bookmark,
  History,
  WandSparkles,
  UserRound,
  Fingerprint,
  ChartNoAxesCombined,
  Newspaper,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Wardrobe", path: "/wardrobe", icon: Shirt },
  { name: "Outfit Builder", path: "/builder", icon: WandSparkles },
  { name: "AI Stylist", path: "/stylist", icon: UserRound },
  { name: "Saved Outfits", path: "/saved", icon: Bookmark },
  { name: "History", path: "/history", icon: History },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "Persona", path: "/persona", icon: UserRound },
  { name: "AI Identity", path: "/identity", icon: Fingerprint },
  { name: "Feed", path: "/feed", icon: Newspaper },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
  console.log("LOGOUT CLICK DETECTED");

  if (loggingOut) return;

  setLoggingOut(true);

  try {
    await logout();
    console.log("FIREBASE LOGOUT SUCCESS");

    setMobileOpen(false);
    window.location.replace("/login");
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    alert("Unable to log out. Please try again.");
    setLoggingOut(false);
  }
};

  return (
    <>
      <button
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-[70] rounded-xl border border-white/10 bg-[#111014] p-3 text-white shadow-xl lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.08] bg-[#0b0a0e] transition-transform duration-300 lg:w-[232px] ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(ellipse at bottom left, rgba(132,55,190,0.28), transparent 55%)",
        }}
      >
        {/* BRAND */}
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex h-[88px] shrink-0 items-center gap-3 border-b border-white/[0.08] px-6"
        >
          <span className="bg-gradient-to-br from-[#e0b5ff] via-[#b36aff] to-[#7735cf] bg-clip-text text-[43px] font-black leading-none text-transparent">
            A
          </span>

          <span>
            <span className="block text-[21px] font-black leading-none tracking-tight text-white">
              AURA AI
            </span>
            <span className="mt-1 block text-[10px] tracking-wide text-white/55">
              Fashion Intelligence 2.0
            </span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <div className="px-6 pb-2 pt-8 text-[10px] font-bold tracking-[0.25em] text-white/35">
          WORKSPACE
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-5">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const active =
              pathname === path ||
              (path !== "/dashboard" &&
                pathname.startsWith(path + "/"));

            return (
              <Link
                key={path}
                href={path}
                onClick={() => setMobileOpen(false)}
                className={`relative flex min-h-[42px] items-center gap-3 rounded-xl border px-3 text-[12px] font-semibold transition-all duration-200 ${
                  active
                    ? "border-purple-400/20 bg-gradient-to-r from-[#8738b5] via-[#49305e] to-[#211e29] text-white shadow-[0_5px_22px_rgba(146,65,206,0.2)]"
                    : "border-transparent text-[#b9b6c1] hover:bg-white/[0.055] hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-[#d28aff]" />
                )}

                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className={active ? "text-white" : "text-white/65"}
                />

                <span>{name}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d58aff]" />
                )}
              </Link>
            );
          })}

          {/* SETTINGS */}
          <div className="my-4 border-t border-white/[0.09]" />

          <div className="flex min-h-[42px] items-center gap-3 rounded-xl px-3 text-[12px] font-semibold text-[#b9b6c1]">
            <Settings
              size={18}
              strokeWidth={1.8}
              className="text-white/65"
            />
            <span>Settings</span>
          </div>
        </nav>

        {/* USER PROFILE */}
        <div className="shrink-0 border-t border-white/[0.08] p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-purple-400/10 bg-white/[0.035] p-2.5">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 shrink-0 rounded-full border border-purple-400/70 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-base font-bold text-white">
                {user?.displayName?.[0] || user?.email?.[0] || "A"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {user?.displayName || "AURA Member"}
              </p>
              <p className="mt-0.5 text-[10px] text-white/45">
                Style Explorer
              </p>
            </div>

           <button
  type="button"
  aria-label="Log out"
  onClick={handleLogout}
  disabled={loggingOut}
  title={loggingOut ? "Logging out..." : "Log out"}
  className="relative z-20 pointer-events-auto cursor-pointer rounded-lg p-2 text-white/70 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
>
  {loggingOut ? (
    <span className="block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
  ) : (
    <LogOut size={18} />
  )}
</button>
          </div>
        </div>
      </aside>
    </>
  );
}
