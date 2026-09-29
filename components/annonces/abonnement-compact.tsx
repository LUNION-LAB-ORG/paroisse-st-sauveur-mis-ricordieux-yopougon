"use client";

import { Button, Checkbox } from "@heroui/react";
import { useState } from "react";

import { MentionDonnees } from "@/components/site/mention-donnees";
import { ChampTexte } from "@/components/site/champs";
import { useAbonnerWhatsappMutation } from "@/features/abonnement/queries/abonnement-add.mutation";
import { abonnementSchema } from "@/features/abonnement/schemas/abonnement.schema";

/** Abonnement WhatsApp compact (colonne latérale des annonces). */
export function AbonnementCompact() {
  const [tel, setTel] = useState("");
  const [accord, setAccord] = useState(false);
  const [erreurs, setErreurs] = useState<{ phone?: string; consent?: string }>(
    {},
  );
  const [fait, setFait] = useState(false);
  const mutation = useAbonnerWhatsappMutation();

  const envoyer = () => {
    const r = abonnementSchema.safeParse({ phone: tel, consent: accord });

    if (!r.success) {
      const c = r.error.flatten().fieldErrors;

      setErreurs({ phone: c.phone?.[0], consent: c.consent?.[0] });

      return;
    }
    setErreurs({});
    mutation.mutate(r.data, { onSuccess: () => setFait(true) });
  };

  if (fait) {
    return (
      <p className="m-0 text-[15px] font-semibold text-marine" role="status">
        Merci ! Vous recevrez la feuille d’annonces chaque dimanche.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ChampTexte
        autoComplete="tel"
        className="[&_label]:sr-only"
        erreur={erreurs.phone}
        label={<span className="sr-only">Numéro WhatsApp</span>}
        placeholder="+225 07 00 00 00 00"
        type="tel"
        value={tel}
        onChange={setTel}
      />
      <Checkbox className="group" isSelected={accord} onChange={setAccord}>
        <Checkbox.Content className="flex flex-row items-start gap-2.5 text-[13px] leading-[1.45] text-encre-douce">
          <Checkbox.Control className="mt-0.5 size-[18px] shrink-0 rounded-[2px] border border-champ bg-white group-data-[selected=true]:border-marine group-data-[selected=true]:bg-marine group-data-[selected=true]:text-white">
            <Checkbox.Indicator />
          </Checkbox.Control>
          J’accepte de recevoir les annonces de la paroisse sur WhatsApp.
        </Checkbox.Content>
      </Checkbox>
      {erreurs.consent && (
        <p className="m-0 text-sm text-rouge">{erreurs.consent}</p>
      )}
      <Button
        className="h-auto min-h-11 w-full rounded-charte bg-marine p-[13px] text-[15px] font-bold text-white hover:bg-marine-deep"
        isPending={mutation.isPending}
        onPress={envoyer}
      >
        S’abonner
      </Button>
      <MentionDonnees finalite="servent uniquement à l’envoi des annonces paroissiales sur WhatsApp ; désabonnement à tout moment en répondant « STOP »" />
    </div>
  );
}
