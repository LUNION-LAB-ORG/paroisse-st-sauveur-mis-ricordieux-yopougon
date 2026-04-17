"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
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
  Description,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
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
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedParticipants, setEstimatedParticipants] = useState("");
  const [requestStatus, setRequestStatus] =
    useState<IOrganisationStatutDemande>("pending");

  const [saving, setSaving] = useState(false);
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
        setDate(o.date ? o.date.slice(0, 10) : "");
        setStartTime(o.startTime ?? "");
        setEndTime(o.endTime ?? "");
        setDescription(o.description ?? "");
        setEstimatedParticipants(o.estimatedParticipants ?? "");
        setRequestStatus(o.request_status ?? "pending");
      })
      .catch(() => toast.error("Demande introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await organisationAPI.modifier(id, {
        email,
        movement,
        eventType,
        date,
        startTime,
        endTime,
        description,
        estimatedParticipants,
        request_status: requestStatus,
      } as any);
      toast.success("Demande mise à jour");
      router.push("/dashboard/organisations");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
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
              Demande d&apos;organisation
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Début
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/50"
                  />
                </div>
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
                Quand la demande est acceptée, vous pouvez créer manuellement
                l&apos;événement correspondant depuis la page Événements.
              </Description>
            </Card.Content>
          </Card>

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
