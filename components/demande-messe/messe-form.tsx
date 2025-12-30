"use client";
import { createIntention } from "@/services/messes/messes.action";
import { RequestStatus } from "@/services/messes/types/messes.type";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IntentionType } from "@/services/messes/messes.schema";
export default function MesseForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    intentionType: string;
    amount: number;
    message: string;
    firstName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    request_status: "pending" | "accepted" | "canceled";
    paymentMethod: string;
  }>({
    intentionType: "",
    amount: 2000,
    message: "",
    firstName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    request_status: "pending",
    paymentMethod: "online",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const toastId = toast.loading("Envoi de votre demande...");

    try {
      // ✅ ISO datetime requis par Zod
      const isoDateTime = new Date(
        `${formData.date}T${formData.time}`
      ).toISOString();

      // ✅ PAYLOAD CONFORME AU ZOD
      const payload: IntentionType = {
        type: formData.intentionType,
        fullname: formData.firstName,
        email: formData.email || null,
        phone: formData.phone,
        message: formData.message,
        amount: Number(formData.amount),
        date_at: isoDateTime,
        time_at: isoDateTime,
        request_status: formData.request_status, // 👈 plus jamais string
      };

      console.log("PAYLOAD FINAL =>", payload);

      const result = await createIntention(payload);

      if (!result.success) {
        toast.error(result.error || "Erreur", { id: toastId });
        return;
      }

      toast.success("Demande envoyée avec succès 🙏", { id: toastId });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      intentionType: "",
      amount: 2000,
      message: "",
      firstName: "",
      email: "",
      phone: "",
      request_status: "pending",
      date: "",
      time: "",
      paymentMethod: "online",
    });
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const steps = [
    {
      title: "Type d'intention",
      description: "Choisissez le type d'intention",
    },
    { title: "Vos coordonnées", description: "Nom et prénom du demandeur" },
    { title: "Date et heure souhaitées", description: "Date de la messe" },
    {
      title: "Paiement & Confirmation",
      description: "Récapitulatif de votre demande",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex justify-end">
            <Button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-center py-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Félicitation
            </h2>
            <p className="text-gray-600 mb-6">
              Votre demande a bien été enregistrer. Nous vous remercions pour
              votre confiance. Un membre de notre équipe paroissiale prendra
              contact avec vous dans les plus brefs délais, généralement sous 48
              heures.
            </p>
            <Button className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition-colors">
              Payer ou payer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-purple-50 flex items-center bg-cover bg-center justify-center p-4"
      style={{
        backgroundImage: "url('/assets/images/hero-histoire.jpg')",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="relative h-20 bg-[#8e0b10] ">
          <div className="absolute top-4 left-4">
            <Button
              onClick={handlePrevStep}
              className="flex items-center text-white bg-black bg-opacity-30 px-3 py-2 rounded-md hover:bg-opacity-50 transition"
            >
              <ArrowLeft size={16} className="mr-1" />
              Retour
            </Button>
          </div>
          <div className="absolute top-4 right-4">
            <span className="text-white text-sm">Demande de Messe</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step indicator */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#8e0b10]">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600 text-sm">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* Form content based on current step */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d&apos;intention
                </Label>
                <Select
                  value={formData.intentionType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, intentionType: value }))
                  }
                >
                  <SelectTrigger id="type" className="bg-card">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="action-de-grace">
                      Action de grâce
                    </SelectItem>
                    <SelectItem value="repos-ame">
                      Repos de l&apos;âme
                    </SelectItem>
                    <SelectItem value="guerison">Guérison</SelectItem>
                    <SelectItem value="protection">Protection</SelectItem>
                    <SelectItem value="benediction">Bénédiction</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </Label>
                <input
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring- focus:border-transparent"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-[#8e0b10] transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom et prénom du demandeur
                </Label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse e-mail
                </Label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone (optionnel)
                </Label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Précédent
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de la messe
                </Label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Horaire de messe
                </Label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Précédent
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Paiement en ligne
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Par carte bancaire (Sécurisé)
                </p>

                <h3 className="font-medium text-gray-800 mb-2">
                  Paiement à la paroisse
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  En espèces ou par chèque
                </p>

                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="paymentOnline"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleInputChange}
                    className="mr-2 cursor-pointer"
                  />
                  <Label
                    htmlFor="paymentOnline"
                    className="text-sm text-gray-700"
                  >
                    Paiement en ligne
                  </Label>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="paymentParish"
                    name="paymentMethod"
                    value="parish"
                    checked={formData.paymentMethod === "parish"}
                    onChange={handleInputChange}
                    className="mr-2 cursor-pointer"
                  />
                  <Label
                    htmlFor="paymentParish"
                    className="text-sm text-gray-700"
                  >
                    Paiement à la paroisse
                  </Label>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Récapitulatif de votre demande
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Type d&apos;intention:</div>
                  <div>{formData.intentionType || "Non spécifié"}</div>
                  <div>Message:</div>
                  <div>{formData.message || "Non spécifié"}</div>
                  <div>Demandeur:</div>
                  <div>{formData.firstName || "Non spécifié"}</div>
                  <div>Date souhaitée:</div>
                  <div>{formData.date || "Non spécifié"}</div>
                  <div>Horaire:</div>
                  <div>{formData.time || "Non spécifié"}</div>
                  <div>Prix:</div>
                  <div>2000 FCFA</div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handlePrevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Précédent
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
                >
                  Soumettre la demande
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}