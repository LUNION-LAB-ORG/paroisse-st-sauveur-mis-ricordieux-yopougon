"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Flame,
  Loader2,
  Save,
  Trash2,
  User,
  Wallet,
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
  Switch,
  TextArea,
  TextField,
} from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { messeAPI } from "@/features/messe/apis/messe.api";
import type { IMesse, IMesseModifier, IMesseStatutDemande } from "@/features/messe/types/messe.type";

const INTENTION_TYPES = [
  { id: "action-de-grace", label: "Action de grâce" },
  { id: "repos-ame", label: "Repos de l'âme" },
  { id: "guerison", label: "Guérison" },
  { id: "protection", label: "Protection" },
  { id: "benediction", label: "Bénédiction" },
  { id: "autre", label: "Autre" },
];

const REQUEST_STATUSES: Array<{ id: IMesseStatutDemande; label: string }> = [
  { id: "pending", label: "En attente" },
  { id: "accepted", label: "Confirmée" },
  { id: "canceled", label: "Annulée" },
];

export default function EditMessePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [messe, setMesse] = useState<IMesse | null>(null);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [intentionType, setIntentionType] = useState("");
  const [dateAt, setDateAt] = useState("");
  const [timeAt, setTimeAt] = useState("");
  const [amount, setAmount] = useState("");
  const [requestStatus, setRequestStatus] = useState<IMesseStatutDemande>("pending");
  const [paid, setPaid] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    messeAPI
      .obtenirParId(id)
      .then((res) => {
        const m = res.data;
        setMesse(m);
        setFullname(m.fullname ?? "");
        setEmail(m.email ?? "");
        setPhone(m.phone ?? "");
        setMessageText(m.message ?? "");
        setIntentionType(m.type ?? "");
        // m.date_at et m.time_at peuvent venir en ISO
        if (m.date_at) {
          const d = new Date(m.date_at);
          setDateAt(d.toISOString().slice(0, 10));
        }
        if (m.time_at) {
          const t = new Date(m.time_at);
          const hh = String(t.getHours()).padStart(2, "0");
          const mm = String(t.getMinutes()).padStart(2, "0");
          setTimeAt(`${hh}:${mm}`);
        }
        setAmount(m.amount ? String(m.amount) : "");
        setRequestStatus(m.request_status ?? "pending");
        setPaid(m.payment_status === "succeeded");
      })
      .catch(() => toast.error("Messe introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!intentionType) errs.intentionType = "Type obligatoire";
    if (!fullname.trim()) errs.fullname = "Nom obligatoire";
    if (!phone.trim()) errs.phone = "Téléphone obligatoire";
    if (!messageText.trim()) errs.messageText = "Intention obligatoire";
    if (!dateAt) errs.dateAt = "Date obligatoire";
    if (!timeAt) errs.timeAt = "Heure obligatoire";
    if (!amount || Number(amount) < 0) errs.amount = "Montant invalide";
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
      const isoDateTime = new Date(`${dateAt}T${timeAt}`).toISOString();
      const payload: IMesseModifier = {
        type: intentionType,
        fullname,
        email: email.trim() || null,
        phone,
        message: messageText,
        amount: Number(amount),
        date_at: isoDateTime,
        time_at: isoDateTime,
        request_status: requestStatus,
        payment_status: paid ? "succeeded" : "pending",
      };
      await messeAPI.modifier(id, payload);
      toast.success("Messe mise à jour");
      router.push("/dashboard/messes");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await messeAPI.supprimer(id);
      toast.success("Messe supprimée");
      router.push("/dashboard/messes");
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

  if (!messe) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 mb-4">Messe introuvable</p>
        <Link href="/dashboard/messes" className="text-[#2d2d83] underline text-sm">
          Retour à la liste
        </Link>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-[#2d2d83]">Modifier la messe</h1>
            <p className="text-sm text-gray-500">#{messe.id} · {messe.fullname}</p>
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
          {/* Intention */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Flame className="w-4 h-4" /> Intention
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <Select
                selectedKey={intentionType || undefined}
                onSelectionChange={(k) => setIntentionType(String(k))}
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
                <TextArea rows={4} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField value={phone} onChange={setPhone} isInvalid={!!errors.phone}>
                  <Label>Téléphone *</Label>
                  <Input type="tel" />
                  {errors.phone && (
                    <Description className="text-red-500 text-xs">{errors.phone}</Description>
                  )}
                </TextField>
                <TextField value={email} onChange={setEmail}>
                  <Label>Email</Label>
                  <Input type="email" />
                </TextField>
              </div>
            </Card.Content>
          </Card>

          {/* Date */}
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date et heure
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0">
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
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83] flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Paiement & statut
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

              <Select
                selectedKey={requestStatus}
                onSelectionChange={(k) => setRequestStatus(String(k) as IMesseStatutDemande)}
              >
                <Label>Statut de la demande</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {REQUEST_STATUSES.map((s) => (
                      <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                        {s.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-800">Paiement reçu</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {paid ? "Marqué comme payé" : "Paiement en attente"}
                  </p>
                </div>
                <Switch isSelected={paid} onChange={setPaid} />
              </div>
            </Card.Content>
          </Card>

          {/* Danger zone */}
          <Card className="border-red-100">
            <Card.Content className="p-5">
              <p className="text-sm font-semibold text-red-600 mb-2">Zone danger</p>
              <Button
                variant="ghost"
                className="w-full rounded-xl text-red-500 hover:bg-red-50 border border-red-200"
                onPress={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4" /> Supprimer cette messe
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer cette messe ?</DialogTitle>
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
