// src/app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "History Club",
    template: "%s | History Club",
  },
  // (voliteľné)
  description: "History Art & Music Club – Humenné",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
