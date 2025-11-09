"use client";

import Section from "./Section";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Stagger, FadeIn } from "../../components/motion";


type Photo = {
  src: string;   // URL obrázka (dočasne z webu History)
  alt: string;   // krátky popis pre a11y/SEO
  href?: string; // voliteľne – ak chceš linknúť na stránku eventu, inak sa použije src
};

const PHOTOS: Photo[] = [
  // TODO: nahraď tieto URL za reálne linky z historyclub.sk
  { src: "https://www.historyclub.sk/wp-content/uploads/2020/01/03.jpg", alt: "Koncert – atmosféra" },
  { src: "https://www.historyclub.sk/wp-content/uploads/2020/01/04.jpg", alt: "Pódium a svetlá" },
  { src: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/01-310x207x18x0x274x207x1578580883.jpg", alt: "Tanečný parket" },
  { src: "https://www.historyclub.sk/wp-content/uploads/2020/01/02.jpg", alt: "DJ set" },
  { src: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/06-310x207x18x0x274x207x1578581476.jpg", alt: "Jam session" },
  { src: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/05-310x207x18x0x274x207x1578581445.jpg", alt: "Výstava & performance" },
  { src: "https://www.historyclub.sk/wp-content/uploads/2020/01/07.jpg", alt: "Publikum" },
  { src: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/09-small-310x206x18x0x274x206x1578581604.jpg", alt: "Svetelný dizajn" },
  { src: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/10-310x207x18x0x274x207x1578582303.jpg", alt: "Detail pódia" },
];

export default function Gallery() {
  return (
    <Section id="gallery" title="Galéria" center description="Momentky z podujatí.">
      

      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {PHOTOS.map((p, i) => (
          <a
            key={i}
            href={p.href ?? p.src}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200 shadow-sm"
            aria-label={p.alt}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                // Kým nepovolíme doménu v next.config, nech to nerieši optimalizáciu
                unoptimized
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>

            {/* hover overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-stone-800 ring-1 ring-stone-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Otvoriť <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        ))}
      </Stagger>
    </Section>
  );
}
