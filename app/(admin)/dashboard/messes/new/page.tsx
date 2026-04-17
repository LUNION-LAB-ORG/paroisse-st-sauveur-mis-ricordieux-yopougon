"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Flame, User, Calendar, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  Calendar as HeroCalendar,
  DateField,
  DatePicker,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  Switch,
  TextArea,
  TextField,
  TimeField,
} from "@heroui/react";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { today, getLocalTimeZone } from "@internationalized/date";
import type { DateValue, TimeValue } from "@heroui/react";
import { messeAPI } from "@/features/messe/apis/messe.api";
import type { IMesseCreer } from "@/features/messe/types/messe.type";

const INTENTION_TYPES = [
  { id: "action-de-grace", label: "Action de grâce" },
  { id: "repos-ame", label: "Repos de l'âme" },
  { id: "guerison", label: "Guérison" },
  { id: "protection", label: "Protection" },
  { id: "benediction", label: "Bénédiction" },
  { id: "autre", label: "Autre" },
];

export default function NewMessePage() {
  const router = useRouter();

  // Infos demandeur
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messageText, setMessageText] = useState("");

  // Détails messe
  const [intentionType, setIntentionType] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(null);
  const [amount, setAmount] = useState("3000");

  // Paiement
  const [markAsPaid, setMarkAsPaid] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!intentionType) errs.intentionType = "Type d'intention obligatoire";
    if (!fullname.trim()) errs.fullname = "Nom obligatoire";
    if (!phone.trim()) errs.phone = "Téléphone obligatoire";
    if (!messageText.trim()) errs.messageText = "Intention obligatoire";
    if (!selectedDate) errs.selectedDate = "Date obligatoire";
    if (!selectedTime) errs.selectedTime = "Heure obligatoire";
    if (!amount || Number(amount) < 0) errs.amount = "Montant invalide";
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
      const dateStr = selectedDate
        ? `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`
        : "";
      const timeStr = selectedTime
        ? `${String(selectedTime.hour).padStart(2, "0")}:${String(selectedTime.minute).padStart(2, "0")}`
        : "00:00";
      const isoDateTime = new Date(`${dateStr}T${timeStr}`).toISOString();
      const payload: IMesseCreer = {
        type: intentionType,
        fullname,
        email: email.trim() || null,
        phone,
        message: messageText,
        amount: Number(amount),
        date_at: isoDateTime,
        time_at: isoDateTime,
        request_status: "accepted", // créé manuellement par l'admin → confirmée par défaut
        payment_status: markAsPaid ? "succeeded" : "pending",
      };
      await messeAPI.ajouter(payload);
      toast.success("Messe créée avec succès");
      router.push("/dashboard/messes");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/messes"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Nouvelle messe</h1>
            <p className="text-sm text-gray-500">Création manuelle d&apos;une intention de messe</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/messes">
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
            <Save className="w-4 h-4" /> {submitting ? "Création..." : "Créer la messe"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Intention */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Flame className="w-4 h-4" /> Intention de messe
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <Select
                placeholder="Sélectionnez un type"
                selectedKey={intentionType || undefined}
                onSelectionChange={(key) => setIntentionType(String(key))}
                isInvalid={!!errors.intentionType}
              >
                <Label>Type d&apos;intention *</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {INTENTION_TYPES.map((t) => (
                      <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                        {t.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                {errors.intentionType && (
                  <Description className="text-red-500 text-xs">{errors.intentionType}</Description>
                )}
              </Select>

              <TextField
                value={messageText}
                onChange={setMessageText}
                isInvalid={!!errors.messageText}
              >
                <Label>Intention détaillée *</Label>
                <TextArea placeholder="Décrivez l'intention de la messe..." rows={4} />
                {errors.messageText && (
                  <Description className="text-red-500 text-xs">{errors.messageText}</Description>
                )}
              </TextField>
            </Card.Content>
          </Card>

          {/* Demandeur */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <User className="w-4 h-4" /> Coordonnées du demandeur
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField value={phone} onChange={setPhone} isInvalid={!!errors.phone}>
                  <Label>Téléphone *</Label>
                  <Input type="tel" placeholder="+225 07 00 00 00 00" />
                  {errors.phone && (
                    <Description className="text-red-500 text-xs">{errors.phone}</Description>
                  )}
                </TextField>

                <TextField value={email} onChange={setEmail}>
                  <Label>Email (optionnel)</Label>
                  <Input type="email" placeholder="exemple@email.com" />
                </TextField>
              </div>
            </Card.Content>
          </Card>

          {/* Date et heure */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date et heure souhaitées
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  className="w-full"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  minValue={today(getLocalTimeZone())}
                  isInvalid={!!errors.selectedDate}
                >
                  <Label>Date *</Label>
                  <DateField.Group fullWidth>
                    <DateField.Input>
                      {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateField.Suffix>
                      <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator />
                      </DatePicker.Trigger>
                    </DateField.Suffix>
                  </DateField.Group>
                  <DatePicker.Popover>
                    <HeroCalendar aria-label="Date de messe">
                      <HeroCalendar.Header>
                        <HeroCalendar.NavButton slot="previous" />
                        <HeroCalendar.Heading />
                        <HeroCalendar.NavButton slot="next" />
                      </HeroCalendar.Header>
                      <HeroCalendar.Grid>
                        <HeroCalendar.GridHeader>
                          {(day) => <HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>}
                        </HeroCalendar.GridHeader>
                        <HeroCalendar.GridBody>
                          {(date) => <HeroCalendar.Cell date={date} />}
                        </HeroCalendar.GridBody>
                      </HeroCalendar.Grid>
                    </HeroCalendar>
                  </DatePicker.Popover>
                  {errors.selectedDate && (
                    <Description className="text-red-500 text-xs">{errors.selectedDate}</Description>
                  )}
                </DatePicker>

                <TimeField
                  className="w-full"
                  value={selectedTime}
                  onChange={setSelectedTime}
                  isInvalid={!!errors.selectedTime}
                >
                  <Label>Heure *</Label>
                  <TimeField.Group>
                    <TimeField.Input>
                      {(segment) => <TimeField.Segment segment={segment} />}
                    </TimeField.Input>
                  </TimeField.Group>
                  {errors.selectedTime && (
                    <Description className="text-red-500 text-xs">{errors.selectedTime}</Description>
                  )}
                </TimeField>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar — paiement */}
        <div className="space-y-5">
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Paiement
              </Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5 space-y-4">
              <TextField value={amount} onChange={setAmount} isInvalid={!!errors.amount}>
                <Label>Montant (XOF)</Label>
                <Input type="number" inputMode="numeric" />
                {errors.amount && (
                  <Description className="text-red-500 text-xs">{errors.amount}</Description>
                )}
              </TextField>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-800">Déjà payé</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Cochez si le paiement a déjà été réglé à la paroisse
                  </p>
                </div>
                <ToggleSwitch isSelected={markAsPaid} onChange={setMarkAsPaid} aria-label="Marquer comme payé" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-800">
                  {markAsPaid
                    ? "La messe sera marquée comme payée immédiatement."
                    : "La messe sera créée en attente de paiement. Vous pourrez la marquer payée plus tard depuis la liste."}
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
