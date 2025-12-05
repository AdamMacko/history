"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import SectorModal from "../components/SectorModal";
import SectorDetailModal from "../components/SectorDetailModal";

const CUTOFF_BOOKING_HOUR = 19;
const CUTOFF_BOOKING_MINUTE = 30;

const MAX_ARRIVAL_HOUR = 21;
const MAX_ARRIVAL_MINUTE = 30;
const MAX_PEOPLE = 16;

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

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

  // Fancy alert stavy
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("idle");
    setStatusMessage(null);

    // === FRONTEND VALIDÁCIE ===
    if (!fullName.trim()) {
      setStatus("error");
      setStatusMessage("Zadaj prosím meno a priezvisko.");
      return;
    }

    if (!email.trim()) {
      setStatus("error");
      setStatusMessage("Zadaj prosím e-mail.");
      return;
    }

    if (!when) {
      setStatus("error");
      setStatusMessage("Vyber dátum a čas rezervácie.");
      return;
    }

    if (partySize < 1 || partySize > MAX_PEOPLE) {
      setStatus("error");
      setStatusMessage(
        `Počet osôb musí byť medzi 1 a ${MAX_PEOPLE}.`
      );
      return;
    }

    const selected = new Date(when);
    const now = new Date();

    if (Number.isNaN(+selected)) {
      setStatus("error");
      setStatusMessage("Neplatný dátum a čas.");
      return;
    }

    // Rezervácia nesmie byť do minulosti
    if (selected.getTime() < now.getTime()) {
      setStatus("error");
      setStatusMessage(
        "Rezerváciu nie je možné vytvoriť do minulosti."
      );
      return;
    }

    // Celkový limit príchodu – najneskôr 21:30
    {
      const selectedMinutes =
        selected.getHours() * 60 + selected.getMinutes();
      const maxArrivalMinutes =
        MAX_ARRIVAL_HOUR * 60 + MAX_ARRIVAL_MINUTE;

      if (selectedMinutes > maxArrivalMinutes) {
        setStatus("error");
        setStatusMessage(
          "Najneskorší čas príchodu na rezervovaný stôl je 21:30."
        );
        return;
      }
    }

    // Na DNES možno rezervovať len do 19:30 (podľa aktuálneho času)
    if (isSameCalendarDay(selected, now)) {
      const cutoffToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        CUTOFF_BOOKING_HOUR,
        CUTOFF_BOOKING_MINUTE,
        0,
        0
      );

      if (now > cutoffToday) {
        setStatus("error");
        setStatusMessage(
          "Na dnešný večer je možné rezervovať najneskôr do 19:30."
        );
        return;
      }
    }

    // Musí byť vybraný sektor a aspoň jeden stôl
    if (!selectedSector || selectedTables.length === 0) {
      setStatus("error");
      setStatusMessage(
        "Vyber prosím sektor a aspoň jeden stôl z mapy."
      );
      return;
    }

    // === FETCH NA /api/reservation ===
    try {
      setSubmitting(true);

      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          when,
          partySize,
          selectedSector,
          selectedTables,
          note: note.trim() || undefined,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        const msg =
          (json && json.error) ||
          "Rezerváciu sa nepodarilo uložiť. Skús to prosím neskôr.";
        setStatus("error");
        setStatusMessage(msg);
        return;
      }

      // SUCCESS
      setStatus("success");
      setStatusMessage(
        "Rezervácia bola uložená. Čoskoro ti príde potvrdzujúci e-mail."
      );

      // reset formu
      setFullName("");
      setEmail("");
      setWhen("");
      setPartySize(2);
      setSelectedSector(null);
      setSelectedTables([]);
      setTotalSeatsPicked(0);
      setNote("");
    } catch (err) {
      console.error("CLIENT ERROR /rezervacia:", err);
      setStatus("error");
      setStatusMessage(
        "Nepodarilo sa spojiť so serverom. Skús to prosím o chvíľu znova."
      );
    } finally {
      setSubmitting(false);
    }
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

      <h1 className="mb-2 text-3xl font-semibold tracking-tight">
        Rezervácia
      </h1>
      <p className="mb-8 text-stone-600">
        Vyplň údaje a vyber si sektor a stoly.
      </p>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        

        {/* Meno */}
        <div>
          <label className="block text-sm font-medium text-stone-900">
            Meno a priezvisko
          </label>
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
          <label className="block text-sm font-medium text-stone-900">
            E-mail
          </label>
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
          <label className="block text-sm font-medium text-stone-900">
            Dátum a čas
          </label>
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
          <p className="mt-1 text-xs text-stone-500">
            Na dnešný večer je možné rezervovať najneskôr do 19:30. Najneskorší
            čas príchodu na stôl je 21:30.
          </p>
        </div>

        {/* Počet ľudí */}
        <div>
          <label className="block text-sm font-medium text-stone-900">
            Počet osôb (max {MAX_PEOPLE})
          </label>
          <div className="mt-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-stone-400" />
            <input
              type="number"
              min={1}
              max={MAX_PEOPLE}
              required
              value={partySize}
              onChange={(e) =>
                setPartySize(parseInt(e.target.value || "1", 10))
              }
              className="w-40 rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none ring-0 focus:border-stone-400"
            />
          </div>
        </div>

        {/* Výber sektora + stolov */}
        <div className="space-y-3 rounded-xl border border-stone-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-stone-700">
              Sektor:{" "}
              <span className="font-medium">
                {selectedSector ?? "—"}
              </span>
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
                {selectedTables.length
                  ? selectedTables.join(", ")
                  : "—"}
              </span>
            </div>
            <div className="text-stone-600">
              Spolu sedačiek: {totalSeatsPicked} / potrebných{" "}
              {partySize}
            </div>
          </div>
        </div>

              {/* Poznámka (nepovinné) */}
        <div>
          <label className="block text-sm font-medium text-stone-900">
            Poznámka (nepovinné)
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none ring-0 focus:border-stone-400"
          />
        </div>

        {/* FANCY ALERT – presunutý sem nad tlačidlá */}
        {status !== "idle" && statusMessage && (
          <div
            className={[
              "flex items-start gap-3 rounded-xl border px-3 py-2 text-sm",
              status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900",
            ].join(" ")}
          >
            <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-current opacity-70" />
            <p>{statusMessage}</p>
          </div>
        )}

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
              setStatus("idle");
              setStatusMessage(null);
            }}
            className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-50"
          >
            Resetovať
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-accent inline-flex items-center gap-2 disabled:opacity-70"
          >
            {submitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {submitting ? "Odosielam…" : "Odoslať rezerváciu"}
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
          setSectorDetailOpen(true);
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
