"use client"
import { useState } from "react";
import { ArrowLeft, Check, X, HeartHandshake } from "lucide-react";
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
      const submitData: EcouteType = {
        ...formData,
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
      await ecouteAPI.ajouter(result.data);
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

            <Select
              placeholder="Sélectionnez vos disponibilités"
              selectedKey={formData.availability || undefined}
              onSelectionChange={(key) => handleChange("availability", String(key))}
              isInvalid={!!errors.availability}
            >
              <Label>Vos disponibilités</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="max-h-60">
                <ListBox>
                  <ListBox.Item id="lundi-matin" textValue="Lundi matin">Lundi matin</ListBox.Item>
                  <ListBox.Item id="lundi-apres-midi" textValue="Lundi après-midi">Lundi après-midi</ListBox.Item>
                  <ListBox.Item id="mardi-matin" textValue="Mardi matin">Mardi matin</ListBox.Item>
                  <ListBox.Item id="mardi-apres-midi" textValue="Mardi après-midi">Mardi après-midi</ListBox.Item>
                  <ListBox.Item id="mercredi-matin" textValue="Mercredi matin">Mercredi matin</ListBox.Item>
                  <ListBox.Item id="mercredi-apres-midi" textValue="Mercredi après-midi">Mercredi après-midi</ListBox.Item>
                  <ListBox.Item id="jeudi-matin" textValue="Jeudi matin">Jeudi matin</ListBox.Item>
                  <ListBox.Item id="jeudi-apres-midi" textValue="Jeudi après-midi">Jeudi après-midi</ListBox.Item>
                  <ListBox.Item id="vendredi-matin" textValue="Vendredi matin">Vendredi matin</ListBox.Item>
                  <ListBox.Item id="samedi-matin" textValue="Samedi matin">Samedi matin</ListBox.Item>
                  <ListBox.Item id="weekend" textValue="Weekend">Weekend</ListBox.Item>
                </ListBox>
              </Select.Popover>
              {errors.availability && <Description className="text-red-500 text-xs">{errors.availability}</Description>}
            </Select>

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
