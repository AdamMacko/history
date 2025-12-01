"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
};

const SLIDES: Slide[] = [
  {
    src: "https://www.historyclub.sk/slideShow/para1.webp",
    alt: "Koncert v History Art & Music Club s publikom pri pódiu",
    title: "Živé koncerty v centre Humenného",
    subtitle: "Domáce aj zahraničné kapely, klubová atmosféra a zvuk ako na veľkom stagei.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para2.webp",
    alt: "Pódium osvetlené farebnými reflektormi",
    title: "Stage pripravený na tvoje podujatie",
    subtitle: "Hudba, divadlo, stand-up alebo talkshow – techniku a svetlá máš u nás v cene.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para3.webp",
    alt: "Publikum pod pódiom počas koncertu",
    title: "Klub, kde to žije",
    subtitle: "Piatkové párty, tematické večery a plný parket až do rána.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para4.webp",
    alt: "Spevák a hudobníci na pódiu v History klube",
    title: "Priestor pre umelcov všetkých žánrov",
    subtitle: "Rock, jazz, elektronika aj alternatíva – History je otvorený novým projektom.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para5.webp",
    alt: "Detail hudobníka na pódiu pri svetlách",
    title: "Blízko k interpretom",
    subtitle: "Klubová scéna, kde publikum cíti energiu kapely z pár metrov.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para6.webp",
    alt: "Ľudia pod pódiom so zdvihnutými rukami",
    title: "Párty, na ktorú sa nezabúda",
    subtitle: "DJ sety, tanečné večery a klubový zvuk, ktorý ťa nenechá sedieť.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para7.webp",
    alt: "Pódium s osvetlením a projekciou v pozadí",
    title: "Profesionálne svetlá a projekcia",
    subtitle: "Farebné reflektory, dym a veľkoplošné plátno dotvoria atmosféru každého večera.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para8.webp",
    alt: "Hudobník na pódiu a publikum v klube",
    title: "Od kluboviek po vypredané koncerty",
    subtitle: "Vhodné pre menšie aj väčšie akcie – približne 150 miest na sedenie aj státie.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para9.webp",
    alt: "Detail publika pri pódiu v klube",
    title: "Miesto stretnutí pre ľudí z regiónu",
    subtitle: "Stretneš tu muzikantov, študentov, firmy aj lokálnu komunitu.",
  },
  {
    src: "https://www.historyclub.sk/slideShow/para10.webp",
    alt: "Záber na pódiu počas koncertu v History klube",
    title: "History – tvoj klub na kultúru a zábavu",
    subtitle: "Od koncertov a kvízov cez výstavy až po súkromné oslavy a firemné akcie.",
  },
];



const AUTOPLAY_INTERVAL = 5000; // 5 sekúndy

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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Textový overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <div className="pointer-events-auto px-6 py-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone-300">
            HISTORY ART &amp; MUSIC CLUB
          </p>
          {current.title && (
            <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {current.title}
            </h2>
          )}
          {current.subtitle && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-200 md:text-base">
              {current.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Šípky */}
      <button
        type="button"
        onClick={prev}
        className="group absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-stone-100 backdrop-blur transition hover:bg-black/80"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="group absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-stone-100 backdrop-blur transition hover:bg-black/80"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

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
