"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  ClipboardList,
  Clock,
  DollarSign,
  ImageIcon,
  Loader2,
  Mail,
  Phone,
  Save,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
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
  Switch,
  TextArea,
  TextField,
  TimeField,
} from "@heroui/react";
import { CalendarDate, Time } from "@internationalized/date";
import type { DateValue, TimeValue } from "@heroui/react";
import { PricingTiersEditor, type PricingTier } from "@/components/admin/pricing-tiers-editor";
import { DateTimePicker } from "@/components/admin/datetime-picker";
import { StatCard } from "@/components/admin/stat-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";
import { participantAPI } from "@/features/participant/apis/participant.api";
import type { IEvenement } from "@/features/evenement/types/evenement.type";
import type { IParticipant } from "@/features/participant/types/participant.type";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

type PaymentStatus = IParticipant["payment_status"];

function PaymentBadge({ status }: { status: PaymentStatus }) {
  if (!status || status === "pending") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        En attente
      </span>
    );
  }
  if (status === "paid" || status === "succeeded") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Payé
      </span>
    );
  }
  if (status === "free") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Gratuit
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
        Échoué
      </span>
    );
  }
  return null;
}

type Tab = "infos" | "participants" | "config";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<IEvenement | null>(null);
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("infos");

  // Infos form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationAt, setLocationAt] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Config form (tarifs)
  const [isPaid, setIsPaid] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);

  // Places & inscription (indépendant)
  const [maxParticipants, setMaxParticipants] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");

  // Actions
  const [savingInfos, setSavingInfos] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [deleteParticipantId, setDeleteParticipantId] = useState<number | null>(null);
  const [deletingParticipant, setDeletingParticipant] = useState(false);
  const [deleteEventOpen, setDeleteEventOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);

  // Errors
  const [infosErrors, setInfosErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      evenementAPI.obtenirParId(id).catch(() => null),
      participantAPI.obtenirTous({ event_id: id }).catch(() => ({ data: [] as IParticipant[] })),
    ])
      .then(([ev, parts]) => {
        const e = ev as IEvenement | null;
        setEvent(e);
        setParticipants((parts as { data: IParticipant[] }).data ?? []);
        if (e) {
          setTitle(e.title ?? "");
          setDescription(e.description ?? "");
          setLocationAt(e.location_at ?? "");
          if (e.date_at) {
            const d = new Date(e.date_at);
            setSelectedDate(new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate()));
          }
          if (e.time_at) {
            // time_at peut être "HH:mm" ou ISO
            const timeStr = typeof e.time_at === "string" ? e.time_at : "";
            const match = timeStr.match(/(\d{1,2}):(\d{2})/);
            if (match) {
              setSelectedTime(new Time(Number(match[1]), Number(match[2])));
            }
          }
          if (e.image) setImagePreview(e.image);
          setIsPaid(e.is_paid ?? false);
          setPricingTiers(Array.isArray(e.pricing_tiers) ? e.pricing_tiers : []);
          setMaxParticipants(
            e.max_participants !== null && e.max_participants !== undefined
              ? String(e.max_participants)
              : "",
          );
          setRegistrationDeadline(
            e.registration_deadline ? e.registration_deadline.slice(0, 16) : "",
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  const validateInfos = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Le titre est obligatoire";
    if (!description.trim()) errs.description = "La description est obligatoire";
    if (!locationAt.trim()) errs.locationAt = "Le lieu est obligatoire";
    if (!selectedDate) errs.selectedDate = "La date est obligatoire";
    if (!selectedTime) errs.selectedTime = "L'heure est obligatoire";
    setInfosErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveInfos = async () => {
    if (!validateInfos()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }
    setSavingInfos(true);
    try {
      const dateStr = selectedDate
        ? `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`
        : "";
      const timeStr = selectedTime
        ? `${String(selectedTime.hour).padStart(2, "0")}:${String(selectedTime.minute).padStart(2, "0")}`
        : "";

      let updated;
      if (imageFile) {
        const fd = new FormData();
        fd.append("_method", "PUT");
        fd.append("title", title);
        fd.append("description", description);
        fd.append("location_at", locationAt);
        fd.append("date_at", dateStr);
        fd.append("time_at", timeStr);
        fd.append("image", imageFile);
        updated = await evenementAPI.modifier(id, fd);
      } else {
        updated = await evenementAPI.modifier(id, {
          title,
          description,
          location_at: locationAt,
          date_at: dateStr,
          time_at: timeStr,
        });
      }
      setEvent(updated);
      toast.success("Informations enregistrées");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de la sauvegarde");
    } finally {
      setSavingInfos(false);
    }
  };

  const handleSaveConfig = async () => {
    if (isPaid && pricingTiers.length === 0) {
      toast.error("Ajoutez au moins un tarif pour un événement payant");
      return;
    }
    if (isPaid) {
      const invalid = pricingTiers.find(t => !t.label.trim() || t.amount < 100);
      if (invalid) {
        toast.error("Chaque tarif doit avoir un nom et un montant ≥ 100 XOF");
        return;
      }
    }
    setSavingConfig(true);
    try {
      const lowestPrice = isPaid && pricingTiers.length
        ? Math.min(...pricingTiers.map(t => t.amount))
        : null;
      const payload: Record<string, unknown> = {
        is_paid: isPaid,
        price: lowestPrice,
        pricing_tiers: isPaid && pricingTiers.length ? pricingTiers : null,
        max_participants: maxParticipants ? Number(maxParticipants) : null,
        registration_deadline: registrationDeadline || null,
      };
      const updated = await evenementAPI.modifier(id, payload);
      setEvent(updated);
      toast.success("Configuration enregistrée");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDeleteParticipant = async () => {
    if (!deleteParticipantId) return;
    setDeletingParticipant(true);
    try {
      await participantAPI.supprimer(deleteParticipantId);
      setParticipants((prev) => prev.filter((p) => p.id !== deleteParticipantId));
      toast.success("Participant supprimé");
      setDeleteParticipantId(null);
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingParticipant(false);
    }
  };

  const handleDeleteEvent = async () => {
    setDeletingEvent(true);
    try {
      await evenementAPI.supprimer(id);
      toast.success("Événement supprimé");
      router.push("/dashboard/evenements");
    } catch {
      toast.error("Erreur lors de la suppression");
      setDeletingEvent(false);
    }
  };

  const tabs: Array<{ key: Tab; label: string; icon: typeof Settings }> = [
    { key: "infos", label: "Informations", icon: CalendarPlus },
    { key: "participants", label: "Participants", icon: Users },
    { key: "config", label: "Configuration", icon: Settings },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <Link
            href="/dashboard/evenements"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2d2d83] mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux événements
          </Link>
          <h1 className="text-xl lg:text-2xl font-bold text-[#2d2d83]">
            {loading ? "Chargement..." : event?.title ?? `Événement #${id}`}
          </h1>
          {event && (
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(event.date_at)} · {event.time_at} · {event.location_at}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Users}
          value={String(participants.length)}
          label="Inscrits"
          iconBgColor="bg-[#2d2d83]/10"
          iconColor="text-[#2d2d83]"
        />
        <StatCard
          icon={Mail}
          value={String(participants.filter((p) => p.email).length)}
          label="Avec email"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={Phone}
          value={String(participants.filter((p) => p.phone).length)}
          label="Avec téléphone"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? "border-[#2d2d83] text-[#2d2d83]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <p className="text-center text-gray-400 py-12">Chargement...</p>
      )}

      {/* Onglet Informations */}
      {!loading && activeTab === "infos" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <Card.Header className="px-6 pt-6 pb-3">
                <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" /> Détails de l&apos;événement
                </Card.Title>
              </Card.Header>
              <Card.Content className="p-6 pt-0 space-y-5">
                <TextField value={title} onChange={setTitle} isInvalid={!!infosErrors.title}>
                  <Label>Titre *</Label>
                  <Input placeholder="Titre de l'événement" />
                  {infosErrors.title && (
                    <Description className="text-red-500 text-xs">{infosErrors.title}</Description>
                  )}
                </TextField>

                <TextField
                  value={description}
                  onChange={setDescription}
                  isInvalid={!!infosErrors.description}
                >
                  <Label>Description *</Label>
                  <TextArea rows={6} />
                  {infosErrors.description && (
                    <Description className="text-red-500 text-xs">{infosErrors.description}</Description>
                  )}
                </TextField>

                <TextField
                  value={locationAt}
                  onChange={setLocationAt}
                  isInvalid={!!infosErrors.locationAt}
                >
                  <Label>Lieu *</Label>
                  <Input placeholder="Ex : Église Saint-Sauveur, Yopougon" />
                  {infosErrors.locationAt && (
                    <Description className="text-red-500 text-xs">{infosErrors.locationAt}</Description>
                  )}
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePicker
                    className="w-full"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    isInvalid={!!infosErrors.selectedDate}
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
                    {infosErrors.selectedDate && (
                      <Description className="text-red-500 text-xs">{infosErrors.selectedDate}</Description>
                    )}
                  </DatePicker>

                  <TimeField
                    className="w-full"
                    value={selectedTime}
                    onChange={setSelectedTime}
                    isInvalid={!!infosErrors.selectedTime}
                  >
                    <Label>Heure *</Label>
                    <TimeField.Group>
                      <TimeField.Input>
                        {(segment) => <TimeField.Segment segment={segment} />}
                      </TimeField.Input>
                    </TimeField.Group>
                    {infosErrors.selectedTime && (
                      <Description className="text-red-500 text-xs">{infosErrors.selectedTime}</Description>
                    )}
                  </TimeField>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    className="bg-[#2d2d83] rounded-xl px-6"
                    isDisabled={savingInfos}
                    onPress={handleSaveInfos}
                  >
                    {savingInfos ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="space-y-5">
            {/* Image */}
            <Card>
              <Card.Header className="px-5 pt-5 pb-3">
                <Card.Title className="text-sm font-semibold text-[#2d2d83]">
                  Image de l&apos;événement
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
                  <p className="mt-2 text-xs text-gray-500 truncate">{imageFile.name}</p>
                )}
              </Card.Content>
            </Card>

            {/* Danger zone */}
            <Card className="border-red-100">
              <Card.Content className="p-5">
                <p className="text-sm font-semibold text-red-600 mb-2">Zone danger</p>
                <p className="text-xs text-gray-500 mb-3">
                  Supprimer l&apos;événement entraîne la perte de toutes les inscriptions associées.
                </p>
                <Button
                  variant="ghost"
                  className="w-full rounded-xl text-red-500 hover:bg-red-50 border border-red-200"
                  onPress={() => setDeleteEventOpen(true)}
                >
                  <Trash2 className="w-4 h-4" /> Supprimer cet événement
                </Button>
              </Card.Content>
            </Card>
          </div>
        </div>
      )}

      {/* Onglet Participants */}
      {!loading && activeTab === "participants" && (
        <>
          {participants.length === 0 ? (
            <Card className="p-12 text-center">
              <Card.Content>
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">Aucun inscrit pour cet événement.</p>
              </Card.Content>
            </Card>
          ) : (
            <Card>
              <Card.Content className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Téléphone</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Paiement</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {participants.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.fullname}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{p.phone ?? "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{p.email ?? "—"}</td>
                          <td className="px-4 py-3">
                            <PaymentBadge status={p.payment_status} />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDateShort(p.created_at)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setDeleteParticipantId(p.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              aria-label="Retirer cet inscrit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          )}
        </>
      )}

      {/* Onglet Configuration */}
      {!loading && activeTab === "config" && (
        <div className="space-y-6">
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
                <Switch isSelected={isPaid} onChange={(v) => {
                  setIsPaid(v);
                  if (!v) setPricingTiers([]);
                }} />
              </div>

              {isPaid && (
                <PricingTiersEditor tiers={pricingTiers} onChange={setPricingTiers} />
              )}
            </Card.Content>
          </Card>

          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Users className="w-4 h-4" /> Inscription & places
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5 max-w-lg">
              <TextField value={maxParticipants} onChange={setMaxParticipants}>
                <Label>Nombre max de participants (optionnel)</Label>
                <Input type="number" placeholder="Laisser vide = illimité" inputMode="numeric" />
              </TextField>

              <DateTimePicker
                label="Date limite d'inscription (optionnel)"
                value={registrationDeadline}
                onChange={setRegistrationDeadline}
                helper="Les inscriptions seront fermées automatiquement après cette date"
              />
            </Card.Content>
          </Card>

          <div>
            <Button
              variant="primary"
              className="bg-[#2d2d83] rounded-xl px-6"
              isDisabled={savingConfig}
              onPress={handleSaveConfig}
            >
              {savingConfig ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Delete participant */}
      <Dialog open={!!deleteParticipantId} onOpenChange={() => setDeleteParticipantId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Retirer cet inscrit ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Cette inscription sera supprimée définitivement.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setDeleteParticipantId(null)}
              disabled={deletingParticipant}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteParticipant}
              disabled={deletingParticipant}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {deletingParticipant ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete event */}
      <Dialog open={deleteEventOpen} onOpenChange={setDeleteEventOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer l&apos;événement ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Cette action est irréversible. Toutes les inscriptions seront également supprimées.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setDeleteEventOpen(false)}
              disabled={deletingEvent}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={deletingEvent}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {deletingEvent ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
