import Section from "./Section";
import Image from "next/image";
import Link from "next/link";
import { Stagger, FadeIn } from "../../components/motion";

type Partner = {
  name: string;
  logo: string;
  href: string; 
};

const PARTNERS: Partner[] = [
  {
    name: "Partner 1",
    logo: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/FPU_logo1_modre-scaled-966x724x0x177x966x369x1580910669.jpg",
    href: "https://www.fpu.sk/sk/",
  },
  {
    name: "Partner 2",
    logo: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/Asset-1@2x-185x185x0x0x185x185x1580913101.png",
    href: "https://www.partner2.sk/",
  },
  {
    name: "Partner 3",
    logo: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/greco-logo-dark-281x105x0x0x281x105x1580911067.png",
    href: "https://www.grecoreklama.sk/",
  },
  {
    name: "Partner 4",
    logo: "https://www.historyclub.sk/wp-content/uploads/brizy/imgs/KOFOLA_LOGO-248x188x0x1x248x186x1676923457.jpg",
    href: "https://www.kofola.sk/",
  },
];

export default function Partners() {
  const [FEATURED, ...OTHERS] = PARTNERS;

  return (
    <Section id="partners" title="Partneri" kicker="Ďakujeme" center>
      
      <FadeIn>
        <Link
          href={FEATURED.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={FEATURED.name}
          className="group mx-auto mb-6 flex w-full max-w-3xl items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition hover:shadow-md md:p-10"
        >
          <div className="relative aspect-[3/2] w-full max-w-[420px] md:max-w-[520px]">
            <Image
              src={FEATURED.logo}
              alt={FEATURED.name}
              fill
              className="object-contain brightness-95 grayscale transition duration-300 group-hover:grayscale-0 group-hover:brightness-100"
              unoptimized
              sizes="(max-width: 768px) 90vw, 520px"
            />
          </div>
        </Link>
      </FadeIn>

    
      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {OTHERS.map((p) => (
          <Link
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            aria-label={p.name}
          >
            <div className="relative aspect-[3/2] w-full max-w-[220px]">
              <Image
                src={p.logo}
                alt={p.name}
                fill
                className="object-contain brightness-95 grayscale transition duration-300 group-hover:grayscale-0 group-hover:brightness-100"
                unoptimized
                sizes="(max-width: 768px) 45vw, 25vw"
              />
            </div>
          </Link>
        ))}
      </Stagger>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-700">
        Chceš sa stať partnerom History? Napíš nám do{" "}
        <a href="#contact" className="underline">kontaktu</a> – radi sa ozveme späť.
      </div>
    </Section>
  );
}
