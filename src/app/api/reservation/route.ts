import { NextResponse } from "next/server";
import {
  appendReservationRow,
  getReservedTablesForDate,
} from "../../../lib/sheets";
import { sendReservationEmails } from "../../../lib/mail";

export const runtime = "nodejs"; // dôležité pre nodemailer

const CUTOFF_BOOKING_HOUR = 19;
const CUTOFF_BOOKING_MINUTE = 30;

const MAX_ARRIVAL_HOUR = 21;
const MAX_ARRIVAL_MINUTE = 30;

const MAX_PEOPLE = 16;
const MAX_TABLES = 2;

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

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

    // základná validácia
    if (!fullName || !email || !when || !partySize || partySize < 1) {
      return NextResponse.json(
        { ok: false, error: "Chýbajú povinné údaje." },
        { status: 400 }
      );
    }

    if (partySize > MAX_PEOPLE) {
      return NextResponse.json(
        {
          ok: false,
          error: `Maximálny počet ľudí na jednu rezerváciu je ${MAX_PEOPLE}.`,
        },
        { status: 400 }
      );
    }

    if (selectedTables && selectedTables.length > MAX_TABLES) {
      return NextResponse.json(
        {
          ok: false,
          error: `Na jednu rezerváciu je možné zvoliť najviac ${MAX_TABLES} stoly.`,
        },
        { status: 400 }
      );
    }

    const dt = new Date(when);
    if (Number.isNaN(dt.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Neplatný dátum/čas." },
        { status: 400 }
      );
    }

    const now = new Date();

    // 0) rezervačný čas nesmie byť v minulosti
    if (dt.getTime() < now.getTime()) {
      return NextResponse.json(
        { ok: false, error: "Rezerváciu nie je možné vytvoriť do minulosti." },
        { status: 400 }
      );
    }

    // 1) globálny limit príchodu – najneskôr 21:30 (pre akýkoľvek deň)
    {
      const selectedMinutes = dt.getHours() * 60 + dt.getMinutes();
      const maxArrivalMinutes =
        MAX_ARRIVAL_HOUR * 60 + MAX_ARRIVAL_MINUTE;

      if (selectedMinutes > maxArrivalMinutes) {
        return NextResponse.json(
          {
            ok: false,
            error: "Najneskorší čas príchodu na rezervovaný stôl je 21:30.",
          },
          { status: 400 }
        );
      }
    }

    // 2) špeciálne pravidlo pre dnešok – rezervovať na DNES sa dá len do 19:30
    if (isSameCalendarDay(dt, now)) {
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
        return NextResponse.json(
          {
            ok: false,
            error:
              "Na dnešný večer je možné rezervovať najneskôr do 19:30.",
          },
          { status: 400 }
        );
      }
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

    // 3) KONTROLA OBSADENÝCH STOLOV NA DANÝ DEŇ (Google Sheets)
    if (selectedTables && selectedTables.length > 0) {
      const reserved = await getReservedTablesForDate(dateStr);
      const conflict = selectedTables.filter((t) => reserved.has(t));

      if (conflict.length > 0) {
        return NextResponse.json(
          {
            ok: false,
            error:
              conflict.length === 1
                ? `Stôl ${conflict[0]} je už na tento deň rezervovaný.`
                : `Stoly ${conflict.join(", ")} sú už na tento deň rezervované.`,
          },
          { status: 409 }
        );
      }
    }

    // Sektor + stoly do jedného textu (stĺpec "Stôl" v Sheets)
    const tablesText =
      (selectedSector ? `${selectedSector}: ` : "") +
      (selectedTables?.length ? selectedTables.join(", ") : "");

    const row: (string | number | null)[] = [
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

    // 4) POSLAŤ POTVRDZUJÚCI MAIL (user + kópia pre klub)
    try {
      await sendReservationEmails({
        email,
        fullName,
        dateStr,
        timeStr,
        partySize,
        tablesText,
        note,
      });
    } catch (mailErr) {
      console.error("ERROR pri posielaní potvrdzujúceho emailu:", mailErr);
      // rezervácia je zapísaná, mail môže zlyhať bez 500-ky
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERROR /api/reservation:", err);
    return NextResponse.json(
      { ok: false, error: "Server error pri ukladaní rezervácie." },
      { status: 500 }
    );
  }
}
