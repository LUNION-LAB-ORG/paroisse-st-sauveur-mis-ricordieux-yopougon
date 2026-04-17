"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarPlus,
  DollarSign,
  Loader2,
  Mail,
  Save,
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
  ListBox,
  Select,
  Switch,
  TextArea,
  TextField,
  TimeField,
} from "@heroui/react";
import { CalendarDate, Time } from "@internationalized/date";
import type { DateValue, TimeValue } from "@heroui/react";
import { PricingTiersEditor, type PricingTier } from "@/components/admin/pricing-tiers-editor";
import { DateTimePicker } from "@/components/admin/datetime-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { organisationAPI } from "@/features/organisation/apis/organisation.api";
import type {
  IOrganisation,
  IOrganisationStatutDemande,
} from "@/features/organisation/types/organisation.type";

const STATUS_OPTIONS: Array<{ id: IOrganisationStatutDemande; label: string }> = [
  { id: "pending", label: "En attente" },
  { id: "accepted", label: "Confirmée" },
  { id: "canceled", label: "Annulée" },
];

const EVENT_TYPES = [
  { id: "messe", label: "Messe" },
  { id: "adore", label: "Adoration" },
  { id: "formation", label: "Formation" },
  { id: "fete", label: "Fête paroissiale" },
  { id: "autre", label: "Autre" },
];

export default function OrganisationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [organisation, setOrganisation] = useState<IOrganisation | null>(null);

  const [email, setEmail] = useState("");
  const [movement, setMovement] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [startTime, setStartTime] = useState<TimeValue | null>(null);
  const [endTime, setEndTime] = useState<TimeValue | null>(null);
  const [description, setDescription] = useState("");
  const [estimatedParticipants, setEstimatedParticipants] = useState("");
  const [requestStatus, setRequestStatus] =
    useState<IOrganisationStatutDemande>("pending");

  // Paiement & places
  const [isPaid, setIsPaid] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [maxParticipants, setMaxParticipants] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");

  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    organisationAPI
      .obtenirParId(id)
      .then((res) => {
        const o = res.data;
        if (!o) return;
        setOrganisation(o);
        setEmail(o.email ?? "");
        setMovement(o.movement ?? "");
        setEventType(o.eventType ?? "");
        if (o.date) {
          const d = new Date(o.date);
          setSelectedDate(new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate()));
        }
        if (o.startTime) {
          const [h, m] = o.startTime.split(":").map(Number);
          setStartTime(new Time(h || 0, m || 0));
        }
        if (o.endTime) {
          const [h, m] = o.endTime.split(":").map(Number);
          setEndTime(new Time(h || 0, m || 0));
        }
        setDescription(o.description ?? "");
        setEstimatedParticipants(o.estimatedParticipants ?? "");
        setRequestStatus(o.request_status ?? "pending");
        setIsPaid(Boolean(o.is_paid));
        setPricingTiers(Array.isArray((o as any).pricing_tiers) ? (o as any).pricing_tiers : []);
        setMaxParticipants(o.max_participants != null ? String(o.max_participants) : "");
        setRegistrationDeadline(o.registration_deadline ? String(o.registration_deadline).slice(0, 16) : "");
      })
      .catch(() => toast.error("Demande introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (isPaid && pricingTiers.length === 0) {
      toast.error("Ajoutez au moins un tarif pour une demande payante");
      return;
    }
    setSaving(true);
    try {
      const lowestPrice = isPaid && pricingTiers.length
        ? Math.min(...pricingTiers.map(t => t.amount))
        : null;
      const dateStr = selectedDate
        ? `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`
        : "";
      const startTimeStr = startTime
        ? `${String(startTime.hour).padStart(2, "0")}:${String(startTime.minute).padStart(2, "0")}`
        : "";
      const endTimeStr = endTime
        ? `${String(endTime.hour).padStart(2, "0")}:${String(endTime.minute).padStart(2, "0")}`
        : "";
      await organisationAPI.modifier(id, {
        email,
        movement,
        eventType,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        description,
        estimatedParticipants,
        request_status: requestStatus,
        is_paid: isPaid,
        price: lowestPrice,
        pricing_tiers: isPaid && pricingTiers.length ? pricingTiers : null,
        max_participants: maxParticipants ? Number(maxParticipants) : null,
        registration_deadline: registrationDeadline || null,
      } as any);
      toast.success("Demande mise à jour");
      router.push("/dashboard/organisations");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToEvent = async () => {
    if (requestStatus !== "accepted") {
      toast.error("La demande doit être acceptée avant d'être convertie");
      return;
    }
    setConverting(true);
    try {
      await organisationAPI.convertToEvent(id);
      toast.success("Demande convertie en événement officiel");
      router.push("/dashboard/evenements");
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la conversion");
    } finally {
      setConverting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await organisationAPI.supprimer(id);
      toast.success("Demande supprimée");
      router.push("/dashboard/organisations");
    } catch {
      toast.error("Erreur lors de la suppression");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
      </div>
    );
  }

  if (!organisation) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 mb-4">Demande introuvable</p>
        <Link
          href="/dashboard/organisations"
          className="text-[#2d2d83] underline text-sm"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/organisations"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">
              Demande d&apos;événement
            </h1>
            <p className="text-sm text-gray-500">
              #{organisation.id} · {organisation.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/organisations">
            <Button variant="outline" className="rounded-xl text-gray-600">
              Annuler
            </Button>
          </Link>
          <Button
            variant="primary"
            className="bg-[#2d2d83] rounded-xl"
            isDisabled={saving}
            onPress={handleSave}
          >
            <Save className="w-4 h-4" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Mail className="w-4 h-4" /> Organisateur
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <TextField value={email} onChange={setEmail}>
                <Label>E-mail *</Label>
                <Input type="email" />
              </TextField>
              <TextField value={movement} onChange={setMovement}>
                <Label>Mouvement / Groupe</Label>
                <Input />
              </TextField>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-500">Statut paroissial :</span>
                <span className="text-sm font-medium text-gray-800">
                  {organisation.isParishMember === "yes"
                    ? "Membre de la paroisse"
                    : "Non-membre"}
                </span>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <CalendarPlus className="w-4 h-4" /> Détails de l&apos;événement
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <Select
                selectedKey={eventType || undefined}
                onSelectionChange={(k) => setEventType(String(k))}
              >
                <Label>Type d&apos;événement</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {EVENT_TYPES.map((t) => (
                      <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                        {t.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <DatePicker className="w-full" value={selectedDate} onChange={setSelectedDate}>
                <Label>Date</Label>
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
                  <HeroCalendar aria-label="Date">
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
                        {(d) => <HeroCalendar.Cell date={d} />}
                      </HeroCalendar.GridBody>
                    </HeroCalendar.Grid>
                  </HeroCalendar>
                </DatePicker.Popover>
              </DatePicker>

              <div className="grid grid-cols-2 gap-4">
                <TimeField className="w-full" value={startTime} onChange={setStartTime}>
                  <Label>Début</Label>
                  <TimeField.Group>
                    <TimeField.Input>
                      {(segment) => <TimeField.Segment segment={segment} />}
                    </TimeField.Input>
                  </TimeField.Group>
                </TimeField>
                <TimeField className="w-full" value={endTime} onChange={setEndTime}>
                  <Label>Fin</Label>
                  <TimeField.Group>
                    <TimeField.Input>
                      {(segment) => <TimeField.Segment segment={segment} />}
                    </TimeField.Input>
                  </TimeField.Group>
                </TimeField>
              </div>

              <TextField value={description} onChange={setDescription}>
                <Label>Description</Label>
                <TextArea rows={5} />
              </TextField>

              <TextField
                value={estimatedParticipants}
                onChange={setEstimatedParticipants}
              >
                <Label>Participants estimés</Label>
                <Input type="number" inputMode="numeric" />
              </TextField>
            </Card.Content>
          </Card>

          {/* Tarification */}
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

          {/* Inscription & places */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Users className="w-4 h-4" /> Inscription & places
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <TextField value={maxParticipants} onChange={setMaxParticipants}>
                <Label>Nombre max de participants (optionnel)</Label>
                <Input type="number" inputMode="numeric" placeholder="Laisser vide = illimité" />
              </TextField>
              <DateTimePicker
                label="Date limite d'inscription (optionnel)"
                value={registrationDeadline}
                onChange={setRegistrationDeadline}
              />
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Users className="w-4 h-4" /> Statut
              </Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5 space-y-4">
              <Select
                selectedKey={requestStatus}
                onSelectionChange={(k) =>
                  setRequestStatus(String(k) as IOrganisationStatutDemande)
                }
              >
                <Label>Statut de la demande</Label>
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

              <Description className="text-xs text-gray-500">
                Quand la demande est acceptée, vous pouvez la convertir en événement
                officiel en 1 clic ci-dessous.
              </Description>
            </Card.Content>
          </Card>

          {/* Convertir en événement */}
          {requestStatus === "accepted" && !organisation.converted_event_id && (
            <Card className="border-green-200 bg-green-50/30">
              <Card.Content className="p-5">
                <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" /> Demande acceptée
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  Convertissez cette demande en événement officiel (visible public,
                  inscriptions possibles). Les tarifs et places configurés seront reportés.
                </p>
                <Button
                  variant="primary"
                  className="w-full bg-green-600 rounded-xl"
                  isDisabled={converting}
                  onPress={handleConvertToEvent}
                >
                  <CalendarCheck className="w-4 h-4" /> {converting ? "Conversion..." : "Convertir en événement"}
                </Button>
              </Card.Content>
            </Card>
          )}

          {organisation.converted_event_id && (
            <Card className="border-blue-200 bg-blue-50/30">
              <Card.Content className="p-5">
                <p className="text-sm font-semibold text-blue-700 mb-1 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" /> Déjà convertie
                </p>
                <p className="text-xs text-gray-600">
                  Événement #{organisation.converted_event_id} créé à partir de cette demande.
                </p>
                <Link
                  href={`/dashboard/evenements/${organisation.converted_event_id}`}
                  className="text-xs text-blue-600 underline mt-2 inline-block"
                >
                  Voir l&apos;événement →
                </Link>
              </Card.Content>
            </Card>
          )}

          <Card className="border-red-100">
            <Card.Content className="p-5">
              <p className="text-sm font-semibold text-red-600 mb-2">
                Zone danger
              </p>
              <Button
                variant="ghost"
                className="w-full rounded-xl text-red-500 hover:bg-red-50 border border-red-200"
                onPress={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4" /> Supprimer cette demande
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Supprimer cette demande ?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
