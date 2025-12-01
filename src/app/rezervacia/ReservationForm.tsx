"use client";

import { useState } from "react";

// pomocná funkcia: local datetime -> "YYYY-MM-DDTHH:MM"
function nowLocalInput() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function ReservationForm() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") ?? "").trim();
    const datetimeStr = String(fd.get("datetime") ?? "");
    const people = Number(fd.get("people") ?? 0);
    const table = fd.get("table"); // ⬅ pridáme aj stôl

    if (!name || !datetimeStr || !people || people < 1) {
      alert("Doplň meno, dátum a čas a počet ľudí (minimálne 1).");
      return;
    }

    const when = new Date(datetimeStr);
    if (Number.isNaN(+when) || when.getTime() < Date.now()) {
      alert("Zvoľ dátum a čas v budúcnosti.");
      return;
    }

    try {
      
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          datetime: datetimeStr,
          people,
          table: table ? String(table) : "",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Chyba pri odosielaní");
      }

      setStatus("success");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      alert("Nepodarilo sa odoslať rezerváciu, skús to prosím neskôr.");
    }
  }

  return (
    <>
      {status === "success" && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Rezervácia bola odoslaná. Ozveme sa ti s potvrdením. Ďakujeme!
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        {/* Meno (povinné) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-900">
            Meno <span className="font-normal text-stone-400">(povinné)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ján Novák"
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
          />
        </div>

        {/* Dátum a čas (povinné) */}
        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-stone-900">
            Dátum a čas <span className="font-normal text-stone-400">(povinné)</span>
          </label>
          <input
            id="datetime"
            name="datetime"
            type="datetime-local"
            required
            defaultValue={nowLocalInput()}
            min={nowLocalInput()}
            step={900} // 15 min
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
          />
        </div>

        {/* Počet ľudí */}
        <div>
          <label htmlFor="people" className="block text-sm font-medium text-stone-900">
            Počet ľudí <span className="font-normal text-stone-400">(povinné)</span>
          </label>
          <input
            id="people"
            name="people"
            type="number"
            min={1}
            max={30}
            required
            placeholder="napr. 4"
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
          />
        </div>

        {/* Číslo stola */}
        <div>
          <label htmlFor="table" className="block text-sm font-medium text-stone-900">
            Číslo stola <span className="font-normal text-stone-400">(nepovinné)</span>
          </label>
          <input
            id="table"
            name="table"
            type="number"
            min={1}
            placeholder="napr. 12"
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-accent">
            Odoslať rezerváciu
          </button>
          <a
            href="/#contact"
            className="text-sm text-stone-700 underline decoration-stone-300 hover:decoration-stone-600"
          >
            Zrušiť a späť
          </a>
        </div>
      </form>
    </>
  );
}
