export interface ILigneRecap {
  label: string;
  valeur: string;
}

/** Récapitulatif de la demande (colonne de droite), mis à jour à chaque saisie. */
export function Recapitulatif({ lignes }: { lignes: ILigneRecap[] }) {
  return (
    <div
      aria-live="polite"
      className="flex flex-col gap-3.5 border border-t-4 border-ligne border-t-marine bg-white p-6 lg:p-7"
    >
      <span className="font-heading text-lg font-extrabold text-marine">
        Récapitulatif
      </span>
      <dl className="m-0 flex flex-col gap-3.5">
        {lignes.map((l) => (
          <div
            key={l.label}
            className="flex flex-col gap-0.5 border-t border-[#EEE8DD] pt-3"
          >
            <dt className="text-[13px] text-gris">{l.label}</dt>
            <dd className="m-0 text-base font-semibold leading-[1.4]">
              {l.valeur}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
