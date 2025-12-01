import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

export async function appendReservationRow(values: (string | number | null)[]) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
console.log("SHEET ID:", process.env.GOOGLE_SHEETS_SPREADSHEET_ID);

  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEETS_SPREADSHEET_ID");
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "rezervacie!A:Z", 
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });
}
