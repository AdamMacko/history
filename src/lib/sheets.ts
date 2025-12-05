import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

// ↙ použijeme jeden range na čítanie aj zápis
const SHEET_RANGE = "rezervacie!A:Z";

export async function appendReservationRow(values: (string | number | null)[]) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  console.log("SHEET ID:", spreadsheetId);

  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEETS_SPREADSHEET_ID");
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: SHEET_RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });
}

/**
 * Vráti množinu stolov (napr. "T27", "T2"...), ktoré sú už na daný deň obsadené.
 * dateStr musí byť vo formáte DD.MM.RRRR – presne ako ho zapisuješ do stĺpca DÁTUM (E).
 */
export async function getReservedTablesForDate(
  dateStr: string
): Promise<Set<string>> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEETS_SPREADSHEET_ID");
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: SHEET_RANGE,
  });

  const values = res.data.values ?? [];
  const reserved = new Set<string>();

  // predpoklad: 1. riadok = hlavička → začíname od indexu 1
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row) continue;

    const rowDate = row[4]; // E: Dátum (DD.MM.RRRR) – podľa tvojho zápisu
    if (rowDate !== dateStr) continue;

    const tablesColRaw = row[7]; // H: Stôl (napr. "F: T27, T28")
    if (!tablesColRaw) continue;

    const tablesCol = String(tablesColRaw).trim();
    if (!tablesCol) continue;

    // odstránime sektor "F: " → necháme len "T27, T28"
    const afterColon = tablesCol.includes(":")
      ? tablesCol.split(":").slice(1).join(":")
      : tablesCol;

    afterColon
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((t) => reserved.add(t));
  }

  return reserved;
}
