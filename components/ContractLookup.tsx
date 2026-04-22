"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function ContractLookup() {
  const router = useRouter();
  const [contractId, setContractId] = useState("");

  const isValid = useMemo(() => {
    const v = contractId.trim();
    return v.length > 0 && v.length <= 64;
  }, [contractId]);

  return (
    <main className="min-h-dvh grid place-items-center px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const id = contractId.trim();
            if (!id) return;
            router.push(`/project/${encodeURIComponent(id)}`);
          }}
        >
          <label className="flex flex-col gap-2">
            <span className="sr-only">ID договора</span>
            <input
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              placeholder="ID договора"
              inputMode="text"
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/20"
            />
          </label>

          <button
            type="submit"
            disabled={!isValid}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-gold-500 px-5 font-serif text-sm font-semibold tracking-wide text-black shadow-glow transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Поиск
          </button>
        </form>
      </section>
    </main>
  );
}

