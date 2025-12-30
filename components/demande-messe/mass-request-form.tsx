"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { IntentionFormData } from "@/services/messes/messes.schema";
import { toast } from "sonner";

import { createIntention } from "@/services/messes/messes.action";
import StepCoordinates from "./step-coordinates";
import StepDateTime from "./step-date-time";
import StepIntention from "./step-intention";
import StepPayment from "./step-payment";
import StepSuccess from "./step-success";

const initialFormData: IntentionFormData = {
  type: "",
  fullname: "",
  email: null,
  phone: "",
  message: "",
  amount: 2000,
  date_at: "",
  time_at: "",
};

const MassRequestForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntentionFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 4;

  const handleChange = (
    field: keyof IntentionFormData,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const toastId = toast.loading("Envoi de votre demande...");

    try {
      const result = await createIntention(formData);
      console.log("SERVER RESULT =>", result);

      if (!result.success) {
        toast.error(result.error || "Une erreur est survenue", { id: toastId });
        return;
      }

      toast.success("Demande envoyée avec succès 🙏", { id: toastId });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur, veuillez réessayer", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNewRequest = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.type && formData.message;
      case 2:
        return formData.fullname && formData.phone;
      case 3:
        return formData.date_at && formData.time_at;
      case 4:
        return formData.amount > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepIntention
            data={{ type: formData.type, message: formData.message }}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <StepCoordinates
            data={{
              fullname: formData.fullname,
              email: formData.email,
              phone: formData.phone,
            }}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <StepDateTime
            data={{ date_at: formData.date_at, time_at: formData.time_at }}
            onChange={handleChange}
          />
        );
      case 4:
        return <StepPayment data={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(/assets/images/hero-histoire.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.7)",
        }}
      />
      <div className="fixed inset-0 z-0 bg-primary/30" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-semibold text-primary-foreground">
            {isSubmitted ? "Félicitation" : "Demander une messe"}
          </h1>
        </div>

        <div className="bg-card rounded-xl shadow-2xl overflow-hidden">
          {!isSubmitted && (
            <div className="bg-primary px-6 py-4 flex items-center">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center text-primary-foreground hover:opacity-80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="text-sm">Retour</span>
                </button>
              ) : (
                <div className="h-6" />
              )}
              <h2 className="flex-1 text-center text-primary-foreground font-medium pr-12">
                Demande de Messe
              </h2>
            </div>
          )}

          <div className="p-6">
            {isSubmitted ? (
              <StepSuccess onNewRequest={handleNewRequest} />
            ) : (
              <>
                {renderStep()}

                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mt-4">
                    {error}
                  </div>
                )}

                <div className="flex justify-between mt-8 gap-4">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 bg-red-700 text-white hover:bg-[#003399]"
                    >
                      Précédent
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    onClick={handleNext}
                    disabled={!canProceed() || loading}
                    className={
                      currentStep === 1
                        ? "w-full bg-red-600 text-white hover:bg-[#003399]"
                        : "flex-1 bg-red-600 text-white hover:bg-[#003399]"
                    }
                  >
                    {loading
                      ? "Envoi en cours..."
                      : currentStep === totalSteps
                        ? "Soumettre la demande"
                        : "Suivant"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassRequestForm;
