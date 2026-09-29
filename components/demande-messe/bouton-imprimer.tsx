"use client";

export function BoutonImprimer() {
  return (
    <button
      className="min-h-11 rounded-charte bg-marine px-6 py-3 text-[15px] font-bold text-white print:hidden"
      type="button"
      onClick={() => window.print()}
    >
      Imprimer ou enregistrer en PDF
    </button>
  );
}
