// src/lib/sanity.client.ts
import {createClient} from '@sanity/client'
import {apiVersion, dataset, projectId} from '@/sanity/env'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export type Event = {
  _id: string
  title: string
  start: string
  shortDescription?: string
  fbUrl?: string
  ticketsUrl?: string
  posterUrl?: string
}

export async function fetchUpcomingEvents(): Promise<Event[]> {
  const query = `
    *[_type == "event" && defined(start)]
      | order(start asc)[0...50]{
        _id,
        title,
        start,
        shortDescription,
        fbUrl,
        ticketsUrl,
        "posterUrl": poster.asset->url
      }
  `
  return sanityClient.fetch(query)
}