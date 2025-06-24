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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reset l'erreur du champ modifié
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleNext = () => {
    const newErrors = {
      nom: formData.nom ? "" : "Le nom est requis",
      email: formData.email ? "" : "L'email est requis",
      telephone: "",
      modePaiement: "", // pas encore utilisé à cette étape
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (!hasError) setStep(1);
  };

  const handlePrev = () => {
    setStep(0);
  };

  const handleSubmit = () => {
    if (!formData.modePaiement) {
      setErrors((prev) => ({
        ...prev,
        modePaiement: "Veuillez sélectionner un mode de paiement",
      }));
      return;
    }

    // Traitement final ici (ex : envoi API)
    alert("Paiement confirmé !");
    console.log("Données envoyées :", formData);
  };

  return (
    <>
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
    </>
  );
}
