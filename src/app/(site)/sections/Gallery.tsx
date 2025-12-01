"use client";

import Section from "./Section";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Stagger, FadeIn } from "../../components/motion";


type Photo = {
  src: string; 
  alt: string;
  href?: string; 
};

const PHOTOS: Photo[] = [
  { src: "https://www.historyclub.sk/slideShow/club/01.webp", alt: "Koncert – atmosféra" },
  { src: "https://www.historyclub.sk/slideShow/club/05.webp", alt: "Pódium a svetlá" },
  { src: "https://www.historyclub.sk/slideShow/club/03.webp", alt: "Tanečný parket" },
  { src: "https://www.historyclub.sk/slideShow/club/04.webp", alt: "DJ set" },
  { src: "https://www.historyclub.sk/slideShow/club/02.webp", alt: "Jam session" },
];

export default function Gallery() {
  return (
    <Section id="gallery" title="Galéria" center description="Club">
      

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
