"use client";

import { memo, useMemo } from "react";
import type { Table } from "./SeatModal";

// Jednoduché farby na rozlíšenie "zväzkov" (joinGroup)
const GROUP_COLORS = [
  "#8FABD4", "#7fc8a9", "#f6bd60", "#f28482", "#cdb4db", "#90dbf4", "#84a59d",
];

type Props = {
  tables: Table[];
  selected: Set<string>;
  onToggleGroup: (ids: string[]) => void;
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

export default memo(function SeatMap({ tables, selected, onToggleGroup }: Props) {
  // sektory
  const sectors = useMemo(
    () => groupByStrict(tables, t => t.sectorId),
    [tables]
  );

  const colorForGroup = (gk: string) => {
    // stabilná farba podľa hash indexu
    const idx = Math.abs([...gk].reduce((a, c) => a + c.charCodeAt(0), 0)) % GROUP_COLORS.length;
    return GROUP_COLORS[idx];
  };

  return (
    <div className="space-y-8">
      {Object.entries(sectors).map(([sectorId, list]) => {
        // rozdelené na zväzky
        const bundles = Object.values(groupByStrict(list, t => t.joinGroup ?? t.id));

        return (
          <section key={sectorId}>
            <h3 className="mb-3 text-sm font-semibold text-stone-900">Sektor {sectorId}</h3>

            {/* responzívna mriežka */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {bundles.map((bundle, i) => {
                const ids = bundle.map(b => b.id);
                const allSelected = ids.every(id => selected.has(id));
                const someSelected = !allSelected && ids.some(id => selected.has(id));
                const disabled = bundle.every(b => b.unavailable);
                const seats = bundle.reduce((s, b) => s + b.seats, 0);
                const label = bundle.map(b => b.name).join("+");
                const groupKey = bundle[0].joinGroup ?? bundle[0].id;

                return (
                  <button
                    key={groupKey + i}
                    type="button"
                    disabled={disabled}
                    onClick={() => onToggleGroup(ids)}
                    title={`${label} · ${seats} miest`}
                    className={[
                      "relative h-24 rounded-xl border p-2 text-left transition",
                      "focus:outline-none focus:ring-2 focus:ring-stone-400",
                      disabled
                        ? "cursor-not-allowed opacity-40"
                        : "hover:shadow-sm bg-white",
                      allSelected
                        ? "ring-2 ring-[var(--accent,#8FABD4)] border-[var(--accent,#8FABD4)]"
                        : someSelected
                        ? "border-[var(--accent,#8FABD4)]"
                        : "border-stone-200",
                    ].join(" ")}
                    style={{
                      // jemný farebný hint zväzku
                      boxShadow: someSelected || allSelected ? undefined : `inset 0 0 0 2px ${colorForGroup(groupKey)}22`,
                    }}
                  >
                    <div className="text-sm font-semibold text-stone-900">{label}</div>
                    <div className="text-xs text-stone-600">{seats} miest</div>

                    {bundle.some(b => b.unavailable) && (
                      <span className="absolute right-2 top-2 rounded-md bg-stone-200 px-1.5 py-0.5 text-[10px] font-medium text-stone-700">
                        blokované
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
});
