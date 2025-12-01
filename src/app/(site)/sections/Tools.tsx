"use client";

import Section from "./Section";
import Image from "next/image";
import { Stagger } from "../../components/motion";
import {
  type LucideIcon,
  Volume2,
  Lightbulb,
  Mic2,
  Tv,
  Gamepad2,
} from "lucide-react";
import { useState } from "react";

type GearItem = {
  name: string;
  img: string;    
  specs?: string[]; 
  href?: string;    
};

type Category = {
  key: string;
  label: string;
  icon: LucideIcon;
  items: GearItem[];
};

const CATEGORIES: Category[] = [
  {
    key: "sound",
    label: "Zvuk",
    icon: Volume2,
    items: [
      {
        name: "Martin Audio",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound02.webp",
        
      },
      {
        name: "Martin Audio",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound03.webp",
        
      },
       {
        name: "Soundcraft GB2",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound04.webp",
      },
       {
        name: "Soundcraft GB2",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound05.webp",
      },
       {
        name: "Soundcraft GB2",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound06.webp",
      },
       {
        name: "Lexicon MX400",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound07.webp",
      },
       {
        name: "Lexicon MX400",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound08.webp",
      },
       {
        name: "ECLER",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound09.webp",
      },
       {
        name: "ECLER",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound10.webp",
      },
       {
        name: "Martin Audio",
        img: "https://www.historyclub.sk/slideShow/sound_stage/sound11.webp",
      },
      
    ],
  },
 /* {
    key: "lights",
    label: "Svetlá",
    icon: Lightbulb,
    items: [
      {
        name: "LED & Wash",
        img: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/IMG_3560-310x207x18x0x274x207x1625815576.jpg",
        specs: ["Farebné scény", "Statické aj dynamické sety"],
      },
      {
        name: "FX & Beam",
        img: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/01-310x207x18x0x274x207x1578580883.jpg",
        specs: ["Strobo, beam, haze", "Programovanie podľa eventu"],
      },
    ],
  },*/
  {
    key: "stage",
    label: "Pódium / backline",
    icon: Mic2,
    items: [
      {
        name: "Pódium",
        img: "https://www.historyclub.sk/slideShow/sound_stage/stage01.webp",
        specs: ["Konfigurovateľné usporiadanie", "Rýchly stage setup"],
      },
    ],
  },
/*   {
   key: "video",
    label: "Projekcia",
    icon: Tv,
    items: [
      {
        name: "Veľkoplošná projekcia",
        img: "https://www.historyclub.sk/wp-content/uploads/2020/01/01.jpg",
        specs: ["Jukebox", "Hudobné & športové prenosy"],
      },
    ],
  },*/
  {
    key: "games",
    label: "Zábava",
    icon: Gamepad2,
    items: [
      {
        name: "Biliard",
        img: "https://www.historyclub.sk/slideShow/club/04.webp",
        specs: ["Udržiavaný stôl", "K dispozícii tága & gule"],
      },
    ],
  },
];

export default function Tools() {
  const [tab, setTab] = useState<string>(CATEGORIES[0].key);
  const active = CATEGORIES.find((c) => c.key === tab) ?? CATEGORIES[0];

  return (
    <Section id="tools" title="Vybavenie">
      {/* rýchle odznaky */}
      <Stagger className="mb-6 flex flex-wrap gap-2">
        {[
          "PA systém",
          "Mix",
          "Mikrofóny",
          "LED svetlá",
          "Projekcia",
          "Biliard · Šípky · Stolný futbal",
        ].map((t) => (
          <span
            key={t}
            className="rounded-full border border-stone-300 bg-white px-3 py-1 text-sm text-stone-800 shadow-sm"
          >
            {t}
          </span>
        ))}
      </Stagger>

      {/* tabs */}
      <Stagger className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const isActive = c.key === tab;
          return (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-[var(--accent-700)] text-white shadow-sm"
                  : "bg-white text-stone-800 ring-1 ring-stone-200 hover:bg-stone-50",
              ].join(" ")}
              aria-pressed={isActive}
            >
              <Icon
                className={[
                  "h-4 w-4",
                  isActive ? "text-white" : "text-[var(--accent-700)]",
                ].join(" ")}
              />
              {c.label}
            </button>
          );
        })}
      </Stagger>

      {/* obsah kategórie */}
      <Stagger key={tab} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {active.items.map((item, i) => (
          <a
            key={i}
            href={item.href ?? item.img}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <div className="p-4">
              <h3 className="text-base font-semibold text-stone-900">{item.name}</h3>
              {!!item.specs?.length && (
                <ul className="mt-2 space-y-1 text-sm text-stone-700">
                  {item.specs.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-700)]"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              <span className="mt-3 inline-block text-xs font-medium text-stone-500">
                Otvoriť fotografiu v novom okne
              </span>
            </div>
          </a>
        ))}
      </Stagger>
    </Section>
  );
}
