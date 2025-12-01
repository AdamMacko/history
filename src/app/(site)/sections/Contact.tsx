"use client";

import Section from "./Section";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  UserRound,
  Volume2,
  Car,
  Navigation,
} from "lucide-react";
import { Stagger, FadeIn } from "../../components/motion";

const OPERATOR = {
  company: "History Art & Music Club",
  name: "Igor Lebloch",
  email: "info@historyclub.sk",
  phoneDisplay: "0918 538 954",
  phone: "0918 538 954",
  addressLine1: "Štefánikova 27",
  addressLine2: "066 01 Humenné",
};

const SOUND_ENGINEER = {
  role: "Zvukár / technik",
  name: "SULY",
  phoneDisplay: "0905 284 137",
  phone: "0905 284 137",
};

const HOURS: { day: string; open: string; note?: string }[] = [
  { day: "Pondelok – Štvrtok", open: "16:00 - 22:30"},
  { day: "Piatok", open: "16:00 – 01:00" },
  { day: "Sobota", open: "16:00 – 01:00" },
  { day: "Nedeľa", open: "16:00 - 22:30"},
];


const MAP_QUERY = `${OPERATOR.addressLine1}, ${OPERATOR.addressLine2}`;
const MAP_EMBED_SRC = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d383.40081570143155!2d21.904933565491884!3d48.933675569705265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDjCsDU2JzAxLjYiTiAyMcKwNTQnMTguNSJF!5e1!3m2!1ssk!2ssk!4v1762727766603!5m2!1ssk!2ssk";


const DEST = {
  name: "History Art & Music Club",
  address: `${OPERATOR.addressLine1}, ${OPERATOR.addressLine2}`,
  lat: 48.9337898642935,
  lng: 21.905137715923907, 
};

const HAS_COORDS = Number.isFinite(DEST.lat) && Number.isFinite(DEST.lng);

const GMAPS_DIR = HAS_COORDS
  ? `https://www.google.com/maps/dir/?api=1&destination=${DEST.lat},${DEST.lng}`
  : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      DEST.address
    )}`;

const APPLE_DIR = HAS_COORDS
  ? `https://maps.apple.com/?daddr=${DEST.lat},${DEST.lng}&dirflg=d`
  : `https://maps.apple.com/?daddr=${encodeURIComponent(
      DEST.address
    )}&dirflg=d`;

const WAZE_DIR = HAS_COORDS
  ? `https://waze.com/ul?ll=${DEST.lat}%2C${DEST.lng}&navigate=yes`
  : `https://waze.com/ul?q=${encodeURIComponent(
      DEST.address
    )}&navigate=yes`;

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
            <br />
            <a
              href={`tel:${SOUND_ENGINEER.phone}`}
              className="inline-flex items-center gap-2 underline decoration-stone-300 hover:decoration-stone-600"
            >
              <Phone className="h-4 w-4" /> {SOUND_ENGINEER.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Otváracie hodiny */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Clock className="h-5 w-5 text-accent" />
            Otváracie hodiny
          </h3>
          <ul className="mt-4 divide-y divide-stone-200 text-sm">
            {HOURS.map(({ day, open, note }) => (
              <li
                key={day}
                className="flex items-center justify-between gap-4 py-2"
              >
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

{/* ŠIROKÁ mapa cez všetky stĺpce, tlačidlá NAD mapou v jednom riadku */}
<FadeIn>
  <div className="col-span-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
    <div className="border-b border-stone-200 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-base font-semibold text-stone-900">Navigovať</h4>
          <p className="mt-1 text-sm text-stone-600">
            {OPERATOR.addressLine1}, {OPERATOR.addressLine2}
          </p>
        </div>

        {/* tlačidlá v RIADKU (wrap na malých šírkach) */}
        <div className="flex flex-row flex-wrap items-center gap-2">
          <a
            href={GMAPS_DIR}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-[15px] md:text-base font-semibold text-white shadow-sm transition hover:brightness-110"
            style={{ backgroundColor: "#1A73E8" }}
          >
            <MapPin size={18} />
            Google Maps
          </a>

          <a
            href={APPLE_DIR}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-[15px] md:text-base font-semibold text-white bg-black shadow-sm transition hover:brightness-110"
          >
            <Navigation size={18} />
            Apple Maps
          </a>

          <a
            href={WAZE_DIR}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-[15px] md:text-base font-semibold text-white shadow-sm transition hover:brightness-110"
            style={{ backgroundColor: "#33CCFF" }}
          >
            <Car size={18} />
            Waze
          </a>
        </div>
      </div>
    </div>

    {/* ŠIRŠIA, nie vyššia – výšku držíme rozumnú */}
    <div className="h-[360px] md:h-[420px] w-full">
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
