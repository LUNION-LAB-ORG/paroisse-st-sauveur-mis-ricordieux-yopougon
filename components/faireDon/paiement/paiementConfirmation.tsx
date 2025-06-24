"use client";

import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";

interface Props {
  formData: {
    nom: string;
    email: string;
    telephone: string;
    modePaiement: string;
  };
  onPrev: () => void;
  onSubmit: () => void;
  onFieldChange: (field: string, value: string) => void;
  errors: {
    nom: string;
    email: string;
    telephone: string;
    modePaiement: string;
  };
}

export function PaiementConfirmation({
  formData,
  onPrev,
  onSubmit,
  onFieldChange,
  errors,
}: Props) {
  return (
    <div className="px-4 max-w-5xl mx-auto relative z-10 py-10 md:py-16 text-white">
      <h2 className="text-2xl md:text-3xl xl:text-4xl text-center mb-6">
        Faire un don
      </h2>

      <div className="lg:px-24 bg-white rounded-xl p-6 py-10 sm:p-10 lg:py-20">
        <h3 className="text-2xl md:text-3xl mb-10 font-bold text-blue-900">
          Paiement & Confirmation
        </h3>

        <div className="text-slate-700 text-lg md:text-xl lg:text-2xl flex flex-col space-y-6">
          <ModePaiementRadioGroup
            selected={formData.modePaiement}
            onChange={(value) => onFieldChange("modePaiement", value)}
          />
          {errors.modePaiement && (
            <span className="text-red-500 text-sm">{errors.modePaiement}</span>
          )}

          {/* Récapitulatif */}
          <div>
            <h3 className="mb-4 font-semibold">Récapitulatif</h3>
            <div className="flex flex-col space-y-2">
              <span>Nom : {formData.nom}</span>
              <span>Email : {formData.email}</span>
              {formData.telephone && (
                <span>Téléphone : {formData.telephone}</span>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-wrap justify-between">
            <Button
              className="text-md lg:text-xl w-fit lg:px-16 py-4 lg:py-8"
              onPress={onPrev}
            >
              Précédent
            </Button>
            <Button
              className="text-md lg:text-xl w-fit lg:px-16 py-4 lg:py-8"
              color="primary"
              onPress={onSubmit}
            >
              Faire mon don
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ModePaiementRadioGroupProps {
  selected: string;
  onChange: (value: string) => void;
}

function ModePaiementRadioGroup({
  selected,
  onChange,
}: ModePaiementRadioGroupProps) {
  return (
    <RadioGroup
      label="Mode de paiement"
      value={selected}
      onValueChange={onChange}
      isRequired
    >
      <div className="rounded-lg flex items-center gap-2 border-2 p-4">
        <Radio value="en-ligne" />
        <div>
          <h3 className="text-black">Paiement en ligne</h3>
          <p className="text-md md:text-lg lg:text-xl">
            Par carte bancaire (sécurisé)
          </p>
        </div>
      </div>

      <div className="rounded-lg flex items-center gap-2 border-2 p-4">
        <Radio value="paroisse" />
        <div>
          <h3 className="text-black">Paiement à la paroisse</h3>
          <p className="text-md md:text-lg lg:text-xl">
            En espèces ou par chèque
          </p>
        </div>
      </div>
    </RadioGroup>
  );
}
