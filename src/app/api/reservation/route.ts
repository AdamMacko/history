import { NextResponse } from "next/server";
import { appendReservationRow } from "../../../lib/sheets";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY /api/reservation:", body);

    const {
      fullName,
      email,
      when,
      partySize,
      selectedSector,
      selectedTables,
      note,
    } = body as {
      fullName?: string;
      email?: string;
      when?: string;
      partySize?: number;
      selectedSector?: string | null;
      selectedTables?: string[];
      note?: string;
    };

    if (!fullName || !email || !when || !partySize || partySize < 1) {
      return NextResponse.json(
        { ok: false, error: "Chýbajú povinné údaje" },
        { status: 400 }
      );
    }

    const dt = new Date(when);
    if (Number.isNaN(dt.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Neplatný dátum/čas" },
        { status: 400 }
      );
    }

    // fullName -> Meno / Priezvisko
    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(" ");

    // formát DD.MM.RRRR a HH:MM
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");

    const dateStr = `${dd}.${mm}.${yyyy}`;
    const timeStr = `${hh}:${mi}`;

    // Sektor + stoly do jedného textu (stĺpec "Stôl")
    const tablesText =
      (selectedSector ? `${selectedSector}: ` : "") +
      (selectedTables?.length ? selectedTables.join(", ") : "");

    const row = [
      new Date().toISOString(), // A: Timestamp
      firstName,                // B: Meno
      lastName,                 // C: Priezvisko
      email,                    // D: Email
      dateStr,                  // E: Dátum
      timeStr,                  // F: Čas
      Number(partySize),        // G: Počet osôb
      tablesText,               // H: Stôl (sektor + stoly)
      note ?? "",               // I: Poznámka
    ];

    await appendReservationRow(row);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERROR /api/reservation:", err);
    return NextResponse.json(
      { ok: false, error: "Server error pri ukladaní rezervácie" },
      { status: 500 }
    );
  }
}
