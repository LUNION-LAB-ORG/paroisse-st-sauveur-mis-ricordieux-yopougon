"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Coordonnees } from "@/components/faireDon/paiement/coordonnees";
import { PaiementConfirmation } from "@/components/faireDon/paiement/paiementConfirmation";

export default function Content() {
  const router = useRouter();
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

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStepOne = () => {
    const newErrors = {
      nom: formData.nom ? "" : "Le nom est requis",
      email: formData.email ? "" : "L'email est requis",
      telephone: "", // facultatif
      modePaiement: "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (!hasError) {
      setStep(1);
    }
  };

  const handleFinalSubmit = () => {
    if (!formData.modePaiement) {
      setErrors((prev) => ({
        ...prev,
        modePaiement: "Veuillez sélectionner un mode de paiement",
      }));
      return;
    }

    console.log("Formulaire validé :", formData);
    // Ici, on envoie les données
  };

  return (
    <div className="relative z-50 flex flex-col min-h-screen overflow-hidden">
      <Image
        fill
        priority
        alt="Église Saint Michel"
        src="/assets/images/hero-faire-don.jpg"
        className="!fixed top-0 left-0 w-full h-full object-cover brightness-[0.4] z-0"
      />
      <div className="min-h-screen overflow-scroll">
        <div className="relative z-20 text-white font-bold px-4 lg:px-14 mb-6 flex items-center gap-2 cursor-pointer">
          <button className="cursor-pointer" onClick={() => router.back()}>
            <ArrowLeft className="w-8 h-8 lg:w-14 lg:h-14" />
          </button>
          <span className="text-lg md:text-xl lg:text-2xl">Retour</span>
        </div>

        <div>
          {step === 0 ? (
            <Coordonnees
              formData={formData}
              onFieldChange={handleFieldChange}
              onNext={validateStepOne}
              errors={errors}
            />
          ) : (
            <PaiementConfirmation
              formData={formData}
              onFieldChange={handleFieldChange}
              onPrev={() => setStep(0)}
              onSubmit={handleFinalSubmit}
              errors={errors}
            />
          )}
        </div>
      </div>
    </div>
  );
}
