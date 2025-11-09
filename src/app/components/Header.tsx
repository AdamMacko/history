"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, MapPin } from "lucide-react";

type NavItem = { id: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { id: "aboutus",  label: "O nás" },
  { id: "program",  label: "Program" },
  { id: "tools",    label: "Vybavenie" },
  { id: "gallery",  label: "Galéria" },
  { id: "partners", label: "Partneri" },
  { id: "contact",  label: "Kontakt" },
];

const EASE = [0.22, 1, 0.36, 1] as const; // framer-motion easeOut

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  // tieň po scrolle
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // aktívna položka podľa viditeľnej sekcie
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (top[0]?.target?.id) setActive(top[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const shell = useMemo(
    () =>
      [
        "sticky top-0 z-50",
        "bg-white/70 backdrop-blur-md",
        scrolled
          ? "border-b border-stone-200 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)]"
          : "border-b border-transparent",
      ].join(" "),
    [scrolled]
  );

  const closeMenu = () => setMenuOpen(false);
  const smooth = { behavior: "smooth" as const, block: "start" as const };

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id?: string) => {
    if (!id) return;
    e.preventDefault();
    closeMenu();
    const el = document.getElementById(id);
    if (!el) {
      location.hash = id;
      return;
    }
    el.scrollIntoView(smooth);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className={shell} role="banner" aria-label="Hlavička">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo → top */}
          <a
            href="#"
            aria-label="Domov"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.replaceState(null, "", "#");
            }}
            className="inline-flex items-center"
          >
            <div className="relative h-10 w-[150px] md:h-12 md:w-[190px]">
              <Image
                src="/logo.png"
                alt="History logo"
                fill
                sizes="(max-width:768px) 150px, 190px"
                priority
                className="object-contain"
              />
            </div>
            <span className="sr-only">History Art &amp; Music Club</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex" aria-label="Hlavná navigácia">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id} className="relative inline-block">
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/85 ring-1 ring-stone-200"
                      transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.6 }}
                    />
                  )}
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleAnchor(e, item.id)}
                    className="relative z-10 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Rezervácia – CTA na vlastnú stránku */}
            <Link href="/rezervacia" className="btn-accent ml-3">
              Rezervácia
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white p-2 text-stone-700 hover:bg-stone-100 md:hidden"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="overflow-hidden border-t border-stone-200 bg-white/90 backdrop-blur md:hidden"
      >
        <nav aria-label="Mobilná navigácia" className="mx-auto max-w-6xl px-4 py-2">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleAnchor(e, item.id)}
                  className={[
                    "block rounded-xl px-4 py-3 text-[15px] font-medium",
                    "text-stone-900 hover:bg-stone-100",
                    active === item.id ? "bg-stone-100" : "",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            ))}

            <li className="mt-2 flex gap-2">
              <Link
                href="/rezervacia"
                className="btn-accent flex-1 inline-flex items-center justify-center"
              >
                Rezervácia
              </Link>
              <a
                href="#contact"
                onClick={(e) => handleAnchor(e, "contact")}
                className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-stone-100"
                aria-label="Mapa"
              >
                <MapPin size={18} />
              </a>
            </li>
          </ul>
        </nav>
      </motion.div>
    </header>
  );
}
