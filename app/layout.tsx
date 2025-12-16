// 📂 app/layout.tsx
import type { Metadata } from "next";

import "./globals.css";
import Favicon from "../public/favicon.ico";
import RootLayout from "./RootLayout"; // Import the client component

// ✅ Move `metadata` here
export const metadata: Metadata = {
  title: "Fitarrito",
  description: "Mexican Food",
  icons: [{ rel: "icon", url: Favicon.src, sizes: "32x32" }],
};

// ✅ Wrap everything in RootLayout
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}
