// 📂 app/layout.tsx
import type { Metadata } from "next";

import "./globals.css";
import RootLayout from "./RootLayout"; // Import the client component

// ✅ Move `metadata` here
export const metadata: Metadata = {
  title: "Fitarrito",
  description: "Mexican Food",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

// ✅ Wrap everything in RootLayout
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}
