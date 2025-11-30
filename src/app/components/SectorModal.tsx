"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  value: string | null;
  onSelect: (sector: string) => void;
  onClose: () => void;
};

// cesta k overview SVG so sektormi (umiestni do public/maps/sectors.svg)
const SECTORS_SVG = "/maps/sectors.svg";

export default function SectorModal({ open, value, onSelect, onClose }: Props) {
  const [svg, setSvg] = useState<string>("");
  const hostRef = useRef<HTMLDivElement>(null);

  // Načítanie SVG len keď je modal otvorený
  useEffect(() => {
    if (!open) return;
    let alive = true;
    fetch(SECTORS_SVG)
      .then((r) => r.text())
      .then((txt) => alive && setSvg(txt));
    return () => {
      alive = false;
      setSvg("");
    };
  }, [open]);

  // Delegovaný click handler na #sector-* + styling kurzora
  useEffect(() => {
    if (!open || !hostRef.current) return;

    const host = hostRef.current;

    // po injekte nastav kurzor a vypni klik na nonClick
    const prep = () => {
      // klikateľné skupiny
      host.querySelectorAll<SVGGElement>("g[id^='sector-']").forEach((g) => {
        g.style.cursor = "pointer";
      });
      // neklikateľné pozadie
      host.querySelectorAll<SVGGElement>("#nonClick, #nonclick").forEach((nc) => {
        (nc as SVGGElement).style.pointerEvents = "none";
      });
    };

    // delegácia klikov (funguje aj po re-rendre SVG)
   // nahrádza pôvodný onClick handler v SectorModal
const onClick = (e: MouseEvent) => {
  const host = hostRef.current!;
  const pattern = /^sector-([A-Z](\d+)?)$/i; // A, B1, B2, C, D, E, F, A1…

  let el: Element | null = e.target as Element;
  let picked: string | null = null;

  while (el && el !== host) {
    if (el instanceof SVGGElement) {
      const m = el.id.match(pattern);
      if (m) {
        picked = m[1].toUpperCase(); // "B1", "C", …
        break;
      }
    }
    el = el.parentElement;
  }
  if (!picked) return;
  onSelect(picked);
};




    host.addEventListener("click", onClick);
    // malé oneskorenie, kým sa SVG vloží do DOM
    setTimeout(prep, 0);

    return () => host.removeEventListener("click", onClick);
  }, [open, svg, onSelect]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[min(1100px,95vw)] h-[min(85vh,800px)] rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-sm text-stone-600">
            Klikni na sektor {value ? `(aktuálne: ${value})` : ""}
          </div>
          <button onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-stone-50">
            Zavrieť
          </button>
        </div>

        <div className="flex-1 overflow-auto p-3">
          {/* injekt SVG – vynútime správne škálovanie */}
          <div
            ref={hostRef}
            className="mx-auto w-full max-w-[1400px] [&>svg]:w-full [&>svg]:h-auto [&>svg]:block [&>svg]:max-h-[70vh]"
            // ts-expect-error – inject SVG text
            dangerouslySetInnerHTML={{
              __html: svg.replace("<svg ", "<svg preserveAspectRatio='xMidYMid meet' "),
            }}
          />
        </div>
      </div>
    </div>
  );
}
