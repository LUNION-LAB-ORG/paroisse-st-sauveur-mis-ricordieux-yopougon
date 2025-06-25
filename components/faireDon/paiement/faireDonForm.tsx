"use client";

import { useState } from "react";
import { Coordonnees } from "@/components/faireDon/paiement/coordonnees";
import { PaiementConfirmation } from "@/components/faireDon/paiement/paiementConfirmation";

export default function FaireDonForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    modePaiement: "",
  });

  const [errors, setErrors] = useState({
    nom: "",
    email: "",
    telephone: "",
    modePaiement: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNext = () => {
    const newErrors = {
      nom: formData.nom ? "" : "Le nom est requis",
      email: formData.email ? "" : "L'email est requis",
      telephone: "",
      modePaiement: "",
    };

    setErrors(newErrors);
    if (!Object.values(newErrors).some(Boolean)) {
      setStep(1);
    }
  };

  const handlePrev = () => setStep(0);

  const handleSubmit = () => {
    if (!formData.modePaiement) {
      setErrors((prev) => ({
        ...prev,
        modePaiement: "Veuillez sélectionner un mode de paiement",
      }));
      return;
    }

    alert("Paiement confirmé !");
    console.log("Données envoyées :", formData);
  };

  return (
    <section className="w-full px-4 py-10 bg-white">
      <div className="max-w-2xl mx-auto rounded-xl bg-white p-6 sm:p-10 shadow-md border border-gray-200">
        {/* Étapes */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 items-center text-sm text-gray-500">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                step === 0 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
            <div className="w-10 h-px bg-gray-300" />
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                step === 1 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Formulaire */}
        {step === 0 && (
          <Coordonnees
            formData={formData}
            onFieldChange={updateField}
            onNext={handleNext}
            errors={errors}
          />
        )}

        {step === 1 && (
          <PaiementConfirmation
            formData={formData}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
            onFieldChange={updateField}
            errors={errors}
          />
        )}
      </div>
    </section>
  );
}
