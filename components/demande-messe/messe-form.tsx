"use client";
import { messeAPI } from "@/features/messe/apis/messe.api";
import { waveAPI } from "@/features/don/apis/wave.api";
import { timeSlotAPI } from "@/features/time-slot/apis/time-slot.api";
import type { ISlotOccurrence } from "@/features/time-slot/types/time-slot.type";
import { ArrowLeft, CheckCircle, Church, Clock, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Input,
  Label,
  Select,
  ListBox,
  TextArea,
  TextField,
  RadioGroup,
  Radio,
  Description,
  Card,
} from "@heroui/react";
import { IntentionType } from "@/features/messe/schemas/messe.schema";

export default function MesseForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    intentionType: "",
    amount: 2000,
    message: "",
    firstName: "",
    email: "",
    phone: "",
    request_status: "pending" as const,
    paymentMethod: "online",
  });
  const [selectedSlot, setSelectedSlot] = useState<ISlotOccurrence | null>(null);
  const [slots, setSlots] = useState<ISlotOccurrence[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Charger les créneaux quand on arrive à l'étape 3
  useEffect(() => {
    if (currentStep === 3 && slots.length === 0) {
      setSlotsLoading(true);
      timeSlotAPI
        .obtenirDisponibles("messe", 8)
        .then((res) => setSlots(res.data ?? []))
        .catch(() => toast.error("Impossible de charger les créneaux"))
        .finally(() => setSlotsLoading(false));
    }
  }, [currentStep, slots.length]);

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const handleNextStep = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.intentionType) errors.intentionType = "Veuillez sélectionner un type d'intention";
    }
    if (currentStep === 2) {
      if (!formData.firstName.trim()) errors.firstName = "Le nom est obligatoire";
    }
    if (currentStep === 3) {
      if (!selectedSlot) errors.selectedSlot = "Veuillez sélectionner un créneau parmi ceux proposés";
    }

    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setStepErrors({});
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const toastId = toast.loading("Envoi de votre demande...");
    try {
      if (!selectedSlot) {
        toast.error("Veuillez choisir un créneau.", { id: toastId });
        setLoading(false);
        return;
      }
      const dateStr = selectedSlot.date;
      const timeStr = selectedSlot.start_time;
      const isoDateTime = new Date(`${dateStr}T${timeStr}`).toISOString();

      const payload: IntentionType = {
        type: formData.intentionType,
        fullname: formData.firstName,
        email: formData.email || null,
        phone: formData.phone,
        message: formData.message,
        amount: 3000,
        date_at: isoDateTime,
        time_at: isoDateTime,
        request_status: formData.request_status,
        // Paiement espèces à la paroisse → en attente tant que non validé dans le dashboard
        payment_status: "pending",
      };

      if (formData.paymentMethod === "online") {
        // Paiement Wave — enregistrement + redirection
        const result = await waveAPI.createCheckout({
          amount: 3000,
          type: "messe",
          donator: formData.firstName || "Anonyme",
          description: formData.message || `Intention: ${formData.intentionType}`,
          mess_type: formData.intentionType,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          date_at: dateStr || undefined,
          time_at: timeStr || undefined,
        });
        toast.success("Redirection vers Wave...", { id: toastId });
        window.location.href = result.wave_launch_url;
        return;
      }

      // Paiement à la paroisse — enregistrement seul
      await messeAPI.ajouter(payload);
      toast.success("Demande envoyée avec succès", { id: toastId });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      intentionType: "",
      amount: 3000,
      message: "",
      firstName: "",
      email: "",
      phone: "",
      request_status: "pending",
      paymentMethod: "online",
    });
    setSelectedSlot(null);
    setSlots([]);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const steps = [
    { title: "Type d'intention", description: "Choisissez le type d'intention" },
    { title: "Vos coordonnées", description: "Informations du demandeur" },
    { title: "Date et heure", description: "Planifiez votre messe" },
    { title: "Confirmation", description: "Récapitulatif et paiement" },
  ];

  // ─── SUCCESS STATE ───
  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/images/hero-histoire.jpg" alt="Église" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
        </div>
        <div className="relative z-10 w-full max-w-md mx-4">
          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <Card.Header>
              <Card.Title className="text-2xl font-bold text-[#2d2d83]">Demande envoyée</Card.Title>
              <Card.Description className="text-gray-600 leading-relaxed">
                Votre demande a bien été enregistrée. Un membre de notre équipe paroissiale vous contactera sous 48 heures.
              </Card.Description>
            </Card.Header>
            <Card.Footer className="flex flex-col gap-3 mt-4">
              <Button variant="primary" className="w-full bg-[#98141f] rounded-xl" onPress={resetForm}>
                Nouvelle demande
              </Button>
              <Link href="/" className="text-[#2d2d83] hover:underline text-sm font-medium">
                Retour à l&apos;accueil
              </Link>
            </Card.Footer>
          </Card>
        </div>
      </div>
    );
  }

  // ─── FORM ───
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/hero-histoire.jpg" alt="Église" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      {/* Back to home (always) */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Accueil</span>
        </Link>
      </div>

      {/* Form card */}
      <div className="relative z-10 w-full max-w-lg mx-4 my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl mb-4">
            <Church className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Demande de Messe</h1>
          <p className="text-white/70 text-sm">Faites célébrer une messe pour vos intentions</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? "bg-white w-10" : "bg-white/30 w-6"}`} />
          ))}
        </div>

        {/* Card */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Step title */}
          <Card.Header className="px-6 pt-6 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-[#98141f] uppercase tracking-wider mb-1">
              Étape {currentStep} sur 4
            </p>
            <Card.Title className="text-lg font-bold text-[#2d2d83]">{steps[currentStep - 1].title}</Card.Title>
            <Card.Description>{steps[currentStep - 1].description}</Card.Description>
          </Card.Header>

          {/* Form content */}
          <Card.Content className="p-6">
            {currentStep === 1 && (
              <div className="space-y-5">
                <Select
                  placeholder="Sélectionnez un type"
                  selectedKey={formData.intentionType || undefined}
                  onSelectionChange={(key) => setFormData((prev) => ({ ...prev, intentionType: String(key) }))}
                >
                  <Label>Type d&apos;intention</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="action-de-grace" textValue="Action de grâce">Action de grâce</ListBox.Item>
                      <ListBox.Item id="repos-ame" textValue="Repos de l'âme">Repos de l&apos;âme</ListBox.Item>
                      <ListBox.Item id="guerison" textValue="Guérison">Guérison</ListBox.Item>
                      <ListBox.Item id="protection" textValue="Protection">Protection</ListBox.Item>
                      <ListBox.Item id="benediction" textValue="Bénédiction">Bénédiction</ListBox.Item>
                      <ListBox.Item id="autre" textValue="Autre">Autre</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
                {stepErrors.intentionType && (
                  <p className="text-red-500 text-xs mt-1">{stepErrors.intentionType}</p>
                )}

                <TextField
                  value={formData.message}
                  onChange={(val) => setFormData((prev) => ({ ...prev, message: val }))}
                >
                  <Label>Votre intention</Label>
                  <TextArea placeholder="Décrivez votre intention de messe..." rows={3} />
                </TextField>

                <div className="flex justify-between pt-2">
                  <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#2d2d83] px-4 py-2 rounded-xl">
                    <ArrowLeft size={16} /> Annuler
                  </Link>
                  <Button variant="primary" className="bg-[#2d2d83] rounded-xl px-6" onPress={handleNextStep}>
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <TextField
                  value={formData.firstName}
                  onChange={(val) => setFormData((prev) => ({ ...prev, firstName: val }))}
                  isInvalid={!!stepErrors.firstName}
                >
                  <Label>Nom et prénom</Label>
                  <Input placeholder="Jean Dupont" />
                  {stepErrors.firstName && (
                    <Description className="text-red-500 text-xs">{stepErrors.firstName}</Description>
                  )}
                </TextField>

                <TextField
                  value={formData.email}
                  onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
                >
                  <Label>Adresse e-mail</Label>
                  <Input type="email" placeholder="jean@exemple.com" />
                </TextField>

                <TextField
                  value={formData.phone}
                  onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                >
                  <Label>Téléphone (optionnel)</Label>
                  <Input type="tel" placeholder="+225 07 00 00 00 00" />
                </TextField>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" className="rounded-xl" onPress={handlePrevStep}>Précédent</Button>
                  <Button variant="primary" className="bg-[#2d2d83] rounded-xl px-6" onPress={handleNextStep}>Suivant</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <Label className="block mb-1 text-sm font-medium text-gray-700">
                    Choisir un créneau de messe
                  </Label>
                  <p className="text-xs text-gray-500 mb-4">
                    Voici les prochaines messes proposées par la paroisse. Sélectionnez le créneau qui vous convient.
                  </p>

                  {slotsLoading && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Chargement des créneaux...
                    </div>
                  )}

                  {!slotsLoading && slots.length === 0 && (
                    <div className="text-center py-8 px-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-amber-800 text-sm font-medium">
                        Aucun créneau disponible pour le moment.
                      </p>
                      <p className="text-amber-700 text-xs mt-1">
                        Veuillez contacter la paroisse directement.
                      </p>
                    </div>
                  )}

                  {!slotsLoading && slots.length > 0 && (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {slots.map((slot) => {
                        const isSelected = selectedSlot
                          ? selectedSlot.slot_id === slot.slot_id && selectedSlot.date === slot.date
                          : false;
                        return (
                          <button
                            key={`${slot.slot_id}-${slot.date}`}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "bg-[#2d2d83]/5 border-[#2d2d83]"
                                : "bg-white border-gray-200 hover:border-[#2d2d83]/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                <CalendarDays className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-semibold truncate ${
                                    isSelected ? "text-[#2d2d83]" : "text-gray-800"
                                  }`}
                                >
                                  {slot.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {slot.start_time} – {slot.end_time}
                                  {slot.available !== null && slot.capacity && (
                                    <span className="ml-2 text-gray-400">
                                      • {slot.available}/{slot.capacity} places
                                    </span>
                                  )}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-[#2d2d83] shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {stepErrors.selectedSlot && (
                  <p className="text-red-500 text-xs mt-1">{stepErrors.selectedSlot}</p>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" className="rounded-xl" onPress={handlePrevStep}>
                    Précédent
                  </Button>
                  <Button
                    variant="primary"
                    className="bg-[#2d2d83] rounded-xl px-6"
                    isDisabled={!selectedSlot}
                    onPress={handleNextStep}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5">
                <RadioGroup
                  value={formData.paymentMethod}
                  onChange={(val) => setFormData((prev) => ({ ...prev, paymentMethod: val }))}
                >
                  <Label>Mode de paiement</Label>
                  <Radio value="online">
                    <Radio.Control><Radio.Indicator /></Radio.Control>
                    <Radio.Content>
                      <Label>Paiement en ligne</Label>
                      <Description>Via Wave Money (paiement mobile sécurisé)</Description>
                    </Radio.Content>
                  </Radio>
                  <Radio value="parish">
                    <Radio.Control><Radio.Indicator /></Radio.Control>
                    <Radio.Content>
                      <Label>Paiement à la paroisse</Label>
                      <Description>En espèces ou par chèque</Description>
                    </Radio.Content>
                  </Radio>
                </RadioGroup>

                {/* Summary */}
                <Card className="bg-gray-50 p-4">
                  <Card.Header>
                    <Card.Title className="text-sm font-semibold text-[#2d2d83]">Récapitulatif</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-gray-500">Intention :</span>
                      <span className="text-gray-800 font-medium">{formData.intentionType || "—"}</span>
                      <span className="text-gray-500">Demandeur :</span>
                      <span className="text-gray-800 font-medium">{formData.firstName || "—"}</span>
                      <span className="text-gray-500">Créneau :</span>
                      <span className="text-gray-800 font-medium">
                        {selectedSlot ? selectedSlot.label : "—"}
                      </span>
                      <span className="text-gray-500">Horaire :</span>
                      <span className="text-gray-800 font-medium">
                        {selectedSlot ? `${selectedSlot.start_time} – ${selectedSlot.end_time}` : "—"}
                      </span>
                      <span className="text-gray-500">Montant :</span>
                      <span className="text-[#98141f] font-bold">3 000 XOF</span>
                    </div>
                  </Card.Content>
                </Card>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" className="rounded-xl" onPress={handlePrevStep}>Précédent</Button>
                  <Button
                    variant="primary"
                    className="bg-[#98141f] rounded-xl px-6"
                    isDisabled={loading}
                    onPress={handleSubmit}
                  >
                    {loading ? "Envoi..." : "Soumettre"}
                  </Button>
                </div>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
