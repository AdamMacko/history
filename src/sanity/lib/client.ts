import { createClient } from "next-sanity";
import { groq } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { apiVersion, dataset, projectId } from "../env";

// -------------------------------
// Sanity client
// -------------------------------
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
});

// -------------------------------
// Image URL helper
// -------------------------------
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};


import { defineLive } from "next-sanity/live";

export const { sanityFetch, SanityLive } = defineLive({
  client,
});


export type Event = {
  _id: string;
  title: string;
  start: string; // datetime
  shortDescription?: string;
  fbUrl?: string;
  ticketsUrl?: string;
  posterUrl?: string | null;
};

export async function fetchUpcomingEvents(): Promise<Event[]> {

  const query = groq`
    *[_type == "event" && !(_id in path("drafts.**"))]
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

  return client.fetch<Event[]>(query);
}
