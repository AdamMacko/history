// app/rezervacia/actions.ts
"use server";

import { client } from "@/sanity/lib/client";

export async function getBlockedDates(): Promise<string[]> {
  try {
    const query = `*[_type == "event" && blockReservations == true].start`;
    const dates: (string | null)[] = await client.fetch(query);
    
    // Získame iba formát "YYYY-MM-DD"
    return dates
      .filter((d): d is string => d !== null && d !== undefined)
      .map(d => d.split("T")[0]);
  } catch (err) {
    console.error("Nepodarilo sa načítať blokované dátumy zo Sanity:", err);
    return [];
  }
}