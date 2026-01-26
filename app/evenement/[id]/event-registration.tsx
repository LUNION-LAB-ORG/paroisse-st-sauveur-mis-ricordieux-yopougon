"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Event } from "@/services/Events/types/events.type";
import { toast } from "sonner";

interface EventRegistrationData {
  fullname: string;
  email: string;
  phone: string;
  message: string;
  acceptConditions: boolean;
}

interface EventRegistrationProps {
  event: Event;
  onBack: () => void;
}

export default function EventRegistration({ event, onBack }: EventRegistrationProps) {
  const [formData, setFormData] = useState<EventRegistrationData>({
    fullname: "",
    email: "",
    phone: "",
    message: "",
    acceptConditions: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof EventRegistrationData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Le nom complet est obligatoire";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email est invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est obligatoire";
    }

    if (!formData.acceptConditions) {
      newErrors.acceptConditions = "Vous devez accepter les conditions de participation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Envoi de votre inscription...");

    try {
      // Simuler l'envoi des données (remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Inscription envoyée avec succès 🎉", { id: toastId });
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'inscription", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullname: "",
      email: "",
      phone: "",
      message: "",
      acceptConditions: false,
    });
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center bg-cover bg-center justify-center p-4" style={{ backgroundImage: "url('/assets/images/hero-histoire.jpg')" }}>
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex justify-end">
            <Button
              onClick={() => setShowSuccess(false)}
              className="text-gray-500 hover:text-gray-700"
              variant="ghost"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-center py-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Inscription Confirmée !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre inscription à l'événement <strong>{event.title}</strong> a bien été enregistrée. 
              Nous vous remercions pour votre participation et vous contacterons prochainement 
              avec plus de détails.
            </p>
            <Button 
              onClick={handleReset}
              className="bg-red-700 hover:bg-red-800 text-white px-8"
            >
              Nouvelle inscription
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center bg-cover bg-center justify-center p-4" style={{ backgroundImage: "url('/assets/images/hero-histoire.jpg')" }}>
      <div className="">
        <div className="relative lg:-top-80 lg:-left-80 hidden lg:block">
          <Button
            onClick={onBack}
            className="flex items-center text-white bg-opacity-30 px-3 py-2 rounded-md hover:bg-opacity-50 transition"
            variant="ghost"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg shadow-xl overflow-hidden max-w-2xl w-full">
        {/* Header */}
        <div className="sm:bg-red-700 lg:bg-transparent relative h-20 lg:flex lg:justify-center lg:items-center">
          <div className="absolute top-4 left-4 lg:hidden md:block">
            <Button
              onClick={onBack}
              className="flex items-center text-white bg-black bg-opacity-30 px-3 py-2 rounded-md hover:bg-opacity-50 transition"
              variant="ghost"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </div>
          <div className="hidden lg:flex lg:w-full lg:justify-between lg:items-center lg:px-4">
            <Button
              onClick={onBack}
              className="flex items-center text-white bg-opacity-30 px-3 py-2 rounded-md hover:bg-opacity-50 transition"
              variant="ghost"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <span className="text-white font-extrabold text-2xl">Inscription Événement</span>
            <div></div>
          </div>
          <div className="absolute lg:hidden top-4 right-4">
            <span className="text-white font-bold md:text-lg text-sm">Inscription Événement</span>
          </div>
        </div>

        {/* Event Info */}
        <div className="bg-white p-6 border-l-4 border-red-700">
          <h3 className="text-xl font-bold text-red-700 mb-2">{event.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Date:</span>
              <span>{new Date(event.date_at).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Heure:</span>
              <span>{event.time_at}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Lieu:</span>
              <span>{event.location_at}</span>
            </div>
          </div>
          <p className="text-gray-700 text-sm">
            {event.description || "Aucune description disponible pour cet événement."}
          </p>
        </div>

        {/* Form */}
        <div className="p-6 bg-white space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-foreground font-medium">
              Nom et prénom *
            </Label>
            <Input
              id="fullname"
              value={formData.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
              placeholder="Votre nom et prénom"
              className="bg-gray-50 border-0"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Adresse e-mail *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="votre.email@example.com"
              className="bg-gray-50 border-0"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-medium">
              Numéro de téléphone *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Votre numéro de téléphone"
              className="bg-gray-50 border-0"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground font-medium">
              Message ou questions (optionnel)
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Questions spécifiques, besoins particuliers, etc."
              className="bg-gray-50 border-0 min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="conditions"
              checked={formData.acceptConditions}
              onChange={(e) => handleChange("acceptConditions", e.target.checked)}
              className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <Label
              htmlFor="conditions"
              className="text-sm text-gray-600 cursor-pointer"
            >
              J'accepte de participer à cet événement et m'engage à respecter les modalités d'organisation. 
              Je comprends que ma participation sera confirmée sous réserve de places disponibles.
            </Label>
          </div>
          {errors.acceptConditions && (
            <p className="text-red-500 text-sm">{errors.acceptConditions}</p>
          )}

          <Button
            onClick={handleSubmit}
            className="bg-red-700 hover:bg-red-800 text-white w-full"
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Confirmer mon inscription"}
          </Button>
        </div>
      </div>
    </div>
  );
}
