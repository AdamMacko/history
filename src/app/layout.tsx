// src/app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import type { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: {
    default: "History Club",
    template: "%s | History Club",
  },
  description: "History Art & Music Club – Humenné",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=Oswald:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}