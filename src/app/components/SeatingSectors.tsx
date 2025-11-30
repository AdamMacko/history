"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  selected?: string | null;
  onSelect?: (sectorId: string) => void;
  className?: string;
};

export default function SeatingSectors({ selected, onSelect, className }: Props) {
  const [svg, setSvg] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  // načítaj SVG z public/
  useEffect(() => {
    fetch("/maps/sectors.svg")
      .then(r => r.text())
      .then(setSvg)
      .catch(console.error);
  }, []);

  // po vložení SVG naviaž interaktivitu
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const root = host.querySelector("svg");
    if (!root) return;

    // vyber len top-level skupiny sektorov (bez -shape/-label…)
    const sectors = Array.from(
      root.querySelectorAll<SVGGElement>(
        'g[id^="sector-"]:not([id$="-shape"]):not([id$="-shapeSmall"]):not([id$="-shapeLine"]):not([id$="-label"]):not([id$="-labelSmall"]):not([id$="-labelLine"])'
      )
    ).filter(g => g.id !== "nonClick"); // pre istotu

    // pridaj základné a11y / dátové atribúty
    sectors.forEach(g => {
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", g.id.replace("sector-", "Sektor "));
      g.dataset.sector = g.id.replace("sector-", "");
      g.classList.add("sector-hit");
      // Hover
      const enter = () => g.classList.add("is-hover");
      const leave = () => g.classList.remove("is-hover");
      g.addEventListener("mouseenter", enter);
      g.addEventListener("mouseleave", leave);
      // Click / Enter
      const pick = () => onSelect?.(g.dataset.sector!);
      g.addEventListener("click", pick);
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pick();
        }
      });

      // cleanup
      (g as any)._cleanup = () => {
        g.removeEventListener("mouseenter", enter);
        g.removeEventListener("mouseleave", leave);
        g.removeEventListener("click", pick);
      };
    });

    return () => {
      sectors.forEach(g => (g as any)._cleanup?.());
    };
  }, [svg, onSelect]);

  // zvýrazni vybraný sektor (prepínané cez class)
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.querySelectorAll(".sector-hit").forEach(el => {
      el.classList.toggle(
        "is-selected",
        selected ? el.getAttribute("data-sector") === selected : false
      );
    });
  }, [selected, svg]);

  return (
    <div
      ref={ref}
      className={["seating-svg", className].filter(Boolean).join(" ")}
      // vložíme SVG ako HTML (potrebujeme zachovať ID a štruktúru)
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
