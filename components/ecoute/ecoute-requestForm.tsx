"use client"
import { useEffect, useState } from "react";
import { ArrowLeft, Check, HeartHandshake, CalendarDays, Clock, CheckCircle } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Select,
  ListBox,
  TextArea,
  TextField,
  Description,
  Card,
} from "@heroui/react";
import { EcouteType, CreateEcouteSchema } from "@/features/ecoute/schemas/ecoute.schema";
import { ecouteAPI } from "@/features/ecoute/apis/ecoute.api";
import { timeSlotAPI } from "@/features/time-slot/apis/time-slot.api";
import type { ISlotOccurrence } from "@/features/time-slot/types/time-slot.type";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface EcouteFormData {
  type: string;
  fullname: string;
  phone: string;
  availability: string;
  message: string;
  acceptConditions: boolean;
}

const EcouteRequestForm = () => {
  const [formData, setFormData] = useState<EcouteFormData>({
    type: "",
    fullname: "",
    phone: "",
    availability: "",
    message: "",
    acceptConditions: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ISlotOccurrence | null>(null);
  const [slots, setSlots] = useState<ISlotOccurrence[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  useEffect(() => {
    timeSlotAPI
      .obtenirDisponibles("ecoute", 6)
      .then((res) => setSlots(res.data ?? []))
      .catch(() => toast.error("Impossible de charger les créneaux d'écoute"))
      .finally(() => setSlotsLoading(false));
  }, []);

  const handleChange = (field: keyof EcouteFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    const toastId = toast.loading("Envoi de votre demande...");
    try {
      if (!selectedSlot) {
        setErrors((p) => ({ ...p, availability: "Choisissez un créneau d'écoute parmi ceux proposés." }));
        toast.error("Choisissez un créneau", { id: toastId });
        setLoading(false);
        return;
      }
      // Construire availability lisible pour l'admin + payload final
      const availabilityLabel = selectedSlot.label;
      const submitData: EcouteType = {
        ...formData,
        availability: availabilityLabel,
        request_status: "pending" as const,
      };
      const result = CreateEcouteSchema.safeParse(submitData);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
        toast.error("Veuillez corriger les erreurs", { id: toastId });
        return;
      }
      // Strip acceptConditions + injecter time_slot_id et listen_at
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { acceptConditions, ...apiPayload } = result.data;
      const enrichedPayload = {
        ...apiPayload,
        time_slot_id: selectedSlot.slot_id,
        listen_at: `${selectedSlot.date}T${selectedSlot.start_time}:00`,
      } as typeof apiPayload & { time_slot_id: number; listen_at: string };
      await ecouteAPI.ajouter(enrichedPayload);
      toast.success("Demande envoyée avec succès", { id: toastId });
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ type: "", fullname: "", phone: "", availability: "", message: "", acceptConditions: false });
    setShowSuccess(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/mvt-id.jpg" alt="Écoute spirituelle" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Accueil</span>
        </Link>
      </div>

      {/* Form card */}
      <div className="relative z-10 w-full max-w-xl mx-4 my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl mb-4">
            <HeartHandshake className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Demander une Écoute</h1>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Un prêtre est disponible pour vous écouter et vous accompagner.
          </p>
        </div>

        {/* Card */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          <Card.Header className="px-6 pt-6 pb-4 border-b border-gray-100">
            <Card.Description>
              Remplissez ce formulaire et nous vous contacterons rapidement pour organiser cette rencontre.
            </Card.Description>
          </Card.Header>

          <Card.Content className="p-6 space-y-5">
            <Select
              placeholder="Sélectionnez un type"
              selectedKey={formData.type || undefined}
              onSelectionChange={(key) => handleChange("type", String(key))}
            >
              <Label>Type d&apos;écoute (optionnel)</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="spirituel" textValue="Accompagnement spirituel">Accompagnement spirituel</ListBox.Item>
                  <ListBox.Item id="conseil" textValue="Conseil">Conseil</ListBox.Item>
                  <ListBox.Item id="confession" textValue="Confession">Confession</ListBox.Item>
                  <ListBox.Item id="echange" textValue="Échange">Échange</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <TextField
              isRequired
              value={formData.fullname}
              onChange={(val) => handleChange("fullname", val)}
              isInvalid={!!errors.fullname}
            >
              <Label>Nom et prénom</Label>
              <Input placeholder="Jean Dupont" />
              {errors.fullname && <Description className="text-red-500 text-xs">{errors.fullname}</Description>}
            </TextField>

            <TextField
              value={formData.phone}
              onChange={(val) => handleChange("phone", val)}
            >
              <Label>Téléphone (optionnel)</Label>
              <Input type="tel" placeholder="+225 07 00 00 00 00" />
            </TextField>

            <div>
              <Label className="block mb-1 text-sm font-medium text-gray-700">
                Choisir un créneau d&apos;écoute *
              </Label>
              <p className="text-xs text-gray-500 mb-3">
                Sélectionnez un créneau parmi ceux proposés par la paroisse.
              </p>

              {slotsLoading && (
                <div className="text-center py-6 text-gray-400 text-sm">Chargement...</div>
              )}

              {!slotsLoading && slots.length === 0 && (
                <div className="text-center py-6 px-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-amber-800 text-sm font-medium">
                    Aucun créneau d&apos;écoute disponible pour le moment.
                  </p>
                  <p className="text-amber-700 text-xs mt-1">
                    Veuillez contacter la paroisse directement.
                  </p>
                </div>
              )}

              {!slotsLoading && slots.length > 0 && (
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
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
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <CalendarDays className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
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
                          {isSelected && <CheckCircle className="w-5 h-5 text-[#2d2d83] shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {errors.availability && <p className="text-red-500 text-xs mt-1">{errors.availability}</p>}
            </div>

            <TextField
              value={formData.message}
              onChange={(val) => handleChange("message", val)}
              isInvalid={!!errors.message}
            >
              <Label>Message ou questions</Label>
              <TextArea placeholder="Décrivez brièvement votre besoin..." rows={3} />
              {errors.message && <Description className="text-red-500 text-xs">{errors.message}</Description>}
            </TextField>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <input
                type="checkbox"
                id="conditions"
                checked={formData.acceptConditions}
                onChange={(e) => handleChange("acceptConditions", e.target.checked)}
                className="mt-1 accent-[#2d2d83]"
              />
              <label htmlFor="conditions" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                J&apos;accepte les conditions de participation et j&apos;ai pris connaissance des modalités
              </label>
            </div>
            {errors.acceptConditions && <p className="text-red-500 text-xs">{errors.acceptConditions}</p>}

            <Button
              variant="primary"
              className="w-full bg-[#98141f] rounded-xl py-3"
              isDisabled={loading}
              onPress={handleSubmit}
            >
              {loading ? "Envoi..." : "Envoyer ma demande"}
            </Button>
          </Card.Content>
        </Card>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <Card.Header>
              <Card.Title className="text-xl font-bold text-[#2d2d83]">Demande envoyée</Card.Title>
              <Card.Description>
                Un membre de notre équipe paroissiale prendra contact avec vous sous 48 heures.
              </Card.Description>
            </Card.Header>
            <Card.Footer className="justify-center mt-4">
              <Button variant="primary" className="bg-[#98141f] rounded-xl px-8" onPress={handleReset}>
                Nouvelle demande
              </Button>
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EcouteRequestForm;
