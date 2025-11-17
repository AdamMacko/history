"use client";

import { useMemo, useState } from "react";
import { Check, Users, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

/** ───────────────────── Types & sample data ───────────────────── */

type Sector = {
  id: string;
  name: string;
  color: string;   // hex
  rect: { x: number; y: number; w: number; h: number }; // simple shape for demo
};

type Table = {
  id: string;
  sectorId: string;
  seats: number;
  /** tables with rovnakým joinGroup sa dajú zlúčiť (napr. A1 + A2) */
  joinGroup?: string;
  rect: { x: number; y: number; w: number; h: number };
  /** voliteľné – ak už je obsadený (budúce využitie) */
  unavailable?: boolean;
};

export type SeatingSelection = {
  sectorId?: string;
  tableIds: string[];
  capacity: number;
};

const SECTORS: Sector[] = [
  { id: "A", name: "Sektor A", color: "#8FABD4", rect: { x: 20,  y: 40,  w: 280, h: 220 } },
  { id: "B", name: "Sektor B", color: "#B9D5FF", rect: { x: 360, y: 40,  w: 280, h: 220 } },
  { id: "C", name: "Sektor C", color: "#D8E7FF", rect: { x: 700, y: 40,  w: 280, h: 220 } },
];

// demo rozloženie: 5-miestne stolíky v pároch (A1+A2, A3+A4, ...), ktoré sa vedia zlúčiť na 10
const TABLES: Table[] = [
  // A
  { id: "A1", sectorId: "A", seats: 5, joinGroup: "A12", rect: { x: 40,  y: 70,  w: 60, h: 40 } },
  { id: "A2", sectorId: "A", seats: 5, joinGroup: "A12", rect: { x: 110, y: 70,  w: 60, h: 40 } },
  { id: "A3", sectorId: "A", seats: 5, joinGroup: "A34", rect: { x: 40,  y: 130, w: 60, h: 40 } },
  { id: "A4", sectorId: "A", seats: 5, joinGroup: "A34", rect: { x: 110, y: 130, w: 60, h: 40 } },
  { id: "A5", sectorId: "A", seats: 4,                   rect: { x: 200, y: 100, w: 60, h: 40 } },

  // B
  { id: "B1", sectorId: "B", seats: 5, joinGroup: "B12", rect: { x: 380, y: 70,  w: 60, h: 40 } },
  { id: "B2", sectorId: "B", seats: 5, joinGroup: "B12", rect: { x: 450, y: 70,  w: 60, h: 40 } },
  { id: "B3", sectorId: "B", seats: 5, joinGroup: "B34", rect: { x: 380, y: 130, w: 60, h: 40 } },
  { id: "B4", sectorId: "B", seats: 5, joinGroup: "B34", rect: { x: 450, y: 130, w: 60, h: 40 } },
  { id: "B5", sectorId: "B", seats: 6,                   rect: { x: 540, y: 100, w: 60, h: 40 } },

  // C
  { id: "C1", sectorId: "C", seats: 5, joinGroup: "C12", rect: { x: 720, y: 70,  w: 60, h: 40 } },
  { id: "C2", sectorId: "C", seats: 5, joinGroup: "C12", rect: { x: 790, y: 70,  w: 60, h: 40 } },
  { id: "C3", sectorId: "C", seats: 5, joinGroup: "C34", rect: { x: 720, y: 130, w: 60, h: 40 } },
  { id: "C4", sectorId: "C", seats: 5, joinGroup: "C34", rect: { x: 790, y: 130, w: 60, h: 40 } },
  { id: "C5", sectorId: "C", seats: 8,                   rect: { x: 880, y: 100, w: 70, h: 40 } },
];

/** ───────────────────── Helpery ───────────────────── */
function groupByStrict<T, K extends string | number | symbol>(
  arr: T[],
  key: (t: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}


function sumSeats(tables: Table[], ids: string[]) {
  return tables.filter(t => ids.includes(t.id)).reduce((s, t) => s + t.seats, 0);
}

function autoPickTables(tables: Table[], sectorId: string, partySize: number): string[] {
  const pool = tables.filter(t => t.sectorId === sectorId && !t.unavailable);

  // pôvodné Object.groupBy -> nahradené:
  const byGroup = groupByStrict(pool, t => (t.joinGroup ?? t.id));

  const bundles = Object.values(byGroup).map((list: Table[]) => {
    const ids = list.map(x => x.id);
    const seats = list.reduce((s, x) => s + x.seats, 0);
    return { ids, seats };
  });

  const exactOrAbove = bundles
    .filter(b => b.seats >= partySize)
    .sort((a, b) => a.seats - b.seats)[0];
  if (exactOrAbove) return exactOrAbove.ids;

  const bySeatsDesc = [...bundles].sort((a, b) => b.seats - a.seats);
  const pick: string[] = [];
  let total = 0;
  for (const b of bySeatsDesc) {
    pick.push(...b.ids);
    total += b.seats;
    if (total >= partySize) break;
  }
  return pick;
}


/** ───────────────────── Component ───────────────────── */

export default function SeatingMap({
  partySize,
  onChange,
}: {
  partySize: number;
  onChange?: (sel: SeatingSelection) => void;
}) {
  const [selectedSector, setSelectedSector] = useState<string | undefined>();
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);

  const capacity = useMemo(
    () => sumSeats(TABLES, selectedTables),
    [selectedTables]
  );

  const sectorTables = useMemo(
    () => TABLES.filter(t => !selectedSector || t.sectorId === selectedSector),
    [selectedSector]
  );

  const selectSector = (id: string) => {
    setSelectedSector(id);
    // ak meníš sektor, udrž len stoly z daného sektora
    setSelectedTables(prev => prev.filter(tid => TABLES.find(t => t.id === tid)?.sectorId === id));
  };

  const toggleTable = (id: string) => {
    const t = TABLES.find(x => x.id === id);
    if (!t || (selectedSector && t.sectorId !== selectedSector)) return;
    setSelectedTables(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAuto = () => {
    if (!selectedSector) return;
    setSelectedTables(autoPickTables(TABLES, selectedSector, partySize));
  };

  const reset = () => {
    setSelectedTables([]);
    setSelectedSector(undefined);
    setZoom(1);
  };

  // report do formulára
  useMemo(() => {
    onChange?.({ sectorId: selectedSector, tableIds: selectedTables, capacity });
  }, [selectedSector, selectedTables, capacity, onChange]);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-stone-600" />
          <div className="text-sm">
            <div className="font-semibold text-stone-900">Výber miest</div>
            <div className="text-stone-600">
              Počet osôb: <b>{partySize}</b> &middot; Kapacita výberu:{" "}
              <b>{capacity}</b>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-xl ring-1 ring-stone-300">
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(0.8, +(z - 0.1).toFixed(2)))}
              className="inline-flex items-center gap-1 bg-white px-3 py-2 text-sm hover:bg-stone-50"
              aria-label="Oddialiť"
            >
              <ZoomOut size={16} /> -
            </button>
            <div className="px-3 py-2 text-sm bg-white border-x border-stone-300">
              {Math.round(zoom * 100)}%
            </div>
            <button
              type="button"
              onClick={() => setZoom(z => Math.min(2.5, +(z + 0.1).toFixed(2)))}
              className="inline-flex items-center gap-1 bg-white px-3 py-2 text-sm hover:bg-stone-50"
              aria-label="Priblížiť"
            >
              <ZoomIn size={16} /> +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAuto}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            disabled={!selectedSector}
            title={!selectedSector ? "Najprv zvoľ sektor" : "Navrhnúť stoly"}
          >
            <Check size={16} /> Auto výber
          </button>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-stone-50"
          >
            <RefreshCw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* SVG plátno – responsívne, zoom cez CSS scale */}
      <div className="w-full overflow-auto">
        <div
          className="mx-auto my-3 max-w-[1100px] overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
        >
          <svg
            viewBox="0 0 1000 320"
            className="h-[280px] w-full md:h-[360px]"
            aria-label="Mapa sedenia"
          >
            {/* sektory */}
            {SECTORS.map(s => (
              <g key={s.id}>
                <rect
                  x={s.rect.x}
                  y={s.rect.y}
                  width={s.rect.w}
                  height={s.rect.h}
                  fill={s.color}
                  fillOpacity={selectedSector === s.id ? 0.35 : 0.18}
                  stroke={s.color}
                  strokeWidth={2}
                  rx={10}
                  className="cursor-pointer"
                  onClick={() => selectSector(s.id)}
                />
                <text
                  x={s.rect.x + 10}
                  y={s.rect.y + 22}
                  fontSize="14"
                  fill="#1f2937"
                >
                  {s.name}
                </text>
              </g>
            ))}

            {/* stoly */}
            {sectorTables.map(t => {
              const isSel = selectedTables.includes(t.id);
              const isBlocked = !!t.unavailable;
              const stroke = isSel ? "#0d9488" : "#334155";
              const fill = isBlocked ? "#e5e7eb" : isSel ? "#ccfbf1" : "#ffffff";
              return (
                <g key={t.id}>
                  <rect
                    x={t.rect.x}
                    y={t.rect.y}
                    width={t.rect.w}
                    height={t.rect.h}
                    rx={6}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2}
                    className={isBlocked ? "cursor-not-allowed" : "cursor-pointer"}
                    onClick={() => !isBlocked && toggleTable(t.id)}
                  />
                  <text
                    x={t.rect.x + t.rect.w / 2}
                    y={t.rect.y + t.rect.h / 2 + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#1f2937"
                  >
                    {t.id} · {t.seats}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
