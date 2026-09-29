"use client";

import {
  Button,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useState } from "react";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";
import { useAbonnerWhatsappMutation } from "@/features/abonnement/queries/abonnement-add.mutation";
import { abonnementSchema } from "@/features/abonnement/schemas/abonnement.schema";

export function AbonnementWhatsapp({ logo }: { logo: string }) {
  const [telephone, setTelephone] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [erreurs, setErreurs] = useState<{ phone?: string; consent?: string }>(
    {},
  );
  const [abonne, setAbonne] = useState(false);
  const mutation = useAbonnerWhatsappMutation();

  const envoyer = (e: React.FormEvent) => {
    e.preventDefault();
    const resultat = abonnementSchema.safeParse({
      phone: telephone,
      consent: consentement,
    });

    if (!resultat.success) {
      const champs = resultat.error.flatten().fieldErrors;

      setErreurs({ phone: champs.phone?.[0], consent: champs.consent?.[0] });

      return;
    }
    setErreurs({});
    mutation.mutate(resultat.data, { onSuccess: () => setAbonne(true) });
  };

  return (
    <section className={cn(CONTENEUR, "mt-6 lg:mt-0")} id="whatsapp">
      <div className="grid grid-cols-1 items-center gap-3 border-y border-marine py-[22px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 lg:py-11">
        <div className="flex items-center gap-3 lg:gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden
            alt=""
            className="size-14 shrink-0 rounded-full object-cover lg:size-[88px]"
            src={logo}
          />
          <div className="flex flex-col gap-2">
            <h2 className="m-0 font-heading text-lg font-extrabold text-marine lg:text-[28px]">
              <span className="lg:hidden">La Parole du jour sur WhatsApp</span>
              <span className="hidden lg:inline">
                Recevoir la Parole du jour
              </span>
            </h2>
            <p className="m-0 hidden text-[17px] text-gris lg:block">
              Les lectures, l’homélie et les annonces paroissiales, chaque matin
              sur WhatsApp.
            </p>
          </div>
        </div>

        {abonne ? (
          <p className="m-0 text-base font-semibold text-marine" role="status">
            Merci ! Vous êtes abonné(e). Envoyez « STOP » sur WhatsApp pour vous
            désabonner à tout moment.
          </p>
        ) : (
          <Form
            className="flex flex-col gap-2.5"
            validationBehavior="aria"
            onSubmit={envoyer}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-2">
              <TextField
                className="flex flex-col gap-1.5"
                isInvalid={!!erreurs.phone}
                name="phone"
                type="tel"
                value={telephone}
                onChange={setTelephone}
              >
                <Label className="text-[13px] font-semibold text-encre lg:text-sm">
                  Numéro WhatsApp
                </Label>
                <Input
                  autoComplete="tel"
                  className="min-h-11 rounded-charte border border-champ bg-white px-3.5 py-[13px] text-base lg:w-[280px]"
                  placeholder="+225 07 00 00 00 00"
                />
                <FieldError className="text-sm text-rouge">
                  {erreurs.phone}
                </FieldError>
              </TextField>
              <Button
                className="h-auto min-h-11 rounded-charte bg-marine px-[26px] py-3.5 text-[15px] font-bold text-white hover:bg-marine-deep lg:mt-[26px] lg:py-[15px] lg:text-base"
                isPending={mutation.isPending}
                type="submit"
              >
                S’abonner
              </Button>
            </div>
            <Checkbox
              className="group max-w-[440px]"
              isInvalid={!!erreurs.consent}
              isSelected={consentement}
              onChange={setConsentement}
            >
              <Checkbox.Content className="flex flex-row items-start gap-2.5 text-[13px] leading-[1.45] text-encre-douce">
                <Checkbox.Control className="mt-0.5 size-[18px] shrink-0 rounded-[2px] border border-champ bg-white group-data-[selected=true]:border-marine group-data-[selected=true]:bg-marine group-data-[selected=true]:text-white">
                  <Checkbox.Indicator />
                </Checkbox.Control>
                J’accepte de recevoir la Parole du jour et les annonces de la
                paroisse sur WhatsApp.
              </Checkbox.Content>
              {erreurs.consent && (
                <p className="m-0 mt-1 text-sm text-rouge">{erreurs.consent}</p>
              )}
            </Checkbox>
            <p className="m-0 max-w-[440px] text-xs leading-[1.45] text-gris">
              Votre numéro sert uniquement à ces envois. Désabonnement à tout
              moment en répondant « STOP ».
            </p>
          </Form>
        )}
      </div>
    </section>
  );
}
