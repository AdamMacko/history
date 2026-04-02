"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Check, Trash2, ArrowLeft } from "lucide-react";

type Props = {
  open: boolean;
  sector: string | null; // napr. "A1", "B1", "C", ...
  value: string[]; // aktuálne vybraté stoly (T21, T20, ...)
  onChange: (
    tables: string[],
    meta: { totalSeats: number; perTable: Record<string, number> }
  ) => void;
  onClose: () => void;
  onBack?: () => void; // <--- NOVÁ PROP NA NÁVRAT
  unavailableTables?: string[]; // napr. ["T21","T5","T27"]
  loadingUnavailable?: boolean;
};

const MAX_TABLES = 2;

export default function SectorDetailModal({
  open,
  sector,
  value,
  onChange,
  onClose,
  onBack,
  unavailableTables,
  loadingUnavailable,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [raw, setRaw] = useState<string>("");

  // lokálny výber v modale
  const [picked, setPicked] = useState<Set<string>>(() => new Set(value));
  const [seatsMap, setSeatsMap] = useState<Record<string, number>>({});

  const isOpen = open && !!sector;

  // pri otvorení modalu prebrať aktuálny výber z rodiča
  useEffect(() => {
    if (!isOpen) return;
    setPicked(new Set(value));
  }, [isOpen, value, sector]);

  // načítanie SVG pre daný sektor
  useEffect(() => {
    if (!isOpen || !sector) return;

    const url = `/maps/sector${sector.toUpperCase()}.svg`;

    fetch(url)
      .then((r) => r.text())
      .then((txt) => setRaw(txt))
      .catch((e) => {
        console.error("Nepodarilo sa načítať sektorové SVG:", e);
        setRaw(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><text x="0" y="5">Chyba SVG</text></svg>`
        );
      });
  }, [isOpen, sector]);

  // set na rýchle zistenie, či je stôl obsadený
  const unavailableSet = useMemo(
    () => new Set((unavailableTables ?? []).map((t) => t.toUpperCase())),
    [unavailableTables]
  );

  // vloženie SVG, naviazanie klikov a nastavenie obsadených stolov
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !raw || !isOpen) return;

    host.innerHTML = raw;
    const svg = host.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;

    // fit SVG do kontajnera
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const localSeats: Record<string, number> = {};
    const tables = svg.querySelectorAll("g[id^='T']");

    tables.forEach((g) => {
      const group = g as SVGGElement;
      const id = group.id; // napr. "T21"
      const upperId = id.toUpperCase();

      const mainShape =
        group.querySelector<SVGElement>(`#rectangle${id}`) ??
        group.querySelector<SVGElement>(`#ellipse${id}`) ??
        group.querySelector<SVGElement>(`#circle${id}`) ??
        group.querySelector<SVGElement>("rect,ellipse,circle") ??
        group.querySelector<SVGElement>("path");

      // kapacita – prvý <text> s čistým číslom
      let seats = 0;
      const texts = group.querySelectorAll("text");
      for (const t of Array.from(texts)) {
        const s = (t.textContent || "").trim();
        if (/^\d{1,2}$/.test(s)) {
          seats = parseInt(s, 10);
          break;
        }
      }
      localSeats[id] = seats;
      const isUnavailable = unavailableSet.has(upperId);

      if (isUnavailable) {
        group.style.cursor = "not-allowed";
        group.style.pointerEvents = "none";

        const children = group.querySelectorAll<SVGElement>("*");

        if (mainShape) {
          (mainShape.style as any).fill = "#e5e7eb";
          (mainShape.style as any).stroke = "#9ca3af";
          (mainShape.style as any).strokeWidth = "2.5px";
        }

        children.forEach((child) => {
          (child.style as any).opacity = "0.75";
          (child.style as any).filter = "grayscale(1)";

          if (child.tagName.toLowerCase() === "text") {
            (child.style as any).fill = "#4b5563";
          }
        });

        try {
          const targetForX = mainShape ?? group;
          // @ts-ignore
          const bbox = targetForX.getBBox?.();
          if (bbox) {
            const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line1.setAttribute("x1", String(bbox.x));
            line1.setAttribute("y1", String(bbox.y));
            line1.setAttribute("x2", String(bbox.x + bbox.width));
            line1.setAttribute("y2", String(bbox.y + bbox.height));

            const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line2.setAttribute("x1", String(bbox.x + bbox.width));
            line2.setAttribute("y1", String(bbox.y));
            line2.setAttribute("x2", String(bbox.x));
            line2.setAttribute("y2", String(bbox.y + bbox.height));

            [line1, line2].forEach((ln) => {
              ln.setAttribute("stroke", "#ef4444"); // red-500
              ln.setAttribute("stroke-width", "3");
              ln.setAttribute("stroke-linecap", "round");
              group.appendChild(ln);
            });
          }
        } catch (e) {
          console.warn("Nepodarilo sa vykresliť X pre", id, e);
        }

        setHighlight(group, false, mainShape);

        setPicked((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Set(prev);
          next.delete(id);
          return next;
        });

        return;
      }

      group.style.cursor = "pointer";
      setHighlight(group, picked.has(id), mainShape);
      
      group.addEventListener("click", () => {
        setPicked((prev) => {
          const already = prev.has(id);

          if (!already && prev.size >= MAX_TABLES) {
            return prev;
          }

          const next = new Set(prev);

          if (already) {
            next.delete(id);
            setHighlight(group, false, mainShape);
          } else {
            next.add(id);
            setHighlight(group, true, mainShape);
          }

          return next;
        });
      });
    });

    setSeatsMap(localSeats);
  }, [raw, unavailableSet, isOpen, picked, unavailableTables]);

  const totalSeats = useMemo(() => {
    let sum = 0;
    picked.forEach((t) => (sum += seatsMap[t] || 0));
    return sum;
  }, [picked, seatsMap]);

  function setHighlight(
    group: SVGGElement,
    on: boolean,
    mainShape?: SVGElement | null
  ) {
    const target = mainShape ?? group;
    if (on) {
      (target as any).style.filter = "drop-shadow(0 0 0.8rem rgba(59,130,246,0.6))";
      (target as any).style.stroke = "#2563eb";
      (target as any).style.strokeWidth = "2.5px";
    } else {
      (target as any).style.filter = "";
      (target as any).style.stroke = "";
      (target as any).style.strokeWidth = "";
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay s rozostrením */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-6xl h-[90vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5">
        
        {/* Hlavička - Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-stone-100 bg-white">
          {/* Tlačidlo Späť */}
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2 px-2 py-1.5 -ml-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-colors" />
            <span className="text-sm font-medium hidden sm:block">Späť na mapu</span>
            <span className="text-sm font-medium sm:hidden">Späť</span>
          </button>

          {/* Nadpis */}
          <h2 className="text-lg sm:text-xl font-bold text-stone-800 absolute left-1/2 -translate-x-1/2">
            Sektor {sector}
          </h2>

          {/* Tlačidlo Zavrieť */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Zavrieť modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Informačný panel a Akcie - Sub-header */}
        <div className="bg-stone-50 border-b border-stone-100 px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Info text */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-700">
                <span>
                  Vybrané stoly:{" "}
                  <span className="font-semibold text-stone-900">
                    {Array.from(picked).join(", ") || "—"}
                  </span>
                </span>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <span>
                  Spolu miest:{" "}
                  <span className="font-semibold text-blue-600">{totalSeats}</span>
                </span>
              </div>
              <div className="text-xs text-stone-500">
                {loadingUnavailable
                  ? "Načítavam obsadené stoly…"
                  : `Sivé/preškrtnuté stoly sú obsadené. Max ${MAX_TABLES} stoly.`}
              </div>
            </div>

            {/* Akčné tlačidlá */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setPicked(new Set())}
                disabled={picked.size === 0}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-red-600 disabled:opacity-50 disabled:hover:text-stone-600 disabled:hover:bg-white transition-colors"
                title="Vymazať výber"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Vymazať</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChange(Array.from(picked), {
                    totalSeats,
                    perTable: seatsMap,
                  });
                  onClose();
                }}
                disabled={picked.size === 0}
                className={`
                  btn-accent flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                  ${picked.size === 0 
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"}
                `}
              >
                <Check className="w-4 h-4" />
                Potvrdiť výber
              </button>
            </div>
          </div>
        </div>

        {/* Samotná mapa sektora */}
        <div className="flex-1 bg-white p-4 sm:p-8 overflow-hidden relative flex items-center justify-center">
          {!raw ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-blue-600 rounded-full animate-spin mb-3" />
              <p className="text-stone-400 font-medium text-sm">Načítavam sektor...</p>
            </div>
          ) : (
            <div 
              ref={hostRef} 
              className="w-full h-full flex items-center justify-center 
                         [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto 
                         [&>svg]:block drop-shadow-sm" 
            />
          )}
        </div>
        
      </div>
    </div>
  );
}