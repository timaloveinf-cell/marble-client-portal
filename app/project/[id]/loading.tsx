export default function LoadingProject() {
  return (
    <main className="px-6 py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div
              className="size-5 animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500"
              aria-hidden="true"
            />
            <div className="text-sm text-zinc-300">Загружаем данные...</div>
          </div>
        </div>
      </div>
    </main>
  );
}

