// src/sanity/lib/events.ts
import { groq } from "next-sanity";
import { client } from "./client";

export type Event = {
  _id: string;
  title: string;
  start: string;
  shortDescription?: string;
  fbUrl?: string;
  ticketsUrl?: string;
  posterUrl?: string | null;
};

// Zoberie všetky publikované dokumenty typu "event"
const EVENTS_QUERY = groq`
  *[
    _type == "event"
    && !(_id in path("drafts.**"))
  ]
  | order(start asc)
  {
    _id,
    title,
    start,
    shortDescription,
    fbUrl,
    ticketsUrl,
    "posterUrl": poster.asset->url
  }
`;

export async function fetchUpcomingEvents(): Promise<Event[]> {
  const events = await client.fetch<Event[]>(EVENTS_QUERY);

  if (process.env.NODE_ENV !== "production") {
    console.log("SANITY events loaded:", events.length);
  }

  return events;
}
