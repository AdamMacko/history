"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
};

const SLIDES: Slide[] = [
  {
    src: "https://www.historyclub.sk/slideShow/para1.webp",
    alt: "Koncert v History Art & Music Club s publikom pri pódiu",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para2.webp",
    alt: "Pódium osvetlené farebnými reflektormi",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para3.webp",
    alt: "Publikum pod pódiom počas koncertu",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para4.webp",
    alt: "Spevák a hudobníci na pódiu v History klube",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para5.webp",
    alt: "Detail hudobníka na pódiu pri svetlách",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para6.webp",
    alt: "Ľudia pod pódiom so zdvihnutými rukami",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para7.webp",
    alt: "Pódium s osvetlením a projekciou v pozadí",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para8.webp",
    alt: "Hudobník na pódiu a publikum v klube",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para9.webp",
    alt: "Detail publika pri pódiu v klube",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para10.webp",
    alt: "Záber na pódiu počas koncertu v History klube",
  },
];


const AUTOPLAY_INTERVAL = 5000; // 5 sekúnd

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  function next() {
    setIndex((prev) => (prev + 1) % SLIDES.length);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }

  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const current = SLIDES[index];

  return (
    <section className="relative mx-auto mb-12 mt-6 max-w-6xl overflow-hidden rounded-3xl border border-stone-200 bg-black/80 shadow-lg">
      {/* Obrázok */}
      <div className="relative h-[230px] w-full md:h-[320px] lg:h-[380px]">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority
          className="object-cover opacity-80"
        />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
      </div>

    
            {/* Textový overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end">
        <div className="pointer-events-auto px-6 py-4 text-right md:px-10 md:py-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone-300">
            HISTORY ART &amp; MUSIC CLUB
          </p>
        </div>
      </div>


      {/* Bulky dole */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 backdrop-blur">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}