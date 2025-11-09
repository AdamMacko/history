import Section from "./Section";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Stagger } from "../../components/motion";

type ProgramItem = {
  title: string;
  date: string;
  time?: string;
  desc: string;
  poster: string;      // URL obrázka plagátu (dočasne z ich webu)
  posterHref?: string; // voliteľne – hi-res/plná verzia, inak sa použije poster
  fbHref?: string;     // voliteľne – FB event
  ticketsHref?: string;// voliteľne – vstupenky/predpredaj
};

const PROGRAM: ProgramItem[] = [
  {
    title: "Koncert: Example Band",
    date: "Piatok 29. 11. 2025",
    time: "20:00",
    desc:
      "Energetický set s prienikom rocku a elektroniky. Support: Local DJs. Vstup od 18 rokov.",
    poster: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/halloween-scaled-484x681x1x0x481x681x1761654531.jpg",
    posterHref: "https://picsum.photos/seed/posterA/2000/2800",
    fbHref: "https://www.facebook.com/",
    ticketsHref: "https://goout.net/",
  },
  {
    title: "Party Night: House / Disco / Funk",
    date: "Sobota 30. 11. 2025",
    time: "21:00",
    desc:
      "Tanečný večer v znamení house a nu-disco. DJ lineup doplníme čoskoro. Happy hour 21:00–22:00.",
    poster: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/jalovica-scaled-481x681x0x0x481x681x1759390866.jpg",
    posterHref: "https://picsum.photos/seed/posterB/2000/2800",
    fbHref: "https://www.facebook.com/",
    ticketsHref: "https://tootoot.fm/",
  },
];

export default function Program() {
  return (
    <Section
      id="program"
      title="Program"
      kicker="Najbližšie podujatia"
      description="Hudba, párty, divadlo a ďalšie akcie v History."
    >
      <Stagger className="space-y-8">
        {PROGRAM.map((ev, i) => {
          const reverse = i % 2 === 1; // každý druhý event prehodí poradie na md+
          return (
            <article
              key={ev.title + ev.date}
              className={[
                "grid gap-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm",
                "md:grid-cols-12 md:p-6",
              ].join(" ")}
            >
              {/* Plagát */}
              <a
                href={ev.posterHref ?? ev.poster}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  "group relative overflow-hidden rounded-xl ring-1 ring-stone-200",
                  reverse ? "md:order-2 md:col-span-5" : "md:col-span-5",
                ].join(" ")}
                aria-label={`Otvoriť plagát – ${ev.title}`}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={ev.poster}
                    alt={`Plagát – ${ev.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-stone-800 ring-1 ring-stone-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Otvoriť plagát <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>

              {/* Popis */}
              <div className={reverse ? "md:order-1 md:col-span-7" : "md:col-span-7"}>
                <h3 className="text-xl font-semibold text-stone-900">{ev.title}</h3>
                <p className="mt-1 text-sm text-stone-600">
                  {ev.date}
                  {ev.time ? ` · ${ev.time}` : ""}
                </p>
                <p className="mt-4 leading-relaxed text-stone-700">{ev.desc}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {/* 2. link na plagát (tlačidlo) */}
                  <a
                    href={ev.posterHref ?? ev.poster}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Plagát
                  </a>

                  {ev.fbHref && (
                    <a
                      href={ev.fbHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
                    >
                      FB event
                    </a>
                  )}

                  {ev.ticketsHref && (
                    <a
                      href={ev.ticketsHref}
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
      </Stagger>

      {/* Poznámka k programu */}
      <p className="mt-6 text-sm text-stone-600">
        Program sa môže meniť podľa dostupnosti interpretov a techniky. Sleduj nás na sociálnych sieťach pre najnovšie info.
      </p>
    </Section>
  );
}
