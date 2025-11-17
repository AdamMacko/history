"use client";

import { useState } from "react";
import { Calendar, Users, MapPin } from "lucide-react";
import SeatModal, { Table } from "./SeatModal";

export default function ReservationPage() {
  // Form state
  const [fullName, setFullName] = useState("");
  const [when, setWhen] = useState<string>("");           // datetime-local
  const [partySize, setPartySize] = useState<number>(2);  // počet osôb
  const [note, setNote] = useState("");
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  // Modal
  const [seatOpen, setSeatOpen] = useState(false);

  // DEMO rozloženie stolov (nahradíš reálnymi dátami)
  const tables: Table[] = [
    { id: "A1", name: "A1", seats: 5, sectorId: "A", joinGroup: "A-10" },
    { id: "A2", name: "A2", seats: 5, sectorId: "A", joinGroup: "A-10" },
    { id: "B1", name: "B1", seats: 4, sectorId: "B" },
    { id: "B2", name: "B2", seats: 4, sectorId: "B" },
    { id: "C1", name: "C1", seats: 2, sectorId: "C" },
    { id: "C2", name: "C2", seats: 2, sectorId: "C", unavailable: true },
    { id: "C3", name: "C3", seats: 2, sectorId: "C" },
  ];

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: tu prepojíme na backend / Google Sheet / DB
    console.log({
      fullName,
      when,
      partySize,
      selectedTables,
      note,
    });
    alert("Rezervácia odoslaná (demo). Pozri konzolu pre payload.");
  }

  const totalSeatsPicked = tables
    .filter((t) => selectedTables.includes(t.id))
    .reduce((s, t) => s + t.seats, 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Rezervácia</h1>
      <p className="mb-8 text-stone-600">
        Vyplň údaje a vyber si sedenie. Výber stolov prebehne v modalnom okne na celú obrazovku.
      </p>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        {/* Meno */}
        <div>
          <label className="block text-sm font-medium text-stone-900">Meno a priezvisko</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none ring-0 focus:border-stone-400"
            placeholder="Ján Novák"
          />
        </div>

        {/* Dátum & čas */}
        <div>
          <label className="block text-sm font-medium text-stone-900">Dátum a čas</label>
          <div className="mt-2 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-stone-400" />
            <input
              type="datetime-local"
              required
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none ring-0 focus:border-stone-400"
            />
          </div>
        </div>

        {/* Počet ľudí */}
        <div>
          <label className="block text-sm font-medium text-stone-900">Počet osôb</label>
          <div className="mt-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-stone-400" />
            <input
              type="number"
              min={1}
              max={40}
              required
              value={partySize}
              onChange={(e) => setPartySize(parseInt(e.target.value || "1", 10))}
              className="w-40 rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none ring-0 focus:border-stone-400"
            />
          </div>
        </div>

        {/* Výber sedenia */}
        <div className="rounded-xl border border-stone-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-stone-700">
              Vybrané stoly:{" "}
              <span className="font-medium">
                {selectedTables.length ? selectedTables.join(", ") : "—"}
              </span>{" "}
              <span className="text-stone-500">
                (spolu sedačiek: {totalSeatsPicked} / potrebných {partySize})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSeatOpen(true)}
              className="btn-accent inline-flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Vybrať sedenie
            </button>
          </div>
        </div>

        {/* Poznámka (nepovinné) */}
        <div>
          <label className="block text-sm font-medium text-stone-900">Poznámka (nepovinné)</label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none ring-0 focus:border-stone-400"
            placeholder="Preferencie k stolu, narodeniny, atď."
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="reset"
            onClick={() => {
              setFullName("");
              setWhen("");
              setPartySize(2);
              setSelectedTables([]);
              setNote("");
            }}
            className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-50"
          >
            Resetovať
          </button>
          <button type="submit" className="btn-accent">
            Odoslať rezerváciu
          </button>
        </div>
      </form>

      {/* MODAL – výber sedenia */}
      <SeatModal
        open={seatOpen}
        onClose={() => setSeatOpen(false)}
        tables={tables}
        partySize={partySize}
        value={selectedTables}
        onChange={setSelectedTables}
      />
    </main>
  );
}
