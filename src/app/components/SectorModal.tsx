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
      const pattern = /^sector-([A-Z](\d+)?)$/i;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Tmavé pozadie s rozostrením */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Hlavný panel modalu */}
      <div className="relative z-10 w-full max-w-5xl h-[90vh] sm:h-[85vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5">
        
        {/* Hlavička */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-stone-800">
              Výber sektora na mape
            </h2>
            {value && (
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                Vybrané: {value}
              </span>
            )}
          </div>
          
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Zavrieť modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Obsah - Samotná mapa */}
        <div className="flex-1 bg-stone-50/50 p-4 sm:p-8 overflow-hidden flex items-center justify-center relative">
          {!svg ? (
            // Loading state kým sa SVG stiahne
            <div className="flex flex-col items-center text-stone-400">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
              <span className="text-sm font-medium">Načítavam mapu...</span>
            </div>
          ) : (
            // Injektované SVG - vynútené centrovanie a udržanie v bounds
            <div
              ref={hostRef}
              className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto drop-shadow-sm transition-transform duration-300 hover:[&>svg]:drop-shadow-md"
              dangerouslySetInnerHTML={{
                __html: svg.replace("<svg ", "<svg preserveAspectRatio='xMidYMid meet' "),
              }}
            />
          )}
        </div>
        
      </div>
    </div>
  );
}