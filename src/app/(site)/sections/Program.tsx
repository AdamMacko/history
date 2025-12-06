import Section from "./Section";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { fetchUpcomingEvents, Event } from "@/lib/sanity.client";

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  })
    .format(d)
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatTimeLabel(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function Program() {
  const events: Event[] = await fetchUpcomingEvents();

  return (
    <Section
      id="program"
      title="Program"
      kicker="Najbližšie podujatia"
      description="Hudba, párty, divadlo a ďalšie akcie v History."
    >
      {events.length === 0 ? (
        <p className="text-sm text-stone-600">
          Momentálne nemáme žiadne naplánované podujatia. Sleduj nás na sociálnych sieťach pre najnovšie info.
        </p>
      ) : (
     
        <div className="space-y-8">
          {events.map((ev, i) => {
            const reverse = i % 2 === 1;
            const dateLabel = formatDateLabel(ev.start);
            const timeLabel = formatTimeLabel(ev.start);

            return (
              <article
                key={ev._id}
                className={[
                  "grid gap-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm",
                  "md:grid-cols-12 md:p-6",
                ].join(" ")}
              >
                {/* Plagát */}
                {ev.posterUrl && (
                  <a
                    href={ev.posterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      "group relative overflow-hidden rounded-xl ring-1 ring-stone-200",
                      reverse ? "md:order-2 md:col-span-5" : "md:col-span-5",
                    ].join(" ")}
                    aria-label={`Otvoriť plagát – ${ev.title}`}
                  >
                    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-none">
                      <div className="relative aspect-[2/3] sm:aspect-[3/4]">
                        <Image
                          src={ev.posterUrl}
                          alt={`Plagát – ${ev.title}`}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 90vw, 40vw"
                        />
                      </div>
                    </div>

                    <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-stone-800 ring-1 ring-stone-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Otvoriť plagát <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </a>
                )}

                {/* Popis */}
                <div className={reverse ? "md:order-1 md:col-span-7" : "md:col-span-7"}>
                  <h3 className="text-xl font-semibold text-stone-900">{ev.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">
                    {dateLabel} · {timeLabel}
                  </p>
                  {ev.shortDescription && (
                    <p className="mt-4 leading-relaxed text-stone-700 whitespace-pre-line break-words">
                      {ev.shortDescription}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {ev.posterUrl && (
                      <a
                        href={ev.posterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Plagát
                      </a>
                    )}

                    {ev.fbUrl && (
                      <a
                        href={ev.fbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
                      >
                        FB event
                      </a>
                    )}

                    {ev.ticketsUrl && (
                      <a
                        href={ev.ticketsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent inline-flex items-center gap-2"
                      >
                        Vstupenky
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-sm text-stone-600">
        Program sa môže meniť podľa dostupnosti interpretov a techniky. Sleduj nás na sociálnych sieťach pre najnovšie info.
      </p>
    </Section>
  );
}
