"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HeartHandshake,
  Save,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { ecouteAPI } from "@/features/ecoute/apis/ecoute.api";
import type { IEcouteStatutDemande } from "@/features/ecoute/types/ecoute.type";

const LISTEN_TYPES = [
  { id: "spirituel", label: "Accompagnement spirituel" },
  { id: "conseil", label: "Conseil" },
  { id: "confession", label: "Confession" },
  { id: "echange", label: "Échange" },
];

const AVAILABILITIES = [
  "lundi-matin",
  "lundi-apres-midi",
  "mardi-matin",
  "mardi-apres-midi",
  "mercredi-matin",
  "mercredi-apres-midi",
  "jeudi-matin",
  "jeudi-apres-midi",
  "vendredi-matin",
  "samedi-matin",
  "weekend",
];

const STATUS_OPTIONS: Array<{ id: IEcouteStatutDemande; label: string }> = [
  { id: "pending", label: "En attente" },
  { id: "accepted", label: "Confirmée" },
  { id: "canceled", label: "Annulée" },
];

function labelFromAvailability(v: string): string {
  return v
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function NewEcoutePage() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [availability, setAvailability] = useState("");
  const [messageText, setMessageText] = useState("");
  const [requestStatus, setRequestStatus] = useState<IEcouteStatutDemande>("accepted");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullname.trim()) errs.fullname = "Nom obligatoire";
    if (!messageText.trim()) errs.messageText = "Message obligatoire";
    if (!availability) errs.availability = "Disponibilité obligatoire";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }
    setSubmitting(true);
    try {
      await ecouteAPI.ajouter({
        type: type || undefined,
        fullname,
        phone: phone || undefined,
        availability,
        message: messageText,
        request_status: requestStatus,
      } as any);
      toast.success("Demande d'écoute créée");
      router.push("/dashboard/ecoutes");
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ecoutes"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Nouvelle demande d&apos;écoute</h1>
            <p className="text-sm text-gray-500">Création manuelle par l&apos;administration</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/ecoutes">
            <Button variant="outline" className="rounded-xl text-gray-600">
              Annuler
            </Button>
          </Link>
          <Button
            variant="primary"
            className="bg-[#98141f] rounded-xl"
            isDisabled={submitting}
            onPress={handleSubmit}
          >
            <Save className="w-4 h-4" /> {submitting ? "Création..." : "Créer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Demandeur */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <User className="w-4 h-4" /> Demandeur
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <TextField value={fullname} onChange={setFullname} isInvalid={!!errors.fullname}>
                <Label>Nom complet *</Label>
                <Input placeholder="Prénom Nom" />
                {errors.fullname && (
                  <Description className="text-red-500 text-xs">{errors.fullname}</Description>
                )}
              </TextField>

              <TextField value={phone} onChange={setPhone}>
                <Label>Téléphone</Label>
                <Input type="tel" placeholder="+225 07 00 00 00 00" />
              </TextField>
            </Card.Content>
          </Card>

          {/* Détails */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" /> Demande
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <Select
                selectedKey={type || undefined}
                onSelectionChange={(k) => setType(String(k))}
              >
                <Label>Type d&apos;écoute</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {LISTEN_TYPES.map((t) => (
                      <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                        {t.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <TextField
                value={messageText}
                onChange={setMessageText}
                isInvalid={!!errors.messageText}
              >
                <Label>Message *</Label>
                <TextArea placeholder="Décrivez la demande..." rows={5} />
                {errors.messageText && (
                  <Description className="text-red-500 text-xs">{errors.messageText}</Description>
                )}
              </TextField>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Disponibilité & statut
              </Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5 space-y-4">
              <Select
                selectedKey={availability || undefined}
                onSelectionChange={(k) => setAvailability(String(k))}
                isInvalid={!!errors.availability}
              >
                <Label>Disponibilité *</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="max-h-60">
                  <ListBox>
                    {AVAILABILITIES.map((v) => (
                      <ListBox.Item key={v} id={v} textValue={labelFromAvailability(v)}>
                        {labelFromAvailability(v)}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                {errors.availability && (
                  <Description className="text-red-500 text-xs">{errors.availability}</Description>
                )}
              </Select>

              <Select
                selectedKey={requestStatus}
                onSelectionChange={(k) => setRequestStatus(String(k) as IEcouteStatutDemande)}
              >
                <Label>Statut initial</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {STATUS_OPTIONS.map((s) => (
                      <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                        {s.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
