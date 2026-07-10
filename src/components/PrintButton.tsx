"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-terracotta px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-terracotta-deep"
    >
      🖨️ Printo / Ruaj PDF
    </button>
  );
}
