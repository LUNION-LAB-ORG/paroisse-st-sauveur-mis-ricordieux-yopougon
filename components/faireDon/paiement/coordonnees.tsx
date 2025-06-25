"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface Props {
  formData: {
    nom: string;
    email: string;
    telephone: string;
  };
  onFieldChange: (field: string, value: string) => void;
  onNext: () => void;
  errors: {
    nom: string;
    email: string;
    telephone: string;
  };
}

export function Coordonnees({ formData, onFieldChange, onNext, errors }: Props) {
  return (
    <div className="px-4 max-w-5xl mx-auto relative z-10 py-10 md:py-16 text-white">
      <h2 className="text-2xl md:text-3xl uppercase xl:text-4xl text-center mb-6">Faire un don</h2>

      <div className="lg:px-24 bg-white rounded-xl p-6 py-10 sm:p-10">
        <h3 className="text-2xl md:text-3xl mb-10 font-bold text-blue-900">Vos coordonnées</h3>
        <div className="text-slate-700 text-lg md:text-xl lg:text-2xl flex flex-col space-y-10">

          {/* Nom */}
          <div>
            <p className="mb-2 text-[20px]">Nom et prénom</p>
            <Input
              value={formData.nom}
              onChange={(e) => onFieldChange("nom", e.target.value)}
              isRequired
              labelPlacement="inside"
              label="Nom"
              type="text"
              variant="bordered"
              className="w-full text-md"
            />
            {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
          </div>

          {/* Email */}
          <div>
            <p className="mb-2 text-[20px]">Adresse e-mail</p>
            <Input
              value={formData.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              isRequired
              labelPlacement="inside"
              label="Email"
              type="email"
              variant="bordered"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <p className="mb-2 text-[20px]">Numéro de téléphone (optionnel)</p>
            <Input
              value={formData.telephone}
              onChange={(e) => onFieldChange("telephone", e.target.value)}
              labelPlacement="inside"
              label="Téléphone"
              type="tel"
              variant="bordered"
            />
          </div>

          {/* Bouton suivant */}
          <div className="flex justify-end">
            <Button
              className="text-sm lg:text-md w-fit lg:px-6 py-4 lg:py-4"
              color="primary"
              onPress={onNext}
            >
              Continuer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
