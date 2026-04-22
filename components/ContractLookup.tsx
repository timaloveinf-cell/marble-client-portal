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
    <form
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(e) => {
        e.preventDefault();
        const id = contractId.trim();
        if (!id) return;
        router.push(`/project/${encodeURIComponent(id)}`);
      }}
    >
      <label className="w-full">
        <span className="sr-only">ID договора</span>
        <input
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Введите ID договора"
          inputMode="text"
          autoComplete="off"
          className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/15"
        />
      </label>

      <button
        type="submit"
        disabled={!isValid}
        className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl border border-gold-500/50 bg-transparent px-6 font-serif text-sm font-semibold tracking-wide text-zinc-100 transition hover:border-gold-500 hover:bg-gold-500/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Поиск
      </button>
    </form>
  );
}

