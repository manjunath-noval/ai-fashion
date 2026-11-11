
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (loading) return;

    if (!user && !isLoginPage) {
      router.replace("/login");
      return;
    }

    if (user && isLoginPage) {
      router.replace("/dashboard");
    }
  }, [user, loading, isLoginPage, router]);

  if (loading || (!user && !isLoginPage) || (user && isLoginPage)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08070D] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
          <p className="text-sm text-zinc-400">Verifying your session...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
