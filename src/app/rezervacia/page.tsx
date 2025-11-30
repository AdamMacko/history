"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, ArrowLeft } from "lucide-react";
import SectorModal from "../components/SectorModal";
import SectorDetailModal from "../components/SectorDetailModal";

export default function ReservationPage() {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [when, setWhen] = useState<string>("");
  const [partySize, setPartySize] = useState<number>(2);
  const [note, setNote] = useState("");

  // Výber sektora
  const [sectorOpen, setSectorOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Výber stolov v sektore
  const [sectorDetailOpen, setSectorDetailOpen] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [totalSeatsPicked, setTotalSeatsPicked] = useState<number>(0);

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({
      fullName,
      email,
      when,
      partySize,
      selectedSector,
      selectedTables,
      totalSeatsPicked,
      note,
    });
    alert("Rezervácia odoslaná (demo). Pozri konzolu pre payload.");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      {/* Späť */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm hover:bg-stone-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Späť
        </button>
      </div>

      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Rezervácia</h1>
      <p className="mb-8 text-stone-600">
        Vyplň údaje a vyber si sektor a stoly.
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

        {/* E-mail */}
        <div>
          <label className="block text-sm font-medium text-stone-900">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none ring-0 focus:border-stone-400"
            placeholder="meno@priklad.sk"
            autoComplete="email"
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

        {/* Výber sektora + stolov */}
        <div className="space-y-3 rounded-xl border border-stone-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-stone-700">
              Sektor: <span className="font-medium">{selectedSector ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSectorOpen(true)}
                className="btn-accent inline-flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Vybrať sektor (mapa)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              Vybrané stoly:{" "}
              <span className="font-medium">
                {selectedTables.length ? selectedTables.join(", ") : "—"}
              </span>
            </div>
            <div className="text-stone-600">
              Spolu sedačiek: {totalSeatsPicked} / potrebných {partySize}
            </div>
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
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="reset"
            onClick={() => {
              setFullName("");
              setEmail("");
              setWhen("");
              setPartySize(2);
              setSelectedSector(null);
              setSelectedTables([]);
              setTotalSeatsPicked(0);
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

      {/* MODAL – výber sektora z hlavnej mapy */}
      <SectorModal
        open={sectorOpen}
        value={selectedSector}
        onSelect={(sector) => {
          setSelectedSector(sector);
          setSectorOpen(false);
          setSectorDetailOpen(true); // hneď otvoríme detail
        }}
        onClose={() => setSectorOpen(false)}
      />

      {/* MODAL – detail sektora, klikateľné stoly */}
      <SectorDetailModal
        open={sectorDetailOpen}
        sector={selectedSector}
        value={selectedTables}
        onChange={(tables, meta) => {
          setSelectedTables(tables);
          setTotalSeatsPicked(meta.totalSeats);
        }}
        onClose={() => setSectorDetailOpen(false)}
      />
    </main>
  );
}
