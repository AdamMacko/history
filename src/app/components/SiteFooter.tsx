// src/app/components/SiteFooter.tsx

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-stone-500 sm:flex-row">
        <p>© {year} History Art &amp; Music Club</p>

        <p className="flex items-center gap-1 text-[11px] sm:text-xs">
          Web dizajn &amp; vývoj{" "}
          <span className="font-semibold text-stone-700">
            Adam Macko
          </span>
        </p>
      </div>
    </footer>
  );
}
