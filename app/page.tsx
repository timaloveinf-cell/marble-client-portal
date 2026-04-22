import { ContractLookup } from "@/components/ContractLookup";
import Image from "next/image";

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-dvh">
      <section className="relative min-h-dvh">
        <Image
          src="/hero-marble.jpg"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl items-center px-6 py-20">
          <div className="w-full max-w-2xl">
            <div className="flex items-baseline gap-2">
              <div className="font-serif text-sm tracking-[0.28em] text-zinc-100">
                DECORMARMI
              </div>
              <div className="relative -top-1 text-[10px] font-medium tracking-wider text-zinc-500">
                rus
              </div>
            </div>
            <h1 className="mt-6 font-serif text-4xl leading-[1.06] tracking-tight text-zinc-50 sm:text-6xl">
              Личный кабинет клиента
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Введите ID договора, чтобы открыть фотоотчет, документацию и статус строительства.
            </p>

            <div className="mt-10 rounded-2xl border border-white/15 bg-black/30 p-5 backdrop-blur sm:p-6">
              <ContractLookup />
              <div className="mt-3 text-xs text-zinc-500">
                Пример: <span className="text-zinc-300">MRB-2026-00142</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

