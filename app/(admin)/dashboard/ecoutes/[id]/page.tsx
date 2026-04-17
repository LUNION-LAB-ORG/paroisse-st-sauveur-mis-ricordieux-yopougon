"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  HeartHandshake,
  Loader2,
  Save,
  Trash2,
  User,
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
import { ecouteAPI } from "@/features/ecoute/apis/ecoute.api";
import type { IEcoute, IEcouteStatutDemande } from "@/features/ecoute/types/ecoute.type";

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

export default function EditEcoutePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [ecoute, setEcoute] = useState<IEcoute | null>(null);

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [availability, setAvailability] = useState("");
  const [messageText, setMessageText] = useState("");
  const [requestStatus, setRequestStatus] = useState<IEcouteStatutDemande>("pending");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    ecouteAPI
      .obtenirParId(id)
      .then((res) => {
        const e = res.data;
        if (!e) return;
        setEcoute(e);
        setFullname(e.fullname ?? "");
        setPhone(e.phone ?? "");
        setType(e.type ?? "");
        setAvailability(e.availability ?? "");
        setMessageText(e.message ?? "");
        setRequestStatus((e.request_status as IEcouteStatutDemande) ?? "pending");
      })
      .catch(() => toast.error("Demande d'écoute introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullname.trim()) errs.fullname = "Nom obligatoire";
    if (!messageText.trim()) errs.messageText = "Message obligatoire";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }
    setSaving(true);
    try {
      await ecouteAPI.modifier(Number(id), {
        type: type || undefined,
        fullname,
        phone: phone || undefined,
        availability: availability || undefined,
        message: messageText,
        request_status: requestStatus,
      } as any);
      toast.success("Demande mise à jour");
      router.push("/dashboard/ecoutes");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await ecouteAPI.supprimer(Number(id));
      toast.success("Demande supprimée");
      router.push("/dashboard/ecoutes");
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

  if (!ecoute) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 mb-4">Demande introuvable</p>
        <Link href="/dashboard/ecoutes" className="text-[#2d2d83] underline text-sm">
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
            href="/dashboard/ecoutes"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Modifier la demande</h1>
            <p className="text-sm text-gray-500">#{ecoute.id} · {ecoute.fullname}</p>
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
            className="bg-[#2d2d83] rounded-xl"
            isDisabled={saving}
            onPress={handleSave}
          >
            <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <User className="w-4 h-4" /> Demandeur
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <TextField value={fullname} onChange={setFullname} isInvalid={!!errors.fullname}>
                <Label>Nom complet *</Label>
                <Input />
                {errors.fullname && (
                  <Description className="text-red-500 text-xs">{errors.fullname}</Description>
                )}
              </TextField>
              <TextField value={phone} onChange={setPhone}>
                <Label>Téléphone</Label>
                <Input type="tel" />
              </TextField>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" /> Demande
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <Select selectedKey={type || undefined} onSelectionChange={(k) => setType(String(k))}>
                <Label>Type</Label>
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
                <TextArea rows={5} />
                {errors.messageText && (
                  <Description className="text-red-500 text-xs">{errors.messageText}</Description>
                )}
              </TextField>
            </Card.Content>
          </Card>
        </div>

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
              >
                <Label>Disponibilité</Label>
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
              </Select>

              <Select
                selectedKey={requestStatus}
                onSelectionChange={(k) => setRequestStatus(String(k) as IEcouteStatutDemande)}
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
            </Card.Content>
          </Card>

          <Card className="border-red-100">
            <Card.Content className="p-5">
              <p className="text-sm font-semibold text-red-600 mb-2">Zone danger</p>
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
            <DialogTitle className="text-red-600">Supprimer cette demande ?</DialogTitle>
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
