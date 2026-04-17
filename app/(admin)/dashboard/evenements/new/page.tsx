"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ImageIcon, CalendarPlus, DollarSign, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  Button,
  TextField,
  Label,
  Input,
  TextArea,
  Description,
  Switch,
} from "@heroui/react";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";

export default function NewEventPage() {
  const router = useRouter();

  // Champs principaux
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationAt, setLocationAt] = useState("");
  const [dateAt, setDateAt] = useState("");
  const [timeAt, setTimeAt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Config paiement
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");

  // État
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image trop lourde (max 5 Mo)");
      return;
    }
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Le titre est obligatoire";
    if (!description.trim()) errs.description = "La description est obligatoire";
    if (!locationAt.trim()) errs.locationAt = "Le lieu est obligatoire";
    if (!dateAt) errs.dateAt = "La date est obligatoire";
    if (!timeAt) errs.timeAt = "L'heure est obligatoire";
    if (isPaid) {
      const p = Number(price);
      if (!price || isNaN(p) || p < 100) errs.price = "Prix minimum 100 XOF";
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
      const payload: Record<string, unknown> = {
        title,
        description,
        location_at: locationAt,
        date_at: dateAt,
        time_at: timeAt,
        is_paid: isPaid,
        price: isPaid ? Number(price) : null,
        max_participants: maxParticipants ? Number(maxParticipants) : null,
        registration_deadline: registrationDeadline || null,
      };
      if (imageFile) payload.image = imageFile;

      await evenementAPI.ajouter(payload);
      toast.success("Événement créé avec succès");
      router.push("/dashboard/evenements");
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={dateAt}
                    onChange={(e) => setDateAt(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/50 ${
                      errors.dateAt ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.dateAt && <p className="text-red-500 text-xs mt-1">{errors.dateAt}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label>
                  <input
                    type="time"
                    value={timeAt}
                    onChange={(e) => setTimeAt(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/50 ${
                      errors.timeAt ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.timeAt && <p className="text-red-500 text-xs mt-1">{errors.timeAt}</p>}
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Paiement */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Configuration de l&apos;inscription
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-800">Événement payant</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Les participants paieront via Wave Money avant d&apos;être inscrits
                  </p>
                </div>
                <Switch isSelected={isPaid} onChange={setIsPaid} />
              </div>

              {isPaid && (
                <TextField value={price} onChange={setPrice} isInvalid={!!errors.price}>
                  <Label>Prix par participant (XOF) *</Label>
                  <Input type="number" placeholder="Ex : 2000" inputMode="numeric" />
                  {errors.price && <Description className="text-red-500 text-xs">{errors.price}</Description>}
                </TextField>
              )}

              <TextField
                value={maxParticipants}
                onChange={setMaxParticipants}
                isInvalid={!!errors.maxParticipants}
              >
                <Label>Nombre max de participants (optionnel)</Label>
                <Input type="number" placeholder="Laissez vide pour illimité" inputMode="numeric" />
                {errors.maxParticipants && (
                  <Description className="text-red-500 text-xs">{errors.maxParticipants}</Description>
                )}
              </TextField>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date limite d&apos;inscription (optionnel)
                </label>
                <input
                  type="datetime-local"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Les inscriptions seront fermées automatiquement après cette date
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-5">
          {/* Image */}
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83]">
                Image principale
              </Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5">
              <label className="block border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[#2d2d83]/30 transition-colors cursor-pointer">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Prévisualisation"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="p-8 text-center">
                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cliquez pour ajouter</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 5Mo)</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imageFile && (
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span className="truncate">{imageFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="text-red-500 hover:underline ml-2 shrink-0"
                  >
                    Retirer
                  </button>
                </div>
              )}
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
                    {dateAt || "—"} {timeAt && `à ${timeAt}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-gray-500">
                <Users className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  {isPaid ? `Payant • ${price || "?"} XOF` : "Gratuit"}
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
