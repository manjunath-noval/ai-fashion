
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import RouteGuard from "./components/RouteGuard";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AURA AI | Fashion Intelligence",
    template: "%s | AURA AI",
  },
  description:
    "AURA AI is your personal fashion intelligence studio. Organize your wardrobe, discover outfits, and explore your style identity.",
  applicationName: "AURA AI",
  keywords: [
    "AURA AI",
    "AI Fashion",
    "Wardrobe Management",
    "Outfit Builder",
    "Personal Styling",
    "Fashion Intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
  <RouteGuard>{children}</RouteGuard>
</AuthProvider>
      </body>
    </html>
  );
}
