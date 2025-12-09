"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Check, Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  sector: string | null; // napr. "A1", "B1", "C", ...
  value: string[]; // aktuálne vybraté stoly (T21, T20, ...)
  onChange: (
    tables: string[],
    meta: { totalSeats: number; perTable: Record<string, number> }
  ) => void;
  onClose: () => void;
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

    console.log("UNAVAILABLE TABLES PROP:", unavailableTables);
    console.log("UNAVAILABLE SET:", Array.from(unavailableSet));

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
      console.log("TABLE", id, "isUnavailable =", isUnavailable);

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
            const line1 = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "line"
            );
            line1.setAttribute("x1", String(bbox.x));
            line1.setAttribute("y1", String(bbox.y));
            line1.setAttribute("x2", String(bbox.x + bbox.width));
            line1.setAttribute("y2", String(bbox.y + bbox.height));

            const line2 = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "line"
            );
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
      (target as any).style.filter =
        "drop-shadow(0 0 0.8rem rgba(59,130,246,0.6))";
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
        {/* Toolbar */}
        <div className="bg-white/90 px-3 py-2 shadow sm:px-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Info časť */}
            <div className="space-y-1 text-xs text-stone-700 sm:text-sm">
              <div className="font-medium">Sektor {sector}</div>

              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <span>
                  Vybrané stoly:{" "}
                  <span className="font-semibold">
                    {Array.from(picked).join(", ") || "—"}
                  </span>
                </span>
                <span className="text-stone-400">•</span>
                <span>
                  Spolu miest:{" "}
                  <span className="font-semibold">{totalSeats}</span>
                </span>
              </div>

              <div className="text-[11px] text-stone-500">
                {loadingUnavailable
                  ? "Načítavam obsadené stoly…"
                  : "Sivé/preškrtnuté stoly sú už obsadené. Max 2 stoly na rezerváciu."}
              </div>
            </div>

            {/* Tlačidlá */}
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setPicked(new Set())}
                className="inline-flex items-center gap-1 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-stone-50 sm:text-sm"
                title="Vymazať výber"
              >
                <Trash2 className="h-4 w-4" />
                Vymazať
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
                className="btn-accent inline-flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm"
              >
                <Check className="h-4 w-4" />
                Potvrdiť výber
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-stone-50 sm:text-sm"
              >
                <X className="h-4 w-4" />
                Zavrieť
              </button>
            </div>
          </div>
        </div>

        {/* Plátno */}
        <div className="relative isolate flex-1 overflow-auto bg-white">
          <div ref={hostRef} className="h-full w-full p-4" />
        </div>
      </div>
    </div>
  );
}
