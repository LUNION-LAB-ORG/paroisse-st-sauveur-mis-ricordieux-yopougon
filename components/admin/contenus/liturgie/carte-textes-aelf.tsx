"use client";

import type { IJourLiturgique } from "@/features/liturgie/types/liturgie-admin.type";

import { useState } from "react";

import {
  ChoixCompact,
  SaisieCompacte,
} from "@/components/admin/contenus/champs-compacts";
import {
  BoutonAdmin,
  ErreurChargement,
  Pastille,
} from "@/components/admin/ui/kit";
import { useSurchargerLiturgieMutation } from "@/features/liturgie/queries/liturgie-admin.mutation";

const TYPES_LECTURE: Record<string, string> = {
  lecture_1: "1re lecture",
  psaume: "Psaume",
  lecture_2: "2e lecture",
  evangile: "Évangile",
};

const COULEURS = ["blanc", "rouge", "vert", "violet", "rose"] as const;

const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Regroupe les lectures d'un même type (« ou bien ») : « Dn 7… (ou Ap 12…) ». */
function lectures(jour: IJourLiturgique) {
  const res: { type: string; ref: string }[] = [];

  for (const l of jour.readings ?? []) {
    const type =
      TYPES_LECTURE[l.type] ?? majuscule(String(l.type).replace(/_/g, " "));
    const precedente = res[res.length - 1];

    if (precedente && precedente.type === type && l.ref) {
      precedente.ref = `${precedente.ref} (ou ${l.ref})`;
      continue;
    }
    res.push({ type, ref: l.ref ?? "—" });
  }

  return res;
}

export function CarteTextesAelf({
  date,
  jour,
  chargement,
  erreur,
  onReessayer,
  peutEcrire,
}: {
  date: string;
  jour: IJourLiturgique | null;
  chargement: boolean;
  erreur: string | null;
  onReessayer: () => void;
  peutEcrire: boolean;
}) {
  const [intitule, setIntitule] = useState(jour?.feast_override ?? "");
  const [couleur, setCouleur] = useState(jour?.color_override ?? "");
  const surcharger = useSurchargerLiturgieMutation();

  const couleurAelf = jour && !jour.color_override ? jour.color : null;
  const modifie =
    intitule.trim() !== (jour?.feast_override ?? "") ||
    couleur !== (jour?.color_override ?? "");
  const heureImport = jour?.imported_at?.slice(11, 16);

  return (
    <section className="flex flex-col gap-3 self-start rounded-admin border border-bord-admin bg-white px-5 py-5 md:px-[22px]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 font-heading text-base font-extrabold text-marine">
          Textes AELF
        </h2>
        {!chargement &&
          !erreur &&
          (jour ? (
            <Pastille className="px-[9px]" ton="succes">
              {heureImport ? `Importés ${heureImport}` : "Importés"}
            </Pastille>
          ) : (
            <Pastille className="px-[9px]" ton="attention">
              Non importés
            </Pastille>
          ))}
      </div>

      {chargement ? (
        <p className="m-0 text-sm text-gris">Chargement des textes…</p>
      ) : erreur ? (
        <ErreurChargement
          message={`Les textes n’ont pas pu être chargés. ${erreur}`}
          onReessayer={onReessayer}
        />
      ) : !jour ? (
        <p className="m-0 text-sm leading-[1.55] text-gris">
          Les textes de ce jour ne sont pas encore importés. Utilisez « Relancer
          l’import AELF » pour les récupérer.
        </p>
      ) : (
        <>
          <span className="text-[15px] font-bold">
            {jour.feast}
            {jour.degree ? ` — ${jour.degree}` : ""}
          </span>
          <div className="flex flex-col">
            {lectures(jour).map((l, i) => (
              <div
                key={`${l.type}-${i}`}
                className="grid grid-cols-[110px_minmax(0,1fr)] gap-2.5 border-t border-ligne-admin py-2.5 text-sm"
              >
                <span className="text-gris">{l.type}</span>
                <strong className="text-marine">{l.ref}</strong>
              </div>
            ))}
          </div>
        </>
      )}

      <form
        className="flex flex-col gap-2.5 border-t border-bord-admin pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!jour) return;
          surcharger.mutate({
            date,
            feast_override: intitule.trim() || null,
            color_override: couleur || null,
          });
        }}
      >
        <span className="text-[13px] font-bold">
          Surcharge locale{" "}
          <span className="font-normal text-gris">
            (fête patronale, célébration propre)
          </span>
        </span>
        <SaisieCompacte
          isDisabled={!peutEcrire || !jour}
          label="Intitulé affiché"
          maxLength={255}
          placeholder="Laisser vide pour garder l’intitulé AELF"
          saisieClassName="px-2.5 py-[9px]"
          value={intitule}
          onChange={setIntitule}
        />
        <ChoixCompact
          isDisabled={!peutEcrire || !jour}
          label="Couleur liturgique"
          options={[
            {
              valeur: "",
              label: couleurAelf
                ? `Selon l’AELF (${couleurAelf})`
                : "Selon l’AELF",
            },
            ...COULEURS.map((c) => ({ valeur: c, label: majuscule(c) })),
          ]}
          saisieClassName="px-2.5 py-[9px]"
          value={couleur}
          onChange={setCouleur}
        />
        {peutEcrire && jour && modifie && (
          <BoutonAdmin
            className="self-start"
            isPending={surcharger.isPending}
            type="submit"
            variante="contour"
          >
            Enregistrer la surcharge
          </BoutonAdmin>
        )}
      </form>
    </section>
  );
}
