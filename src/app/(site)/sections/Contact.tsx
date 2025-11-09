import Section from "./Section";
import { Phone, Mail, MapPin, Clock, UserRound, Volume2 } from "lucide-react";
import { Stagger, FadeIn } from "../../components/motion";

const OPERATOR = {
  company: "History Art & Music Club (prevádzkovateľ)",
  name: "Meno Prevádzkovateľa",
  ico: "IČO: —",
  dic: "DIČ: —",
  email: "info@historyclub.sk",
  phoneDisplay: "+421 000 000 000",
  phone: "+421000000000",
  addressLine1: "— ulica a číslo",
  addressLine2: "066 01 Humenné",
};

const SOUND_ENGINEER = {
  role: "Zvukár / technik",
  name: "Meno Priezvisko",
  email: "sound@historyclub.sk",
  phoneDisplay: "+421 000 000 000",
  phone: "+421000000000",
};

const HOURS: { day: string; open: string; note?: string }[] = [
  { day: "Pondelok – Štvrtok", open: "—", note: "podľa programu" },
  { day: "Piatok", open: "20:00 – 03:00" },
  { day: "Sobota", open: "20:00 – 03:00" },
  { day: "Nedeľa", open: "—", note: "podľa programu" },
];

// Zmeň na reálnu adresu (alebo vlož Google Maps Place embed)
const MAP_QUERY = `${OPERATOR.addressLine1}, ${OPERATOR.addressLine2}`;
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

export default function Contact() {
  return (
    <Section id="contact" title="Kontakt" kicker="Rezervácie & informácie">
      <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Prevádzkovateľ */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <UserRound className="h-5 w-5 text-accent" />
            Prevádzkovateľ
          </h3>
          <div className="mt-4 space-y-2 text-stone-800">
            <p className="font-medium">{OPERATOR.company}</p>
            <p>{OPERATOR.name}</p>
            <p className="text-stone-700">
              {OPERATOR.addressLine1} <br /> {OPERATOR.addressLine2}
            </p>
            <p className="text-sm text-stone-600">
              {OPERATOR.ico} {OPERATOR.dic ? "· " + OPERATOR.dic : ""}
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <a
              href={`mailto:${OPERATOR.email}`}
              className="inline-flex items-center gap-2 underline decoration-stone-300 hover:decoration-stone-600"
            >
              <Mail className="h-4 w-4" /> {OPERATOR.email}
            </a>
            <br />
            <a
              href={`tel:${OPERATOR.phone}`}
              className="inline-flex items-center gap-2 underline decoration-stone-300 hover:decoration-stone-600"
            >
              <Phone className="h-4 w-4" /> {OPERATOR.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Zvukár / technik */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Volume2 className="h-5 w-5 text-accent" />
            {SOUND_ENGINEER.role}
          </h3>
          <div className="mt-4 space-y-2 text-stone-800">
            <p className="font-medium">{SOUND_ENGINEER.name}</p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <a
              href={`mailto:${SOUND_ENGINEER.email}`}
              className="inline-flex items-center gap-2 underline decoration-stone-300 hover:decoration-stone-600"
            >
              <Mail className="h-4 w-4" /> {SOUND_ENGINEER.email}
            </a>
            <br />
            <a
              href={`tel:${SOUND_ENGINEER.phone}`}
              className="inline-flex items-center gap-2 underline decoration-stone-300 hover:decoration-stone-600"
            >
              <Phone className="h-4 w-4" /> {SOUND_ENGINEER.phoneDisplay}
            </a>
          </div>

          <a
            href={`tel:${OPERATOR.phone}`}
            className="btn-accent mt-5 inline-flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Rezervovať termín
          </a>
        </div>

        {/* Otváracie hodiny */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Clock className="h-5 w-5 text-accent" />
            Otváracie hodiny
          </h3>
          <ul className="mt-4 divide-y divide-stone-200 text-sm">
            {HOURS.map(({ day, open, note }) => (
              <li key={day} className="flex items-center justify-between gap-4 py-2">
                <span className="text-stone-800">{day}</span>
                <span className="font-medium text-stone-900">{open}</span>
                {note && (
                  <span className="ml-2 text-xs text-stone-600">{note}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-stone-600">
            Presné časy sa riadia programom podujatí.
          </p>
        </div>

        {/* Mapa + adresa */}
        <FadeIn>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:col-span-3">
            <div className="flex items-center gap-2 border-b border-stone-200 px-6 py-4">
              <MapPin className="h-5 w-5 text-accent" />
              <div className="text-sm">
                <div className="font-semibold text-stone-900">Adresa</div>
                <div className="text-stone-700">
                  {OPERATOR.addressLine1}, {OPERATOR.addressLine2}
                </div>
              </div>
            </div>
            <div className="aspect-[16/8] w-full">
              <iframe
                title="Mapa – History Art & Music Club"
                src={MAP_EMBED_SRC}
                loading="lazy"
                className="h-full w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </FadeIn>
      </Stagger>
    </Section>
  );
}
