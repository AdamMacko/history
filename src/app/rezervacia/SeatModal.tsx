"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, Trash2 } from "lucide-react";
import SeatMap from "./SeatMap";

export type Table = {
  id: string;
  name: string;
  seats: number;
  sectorId: string;
  joinGroup?: string;   // ak je viac stolov spojených
  unavailable?: boolean;
};

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

type Props = {
  open: boolean;
  onClose: () => void;
  tables: Table[];
  partySize: number;
  value: string[];                // aktuálne vybraté ID stolov
  onChange: (ids: string[]) => void;
};

export default function SeatModal({ open, onClose, tables, partySize, value, onChange }: Props) {
  // Lokálna pracovná kópia (aby Cancel nerobil okamžité zmeny)
  const [picked, setPicked] = useState<string[]>(value);

  useEffect(() => {
    if (open) setPicked(value);
  }, [open, value]);

  const seatsPicked = useMemo(
    () => tables.filter(t => picked.includes(t.id)).reduce((s, t) => s + t.seats, 0),
    [picked, tables]
  );

  function toggleGroup(ids: string[]) {
    const hasAll = ids.every(id => picked.includes(id));
    setPicked(prev =>
      hasAll ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  }

  function clearSelection() {
    setPicked([]);
  }

  function autoPick() {
    // Jednoduchá stratégia: zväzky stolov (joinGroup alebo samostatné)
    const byGroup = groupByStrict(
      tables.filter(t => !t.unavailable),
      t => t.joinGroup ?? t.id
    );
    const bundles = Object.values(byGroup).map(list => ({
      ids: list.map(x => x.id),
      seats: list.reduce((s, x) => s + x.seats, 0),
    }));

    // najmenší zväzok ktorý pokryje partySize
    const exact = bundles
      .filter(b => b.seats >= partySize)
      .sort((a, b) => a.seats - b.seats)[0];
    if (exact) {
      setPicked(exact.ids);
      return;
    }

    // fallback: pridávaj najväčšie kým nenaplníš
    const desc = [...bundles].sort((a, b) => b.seats - a.seats);
    let acc: string[] = [];
    let sum = 0;
    for (const b of desc) {
      acc = [...acc, ...b.ids];
      sum += b.seats;
      if (sum >= partySize) break;
    }
    setPicked(acc);
  }

  function save() {
    onChange(picked);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/50"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-0 z-[75] overflow-y-auto"
          >
            <div className="mx-auto max-w-5xl px-4 py-5">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Výber sedenia</h2>
                  <p className="text-sm text-stone-600">
                    Počet osôb: <span className="font-medium">{partySize}</span> · Vybrané
                    sedačky: <span className="font-medium">{seatsPicked}</span>
                  </p>
                </div>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-stone-700 shadow hover:bg-white"
                  onClick={onClose}
                  aria-label="Zavrieť"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Toolbar */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <button onClick={autoPick} className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:opacity-95">
                  <Sparkles className="h-4 w-4" />
                  Auto vybrať
                </button>
                <button onClick={clearSelection} className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-50">
                  <Trash2 className="h-4 w-4" />
                  Vymazať výber
                </button>
                <span className="text-xs text-stone-500">
                  Tip: stoly s rovnakou farbou/okrajom tvoria jeden zväzok (spájateľné).
                </span>
              </div>

              {/* CONTENT */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <SeatMap
                  tables={tables}
                  selected={new Set(picked)}
                  onToggleGroup={toggleGroup}
                />
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-50"
                >
                  Zrušiť
                </button>
                <button
                  onClick={save}
                  disabled={seatsPicked < partySize}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent,#8FABD4)] px-4 py-2 text-sm font-semibold text-white shadow-sm enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Uložiť výber
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
