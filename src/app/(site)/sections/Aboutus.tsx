import Section from "./Section";
import { Music, Mic2, Film, Palette, Briefcase, Users, Target, Tv } from "lucide-react";
import { Stagger, FadeIn } from "../../components/motion";

export default function Aboutus() {


  const amenities = [
    { icon: Music,     label: "Multifunkčný priestor so špičkovým ozvučením a svetlami" },
    { icon: Film,      label: "Veľkoplošná projekcia — hudobné a športové prenosy" },
    { icon: Target,    label: "Biliard, šípky a stolný futbal" },
    { icon: Users,     label: "Kapacita pre rôzne typy podujatí v širšom regióne" },
    { icon: Mic2,      label: "Pódium pripravené na hudbu, divadlo, film, tanec či prednášky" },
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
              Všetci tvoríme jeden príbeh
            </h1>

            <p className="mt-5 max-w-3xl leading-relaxed text-stone-700">
              History Art &amp; Music Club je hudobný klub v širšom centre Humenného, v ktorom
              pravidelne organizujeme koncerty, kvízy, piatkové párty s lokálnymi DJ-mi, divadelné
              predstavenia, filmové, hudobné a športové prenosy, besedy, prednášky, aj výstavy.
              Hlavná časť klubu disponuje kapacitou cce 150 miest s možnosťou online rezervácie.
              Pre súkromné oslavy a stretnutia v uzavretom priestore ponúkame backstage s kapacitou
              do 20 osôb.
            </p>

            <p className="mt-4 max-w-3xl leading-relaxed text-stone-700">
              Už päť rokov po sebe čapujeme pivo ocenené Hviezdou Sládkov. V našej ponuke nájdete
              alko, nealko aj miešané nápoje, ako aj výber vín zo starostlivo zostavenej vínnej
              karty someliérom so slovenskými aj svetovými vínami. Nechýba ani vodná fajka s
              možnosťou výberu renomovaných shisha tabakov alebo beznikotínových náplní. Zahrať si
              u nás môžete biliard, stolný futbal, šípky, spoločenské hry.
            </p>

            <p className="mt-4 max-w-3xl leading-relaxed text-stone-700">
              V History zažijete výnimočnú atmosféru každý deň – od veľkých koncertov až po malé
              stretnutia v bežných dňoch!
            </p>

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
