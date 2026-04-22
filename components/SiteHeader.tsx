export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-baseline gap-2">
          <div className="font-serif text-sm tracking-[0.28em] text-zinc-100">
            DECORMARMI
          </div>
          <div className="relative -top-1 text-[10px] font-medium tracking-wider text-zinc-500">
            rus
          </div>
        </div>
      </div>
    </header>
  );
}

