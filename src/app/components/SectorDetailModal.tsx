"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Check, Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  sector: string | null; // napr. "A1", "B1", "C", ...
  value: string[];       // aktuálne vybraté stoly (T21, T20, ...)
  onChange: (tables: string[], meta: { totalSeats: number; perTable: Record<string, number> }) => void;
  onClose: () => void;
};

export default function SectorDetailModal({ open, sector, value, onChange, onClose }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [raw, setRaw] = useState<string>("");

  // lokálny výber v modale
  const [picked, setPicked] = useState<Set<string>>(() => new Set(value));
  const [seatsMap, setSeatsMap] = useState<Record<string, number>>({});

  const isOpen = open && !!sector;

  useEffect(() => {
    if (!isOpen) return;
    setPicked(new Set(value));
  }, [isOpen, value, sector]);

  // načítaj SVG daného sektora
  useEffect(() => {
    if (!isOpen || !sector) return;
    const url = `/maps/sector${sector.toUpperCase()}.svg`;
    fetch(url)
      .then((r) => r.text())
      .then((txt) => setRaw(txt))
      .catch((e) => {
        console.error("Nepodarilo sa načítať sektorové SVG:", e);
        setRaw(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><text x="0" y="5">Chyba SVG</text></svg>`);
      });
  }, [isOpen, sector]);

  // vlož SVG inline, naviaž kliky na stoly a zarovnaj/fitni SVG do plochy
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !raw) return;

    host.innerHTML = raw;
    const svg = host.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;

    // Statický „fit“: nech sa SVG pekne zmestí do kontajnera
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // pozbieraj stoly a kapacity
    const localSeats: Record<string, number> = {};
    const tables = svg.querySelectorAll("g[id^='T']");
    tables.forEach((g) => {
      const id = (g as SVGGElement).id; // napr. "T21"
      (g as SVGGElement).style.cursor = "pointer";

   
const mainShape =
  g.querySelector<SVGElement>(`#rectangle${id}`) ??
  g.querySelector<SVGElement>(`#ellipse${id}`) ??
  g.querySelector<SVGElement>(`#circle${id}`) ??
  g.querySelector<SVGElement>("rect,ellipse,circle") ??
  g.querySelector<SVGElement>("path");


      // kapacita – prvý <text> s číslom (nie "č.xx")
      let seats = 0;
      const texts = g.querySelectorAll("text");
      for (const t of Array.from(texts)) {
        const s = (t.textContent || "").trim();
        if (/^\d{1,2}$/.test(s)) { seats = parseInt(s, 10); break; }
      }
      localSeats[id] = seats;

      // init highlight podľa picked
      setHighlight(g as SVGGElement, !!picked.has(id), mainShape);

      // toggle klik
      g.addEventListener("click", () => {
        setPicked((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
            setHighlight(g as SVGGElement, false, mainShape);
          } else {
            next.add(id);
            setHighlight(g as SVGGElement, true, mainShape);
          }
          return next;
        });
      });
    });

    setSeatsMap(localSeats);
  }, [raw]);

  const totalSeats = useMemo(() => {
    let sum = 0;
    picked.forEach((t) => (sum += seatsMap[t] || 0));
    return sum;
  }, [picked, seatsMap]);

  function setHighlight(group: SVGGElement, on: boolean, mainShape?: SVGElement | null) {
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
    <div className="fixed inset-0 z-[80] bg-black/60">
      <div className="absolute inset-0 flex flex-col">
        {/* Toolbar (bez zoom/drag prvkov) */}
        <div className="flex items-center justify-between gap-2 bg-white/90 px-4 py-2 shadow">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">Sektor {sector}</span>
            <span className="text-stone-500">•</span>
            <span>Vybrané stoly: {Array.from(picked).join(", ") || "—"}</span>
            <span className="text-stone-500">•</span>
            <span>Spolu miest: {totalSeats}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPicked(new Set())}
              className="inline-flex items-center gap-1 rounded-xl border border-stone-300 bg-white px-2 py-1 text-sm hover:bg-stone-50"
              title="Vymazať výber"
            >
              <Trash2 className="h-4 w-4" /> Vymazať
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(Array.from(picked), { totalSeats, perTable: seatsMap });
                onClose();
              }}
              className="btn-accent inline-flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Potvrdiť výber
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-2 py-1 text-sm hover:bg-stone-50"
            >
              <X className="h-4 w-4" />
              Zavrieť
            </button>
          </div>
        </div>

        {/* Plátno – statické, len prípadne scroll ak je SVG vyššie/širšie */}
        <div className="relative isolate flex-1 overflow-auto bg-white">
          <div
            ref={hostRef}
            className="h-full w-full p-4"
            // SVG je inline, fitnuté na 100% plochy kontajnera (bez zoom/drag)
          />
        </div>
      </div>
    </div>
  );
}
