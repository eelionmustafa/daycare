"use client";

import { IconPrinter } from "@/components/icons";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-terracotta-deep"
    >
      <IconPrinter className="h-4 w-4" aria-hidden /> Printo / Ruaj PDF
    </button>
  );
}
