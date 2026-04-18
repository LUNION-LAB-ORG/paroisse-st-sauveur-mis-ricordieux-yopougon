"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, CalendarPlus, DollarSign, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  Button,
  TextField,
  Label,
  Input,
  TextArea,
  Description,
  NumberField,
  DatePicker,
  DateField,
  Calendar as HeroCalendar,
  TimeField,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import type { DateValue, TimeValue } from "@heroui/react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";
import { PricingTiersEditor, type PricingTier } from "@/components/admin/pricing-tiers-editor";
import { DateTimePicker } from "@/components/admin/datetime-picker";
import { ToggleSwitch } from "@/components/admin/toggle-switch";

export default function NewEventPage() {
  const router = useRouter();

  // Champs principaux
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationAt, setLocationAt] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Config paiement (indépendant)
  const [isPaid, setIsPaid] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);

  // Inscription (indépendant du paiement)
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");

  // État
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Le titre est obligatoire";
    if (!description.trim()) errs.description = "La description est obligatoire";
    if (!locationAt.trim()) errs.locationAt = "Le lieu est obligatoire";
    if (!selectedDate) errs.selectedDate = "La date est obligatoire";
    if (!selectedTime) errs.selectedTime = "L'heure est obligatoire";
    if (isPaid) {
      if (pricingTiers.length === 0) {
        errs.pricing = "Ajoutez au moins un tarif pour un événement payant";
      } else {
        const invalid = pricingTiers.find(t => !t.label.trim() || t.amount < 100);
        if (invalid) errs.pricing = "Chaque tarif doit avoir un nom et un montant ≥ 100 XOF";
      }
    }
    if (maxParticipants && (isNaN(Number(maxParticipants)) || Number(maxParticipants) < 1)) {
      errs.maxParticipants = "Nombre invalide";
    }
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
        : "";

      const lowestPrice = isPaid && pricingTiers.length
        ? Math.min(...pricingTiers.map(t => t.amount))
        : null;

      if (imageFile) {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        fd.append("location_at", locationAt);
        fd.append("date_at", dateStr);
        fd.append("time_at", timeStr);
        fd.append("is_paid", isPaid ? "1" : "0");
        if (lowestPrice !== null) fd.append("price", String(lowestPrice));
        if (isPaid && pricingTiers.length) {
          pricingTiers.forEach((tier, i) => {
            fd.append(`pricing_tiers[${i}][label]`, tier.label);
            fd.append(`pricing_tiers[${i}][amount]`, String(tier.amount));
            if (tier.description) fd.append(`pricing_tiers[${i}][description]`, tier.description);
          });
        }
        if (maxParticipants) fd.append("max_participants", maxParticipants);
        if (registrationDeadline) fd.append("registration_deadline", registrationDeadline);
        fd.append("image", imageFile);
        await evenementAPI.ajouter(fd);
      } else {
        await evenementAPI.ajouter({
          title,
          description,
          location_at: locationAt,
          date_at: dateStr,
          time_at: timeStr,
          is_paid: isPaid,
          price: lowestPrice,
          pricing_tiers: isPaid && pricingTiers.length ? pricingTiers : null,
          max_participants: maxParticipants ? Number(maxParticipants) : null,
          registration_deadline: registrationDeadline || null,
        });
      }
      toast.success("Événement créé avec succès");
      router.push("/dashboard/evenements");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de la création");
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
            href="/dashboard/evenements"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Nouvel événement</h1>
            <p className="text-sm text-gray-500">Créez un événement paroissial</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/evenements">
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
            <Save className="w-4 h-4" /> {submitting ? "Création..." : "Créer l'événement"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main — 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <CalendarPlus className="w-4 h-4" /> Informations générales
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <TextField value={title} onChange={setTitle} isInvalid={!!errors.title}>
                <Label>Titre de l&apos;événement *</Label>
                <Input placeholder="Ex : Messe de Pâques 2026" />
                {errors.title && <Description className="text-red-500 text-xs">{errors.title}</Description>}
              </TextField>

              <TextField
                value={description}
                onChange={setDescription}
                isInvalid={!!errors.description}
              >
                <Label>Description *</Label>
                <TextArea placeholder="Décrivez l'événement, son déroulement, son objectif..." rows={6} />
                {errors.description && <Description className="text-red-500 text-xs">{errors.description}</Description>}
              </TextField>

              <TextField value={locationAt} onChange={setLocationAt} isInvalid={!!errors.locationAt}>
                <Label>Lieu *</Label>
                <Input placeholder="Ex : Église Saint-Sauveur Miséricordieux, Yopougon" />
                {errors.locationAt && <Description className="text-red-500 text-xs">{errors.locationAt}</Description>}
              </TextField>

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
                    <HeroCalendar aria-label="Date de l'événement">
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

          {/* Tarifs */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Tarification
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-800">Événement payant</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Les participants devront payer pour s&apos;inscrire
                  </p>
                </div>
                <ToggleSwitch isSelected={isPaid} onChange={(v) => {
                  setIsPaid(v);
                  if (!v) setPricingTiers([]);
                }} aria-label="Activer événement payant" />
              </div>

              {isPaid && (
                <>
                  <PricingTiersEditor tiers={pricingTiers} onChange={setPricingTiers} />
                  {errors.pricing && (
                    <p className="text-red-500 text-xs">{errors.pricing}</p>
                  )}
                </>
              )}
            </Card.Content>
          </Card>

          {/* Inscription & places (indépendant du paiement) */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Users className="w-4 h-4" /> Inscription & places
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <NumberField
                fullWidth
                value={maxParticipants === "" ? NaN : Number(maxParticipants)}
                onChange={(v) => setMaxParticipants(isNaN(v) ? "" : String(v))}
                minValue={1}
                step={1}
                isInvalid={!!errors.maxParticipants}
              >
                <Label>Nombre max de participants (optionnel)</Label>
                <NumberField.Group>
                  <NumberField.Input placeholder="Laissez vide pour illimité" />
                  <NumberField.DecrementButton />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                {errors.maxParticipants && (
                  <Description className="text-red-500 text-xs">{errors.maxParticipants}</Description>
                )}
              </NumberField>

              <DateTimePicker
                label="Date limite d'inscription (optionnel)"
                value={registrationDeadline}
                onChange={setRegistrationDeadline}
                disableBeforeToday
                helper="Les inscriptions seront fermées automatiquement après cette date"
              />
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-5">
          {/* Image */}
          <Card>
            <Card.Content className="p-5">
              <ImageUploadField onChange={setImageFile} title="Image principale" />
            </Card.Content>
          </Card>

          {/* Aperçu */}
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83]">Aperçu</Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5 space-y-3 text-xs">
              <div className="flex items-start gap-2 text-gray-500">
                <CalendarPlus className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">{title || "(titre)"}</p>
                  <p>
                    {selectedDate
                      ? `${String(selectedDate.day).padStart(2, "0")}/${String(selectedDate.month).padStart(2, "0")}/${selectedDate.year}`
                      : "—"}
                    {selectedTime &&
                      ` à ${String(selectedTime.hour).padStart(2, "0")}:${String(selectedTime.minute).padStart(2, "0")}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-gray-500">
                <Users className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  {isPaid && pricingTiers.length
                    ? `Payant • ${pricingTiers.map(t => `${t.label} ${t.amount} XOF`).join(" / ")}`
                    : "Gratuit"}
                  {maxParticipants && ` • ${maxParticipants} places max`}
                </p>
              </div>
              {registrationDeadline && (
                <div className="flex items-start gap-2 text-gray-500">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>
                    Clôture :{" "}
                    {new Date(registrationDeadline).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
