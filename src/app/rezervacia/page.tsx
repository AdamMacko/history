import type { Metadata } from "next";
import ReservationForm from "./ReservationForm";

export const metadata: Metadata = {
  title: "Rezervácia",
  description: "Rezervácia stola v History Art & Music Clube",
};

export default function RezervaciaPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <header className="pb-8 md:pb-10 lg:pb-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Rezervácie</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Rezervácia stola</h1>
        <span className="mt-2 block h-[3px] w-24 rounded-full accent-underline" />
        <p className="mt-3 max-w-2xl text-stone-600">
          Vyplň krátky formulár a my sa ti ozveme s potvrdením. Číslo stola je nepovinné.
        </p>
      </header>

      <ReservationForm />

      <p className="mt-6 text-xs text-stone-500">
        Odoslaním súhlasíš so spracovaním údajov pre účely vybavenia rezervácie.
      </p>
    </main>
  );
}
