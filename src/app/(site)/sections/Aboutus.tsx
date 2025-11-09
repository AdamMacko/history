import Section from "./Section";
import { Music, Mic2, Film, Palette, Briefcase, Users, Target, Tv } from "lucide-react";
import { Stagger, FadeIn } from "../../components/motion";

export default function Aboutus() {
  const events = [
    "koncerty",
    "párty",
    "jam session",
    "súťaže",
    "workshopy",
    "výstavy",
    "prednášky",
    "firemné akcie",
    "oslavy",
    "stretnutia spolužiakov",
    "iné podľa dohody",
  ];

  const amenities = [
    { icon: Music,     label: "Multifunkčný priestor so špičkovým ozvučením a svetlami" },
    { icon: Film,      label: "Veľkoplošná projekcia — jukebox, hudobné a športové prenosy" },
    { icon: Target,    label: "Biliard, šípky a stolný futbal" },
    { icon: Users,     label: "Kapacita pre rôzne typy podujatí v širšom regióne" },
    { icon: Mic2,      label: "Pódium pripravené na hudbu, divadlo, film, tanec či prednášky" },
    { icon: Briefcase, label: "Firemné večierky a uzavreté eventy" },
  ];

  return (
    <Section id="aboutus">
      <FadeIn>
        <div className="grid items-start gap-10 md:grid-cols-12">
          {/* Ľavý stĺpec – text */}
          <div className="md:col-span-7 lg:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
              HISTORY ART &amp; MUSIC CLUB
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Priestor pre umenie v&nbsp;komplexnej podobe
            </h1>

            <p className="mt-5 max-w-3xl leading-relaxed text-stone-700">
              Myšlienkou, ktorá inšpirovala vznik History Art &amp; Music Club, bola snaha o vytvorenie
              priestoru pre umenie v&nbsp;komplexnej podobe. V&nbsp;Humennom si u nás vychutnáte
              zážitky z&nbsp;hudby, divadla, filmu, tanca, výtvarného umenia a čohokoľvek zaujímavého.
            </p>

            <p className="mt-4 max-w-3xl leading-relaxed text-stone-700">
              Svojou kapacitou a zvukovým vybavením patríme medzi málo miest v širšom regióne,
              ktoré ponúkajú skutočne multifunkčný priestor vhodný pre rôzne podujatia.
            </p>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-stone-900">Organizujeme</h3>

              {/* chipy so stagger animáciou */}
              <Stagger className="mt-3 flex flex-wrap gap-2">
                {events.map((e) => (
                  <span
                    key={e}
                    className="inline-block rounded-full border border-stone-300 bg-white px-3 py-1 text-sm text-stone-800 shadow-sm"
                  >
                    {e}
                  </span>
                ))}
              </Stagger>
            </div>
          </div>

          {/* Pravý stĺpec – box s vybavením */}
          <div className="md:col-span-5 lg:col-span-4">
            <FadeIn>
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-base font-semibold">
                  <Palette className="h-5 w-5 text-accent" />
                  V klube nájdete
                </h3>
                <ul className="mt-4 space-y-3">
                  {amenities.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 flex-none text-accent" />
                      <span className="text-stone-700">{label}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3">
                    <Tv className="mt-0.5 h-5 w-5 flex-none text-accent" />
                    <span className="text-stone-700">
                      Na veľkoplošnom plátne sledujete videá, športové či hudobné prenosy.
                    </span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
