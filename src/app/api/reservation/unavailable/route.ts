import { NextResponse } from "next/server";
import { getReservedTablesForDate } from "../../../../lib/sheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { when } = body as { when?: string };

    if (!when) {
      return NextResponse.json(
        { ok: false, error: "Chýba dátum/čas (when)." },
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

    // rovnaký formát ako v hlavnom route: DD.MM.RRRR
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const dateStr = `${dd}.${mm}.${yyyy}`;

    const reservedSet = await getReservedTablesForDate(dateStr);
    const tables = Array.from(reservedSet);

    return NextResponse.json({ ok: true, tables });
  } catch (err) {
    console.error("ERROR /api/reservation/unavailable:", err);
    return NextResponse.json(
      { ok: false, error: "Server error pri načítaní obsadených stolov." },
      { status: 500 }
    );
  }
}
