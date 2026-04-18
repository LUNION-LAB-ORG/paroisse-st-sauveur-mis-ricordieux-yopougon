"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarPlus,
  ClipboardList,
  DollarSign,
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
  Chip,
  DateField,
  DatePicker,
  Description,
  Input,
  Label,
  NumberField,
  Table,
  TextArea,
  TextField,
  TimeField,
} from "@heroui/react";
import { CalendarDate, Time } from "@internationalized/date";
import type { DateValue, TimeValue } from "@heroui/react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PricingTiersEditor, type PricingTier } from "@/components/admin/pricing-tiers-editor";
import { DateTimePicker } from "@/components/admin/datetime-picker";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
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
    return <Chip variant="soft" color="warning" size="sm">En attente</Chip>;
  }
  if (status === "paid" || status === "succeeded") {
    return <Chip variant="soft" color="success" size="sm">Payé</Chip>;
  }
  if (status === "free") {
    return <Chip variant="soft" color="accent" size="sm">Gratuit</Chip>;
  }
  if (status === "failed") {
    return <Chip variant="soft" color="danger" size="sm">Échoué</Chip>;
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
              <Card.Content className="p-5">
                <ImageUploadField
                  initialImageUrl={event?.image ?? null}
                  onChange={setImageFile}
                  title="Image de l'événement"
                />
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
                <Table aria-label="Liste des participants">
                  <Table.ScrollContainer>
                    <Table.Content>
                      <Table.Header>
                        <Table.Column isRowHeader>Nom</Table.Column>
                        <Table.Column>Téléphone</Table.Column>
                        <Table.Column>Email</Table.Column>
                        <Table.Column>Paiement</Table.Column>
                        <Table.Column>Date</Table.Column>
                        <Table.Column>Action</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {participants.map((p) => (
                          <Table.Row key={p.id}>
                            <Table.Cell>
                              <span className="font-medium text-gray-800">{p.fullname}</span>
                            </Table.Cell>
                            <Table.Cell>{p.phone ?? "—"}</Table.Cell>
                            <Table.Cell>{p.email ?? "—"}</Table.Cell>
                            <Table.Cell>
                              <PaymentBadge status={p.payment_status} />
                            </Table.Cell>
                            <Table.Cell>{formatDateShort(p.created_at)}</Table.Cell>
                            <Table.Cell>
                              <Button
                                variant="ghost"
                                className="rounded-lg text-red-500 hover:bg-red-50"
                                onPress={() => setDeleteParticipantId(p.id)}
                                aria-label="Retirer cet inscrit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
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
                <ToggleSwitch isSelected={isPaid} onChange={(v) => {
                  setIsPaid(v);
                  if (!v) setPricingTiers([]);
                }} aria-label="Activer événement payant" />
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
              <NumberField
                fullWidth
                value={maxParticipants === "" ? NaN : Number(maxParticipants)}
                onChange={(v) => setMaxParticipants(isNaN(v) ? "" : String(v))}
                minValue={1}
                step={1}
              >
                <Label>Nombre max de participants (optionnel)</Label>
                <NumberField.Group>
                  <NumberField.Input placeholder="Laisser vide = illimité" />
                  <NumberField.DecrementButton />
                  <NumberField.IncrementButton />
                </NumberField.Group>
              </NumberField>

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
            <Button
              variant="secondary"
              isDisabled={deletingParticipant}
              onPress={() => setDeleteParticipantId(null)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              isDisabled={deletingParticipant}
              onPress={handleDeleteParticipant}
              className="bg-red-600 rounded-xl"
            >
              {deletingParticipant ? "Suppression..." : "Supprimer"}
            </Button>
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
            <Button
              variant="secondary"
              isDisabled={deletingEvent}
              onPress={() => setDeleteEventOpen(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              isDisabled={deletingEvent}
              onPress={handleDeleteEvent}
              className="bg-red-600 rounded-xl"
            >
              {deletingEvent ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
