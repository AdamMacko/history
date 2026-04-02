"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, ArrowLeft, Loader2, AlertCircle } from "lucide-react"; // <-- PRIDANÝ AlertCircle
import SectorModal from "../components/SectorModal";
import SectorDetailModal from "../components/SectorDetailModal";
import { getBlockedDates } from "./actions";

const CUTOFF_BOOKING_HOUR = 19;
const CUTOFF_BOOKING_MINUTE = 30;

const MAX_ARRIVAL_HOUR = 21;
const MAX_ARRIVAL_MINUTE = 0;
const MAX_PEOPLE = 16;
const FORCED_UNAVAILABLE_TABLES = ["T19", "T12"];

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
  const [partySize, setPartySize] = useState<string>("2");
  const [note, setNote] = useState("");

  // Výber sektora
  const [sectorOpen, setSectorOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Výber stolov v sektore
  const [sectorDetailOpen, setSectorDetailOpen] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [totalSeatsPicked, setTotalSeatsPicked] = useState<number>(0);

  // Obsadené stoly pre daný dátum
  const [unavailableTables, setUnavailableTables] = useState<string[]>([]);
  const [loadingUnavailable, setLoadingUnavailable] = useState(false);

  // Alert stavy (pre celkový formulár)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Zablokované dátumy a špecifický error pre dátum
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string | null>(null); // <-- NOVÝ STAV PRE ERROR PRI DÁTUME

  useEffect(() => {
    getBlockedDates()
      .then((dates) => setBlockedDates(dates))
      .catch((err) => console.error("Chyba pri načítaní blokovaných dátumov:", err));
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateTime = e.target.value; 
    
    if (!selectedDateTime) {
      setWhen("");
      setDateError(null);
      return;
    }

    const justDate = selectedDateTime.split("T")[0];

    // Ak je dátum zablokovaný
    if (blockedDates.includes(justDate)) {
      setWhen(""); // Vymaže neplatný výber
      // Nastavíme lokálny error presne pod políčko dátumu
      setDateError("Na tento deň nie je možné vytvoriť rezerváciu. Lístky sa predávajú externe.");
      setSelectedSector(null);
      setSelectedTables([]);
      return;
    }

    // Ak je dátum OK, vymažeme errory
    setWhen(selectedDateTime);
    setDateError(null);
    if (status === "error") {
      setStatus("idle");
      setStatusMessage(null);
    }
  };

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  async function handleOpenSectorPicker() {
    setStatus("idle");
    setStatusMessage(null);

    if (!when) {
      setStatus("error");
      setStatusMessage("Najprv vyber dátum a čas rezervácie.");
      return;
    }

    try {
      setLoadingUnavailable(true);

      const res = await fetch("/api/reservation/unavailable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ when }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        console.error("Chyba /api/reservation/unavailable:", json);
        setUnavailableTables([...FORCED_UNAVAILABLE_TABLES]);
      } else if (Array.isArray(json.tables)) {
        const merged = Array.from(
          new Set([...(json.tables as string[]), ...FORCED_UNAVAILABLE_TABLES])
        );
        setUnavailableTables(merged);
      } else {
        setUnavailableTables([...FORCED_UNAVAILABLE_TABLES]);
      }

      setSectorOpen(true);
    } catch (err) {
      console.error("CLIENT ERROR pri načítaní obsadených stolov:", err);
      setUnavailableTables([...FORCED_UNAVAILABLE_TABLES]);
      setStatus("error");
      setStatusMessage("Nepodarilo sa načítať obsadené stoly. Skús to prosím o chvíľu znova.");
    } finally {
      setLoadingUnavailable(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("idle");
    setStatusMessage(null);

    const partySizeNum = Number.parseInt(partySize || "0", 10);

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

    if (!Number.isFinite(partySizeNum) || partySizeNum < 1 || partySizeNum > MAX_PEOPLE) {
      setStatus("error");
      setStatusMessage(`Počet osôb musí byť medzi 1 a ${MAX_PEOPLE}.`);
      return;
    }

    const selected = new Date(when);
    const now = new Date();

    if (Number.isNaN(+selected)) {
      setStatus("error");
      setStatusMessage("Neplatný dátum a čas.");
      return;
    }

    if (selected.getTime() < now.getTime()) {
      setStatus("error");
      setStatusMessage("Rezerváciu nie je možné vytvoriť do minulosti.");
      return;
    }

    {
      const selectedMinutes = selected.getHours() * 60 + selected.getMinutes();
      const maxArrivalMinutes = MAX_ARRIVAL_HOUR * 60 + MAX_ARRIVAL_MINUTE;

      if (selectedMinutes > maxArrivalMinutes) {
        setStatus("error");
        setStatusMessage("Najneskorší čas príchodu na rezervovaný stôl je 21:00.");
        return;
      }
    }

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
        setStatusMessage("Na dnešný večer je možné rezervovať najneskôr do 19:30.");
        return;
      }
    }

    if (!selectedSector || selectedTables.length === 0) {
      setStatus("error");
      setStatusMessage("Vyber prosím sektor a aspoň jeden stôl z mapy.");
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
          partySize: partySizeNum,
          selectedSector,
          selectedTables,
          note: note.trim() || undefined,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        const msg = json?.error || "Rezerváciu sa nepodarilo uložiť. Skús to prosím neskôr.";
        setStatus("error");
        setStatusMessage(msg);
        return;
      }

      setStatus("success");
      setStatusMessage("Rezervácia bola uložená. Čoskoro ti príde potvrdzujúci e-mail.");

      // Zresetujeme aj nový dateError pri úspechu
      setFullName("");
      setEmail("");
      setWhen("");
      setDateError(null);
      setPartySize("2");
      setSelectedSector(null);
      setSelectedTables([]);
      setTotalSeatsPicked(0);
      setNote("");
      setUnavailableTables([]);
    } catch (err) {
      console.error("CLIENT ERROR /rezervacia:", err);
      setStatus("error");
      setStatusMessage("Nepodarilo sa spojiť so serverom. Skús to prosím o chvíľu znova.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      {/* Späť */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Späť
        </button>
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">
        Rezervácia
      </h1>
      <p className="mb-8 text-stone-600 leading-relaxed">
        Rezervácia je možná v bežných dňoch a na podujatia, na ktoré nie je možné
        kupovať vstupenky v predpredaji (podujatia bez vstupného alebo podujatia
        s dobrovoľným vstupným).
      </p>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-5 sm:p-8 shadow-sm"
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
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="meno@priklad.sk"
            autoComplete="email"
          />
        </div>

        {/* Dátum & čas - UPRAVENÉ PRE LOKÁLNY ERROR */}
        <div>
          <label className="block text-sm font-medium text-stone-900">
            Dátum a čas
          </label>
          <div className="mt-2 flex items-center gap-2">
            <Calendar className={`h-5 w-5 ${dateError ? "text-red-400" : "text-stone-400"}`} />
            <input
              type="datetime-local"
              required
              value={when}
              onChange={handleDateChange}
              className={`w-full rounded-xl border bg-white px-4 py-2.5 outline-none ring-0 transition-all ${
                dateError 
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30" 
                  : "border-stone-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
          </div>
          
          {/* Dynamické zobrazenie chybovej hlášky pre dátum */}
          {dateError ? (
            <p className="mt-2.5 flex items-start gap-1.5 text-sm font-medium text-red-600 animate-in slide-in-from-top-1 fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {dateError}
            </p>
          ) : (
            <p className="mt-2 text-xs text-stone-500">
              Na dnešný večer je možné rezervovať najneskôr do 19:30. Najneskorší
              čas príchodu na stôl je 21:00.
            </p>
          )}
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
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setPartySize("");
                  return;
                }
                const num = Number.parseInt(val, 10);
                if (!Number.isNaN(num) && num <= MAX_PEOPLE) {
                  setPartySize(String(num));
                }
              }}
              className="w-40 rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Výber sektora + stolov */}
        <div className="rounded-xl border border-stone-200 bg-stone-50/50 overflow-hidden">
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 bg-white">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-stone-900">Výber miesta</span>
              <span className="text-sm text-stone-500">
                Sektor: <strong className="text-stone-900">{selectedSector ?? "Nevybraný"}</strong>
              </span>
            </div>
            
            <button
              type="button"
              onClick={handleOpenSectorPicker}
              disabled={loadingUnavailable || !when || !!dateError} // Zakážeme aj keď je dateError
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${(!when || dateError)
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"}
              `}
            >
              {loadingUnavailable ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              {selectedSector ? "Zmeniť miesto" : "Vybrať miesto (mapa)"}
            </button>
          </div>

          {selectedSector && selectedTables.length > 0 && (
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Vybrané stoly:</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold ring-1 ring-inset ring-blue-700/10">
                  {selectedTables.join(", ")}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500">Kapacita:</span>
                <span className={`font-semibold ${totalSeatsPicked < Number(partySize) ? "text-red-600" : "text-emerald-600"}`}>
                  {totalSeatsPicked}
                </span>
                <span className="text-stone-400">/</span>
                <span className="text-stone-900">{Number(partySize || "0")}</span>
              </div>
            </div>
          )}
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
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none ring-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
          />
        </div>
        
        <p className="text-xs text-stone-500 leading-relaxed">
          *Osobné údaje spracúvame výlučne na účely vybavenia rezervácie.
        </p>

        {/* Alert Správy pre celý formulár (napr. pri odosielaní) */}
        {status !== "idle" && statusMessage && (
          <div
            className={`flex items-start gap-3 rounded-xl p-4 text-sm ${
              status === "success"
                ? "bg-emerald-50 text-emerald-900 ring-1 ring-inset ring-emerald-500/20"
                : "bg-red-50 text-red-900 ring-1 ring-inset ring-red-500/20"
            }`}
          >
            <div className={`mt-1 h-2 w-2 flex-none rounded-full ${status === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
            <p className="font-medium">{statusMessage}</p>
          </div>
        )}

        {/* Tlačidlá Submit / Reset */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="reset"
            onClick={() => {
              setFullName("");
              setEmail("");
              setWhen("");
              setDateError(null); // Resetujeme aj dateError
              setPartySize("2");
              setSelectedSector(null);
              setSelectedTables([]);
              setTotalSeatsPicked(0);
              setNote("");
              setStatus("idle");
              setStatusMessage(null);
              setUnavailableTables([]);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            Zrušiť
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
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
        onBack={() => {
          setSectorDetailOpen(false);
          setSectorOpen(true);
        }}
        unavailableTables={unavailableTables}
        loadingUnavailable={loadingUnavailable}
      />
    </main>
  );
}