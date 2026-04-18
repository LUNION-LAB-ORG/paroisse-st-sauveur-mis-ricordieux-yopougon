"use client";

import { Edit, Plus, Trash2, User, Calendar, ChurchIcon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Header } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  Avatar,
  Chip,
  Separator,
  Button as HeroButton,
  TextField,
  TextArea,
  Input,
  Label,
  DatePicker,
  DateField,
  Calendar as HeroCalendar,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@heroui/react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { cureAPI } from "@/features/cure/apis/cure.api";
import type { ICure } from "@/features/cure/types/cure.type";

interface CureFormState {
  fullname: string;
  started_at: string;
  ended_at: string;
  description: string;
}

const EMPTY: CureFormState = { fullname: "", started_at: "", ended_at: "", description: "" };

function toDateInput(iso?: string | null): string {
  if (!iso) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toDateValue(iso: string): DateValue | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3])) : null;
}
function toIso(d: DateValue | null): string {
  if (!d) return "";
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

/** Format lisible "sept. 2005" pour l'affichage en carte */
function toDateFR(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

function buildFormData(state: CureFormState, file: File | null, isUpdate: boolean): FormData {
  const fd = new FormData();
  if (isUpdate) fd.append("_method", "PUT");
  fd.append("fullname", state.fullname);
  fd.append("started_at", state.started_at);
  if (state.ended_at) fd.append("ended_at", state.ended_at);
  fd.append("description", state.description);
  if (file) fd.append("photo", file);
  return fd;
}

export default function CuresPage() {
  const [cures, setCures] = useState<ICure[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CureFormState>(EMPTY);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [cureToEdit, setCureToEdit] = useState<ICure | null>(null);
  const [editForm, setEditForm] = useState<CureFormState>(EMPTY);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cureToDelete, setCureToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const actifs = cures.filter((c) => !c.ended_at);
  const anciens = cures.filter((c) => !!c.ended_at);

  useEffect(() => {
    (async () => {
      try {
        const res = await cureAPI.obtenirTous();
        setCures((res.data ?? []) as ICure[]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= CREATE ================= */
  const openCreate = () => {
    setCreateForm(EMPTY);
    setCreateFile(null);
    setCreateOpen(true);
  };

  const onCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.fullname.trim() || !createForm.started_at || !createForm.description.trim()) {
      toast.error("Nom complet, début de ministère et description sont obligatoires.");
      return;
    }
    setCreating(true);
    try {
      const res = await cureAPI.ajouter(buildFormData(createForm, createFile, false));
      toast.success("Curé ajouté");
      const added = (res as unknown as { data?: ICure }).data ?? (res as unknown as ICure);
      if (added) setCures((prev) => [...prev, added]);
      setCreateOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  /* ================= UPDATE ================= */
  const openEdit = (cure: ICure) => {
    setCureToEdit(cure);
    setEditForm({
      fullname: cure.fullname ?? "",
      started_at: toDateInput(cure.started_at),
      ended_at: toDateInput(cure.ended_at),
      description: cure.description ?? "",
    });
    setEditFile(null);
    setEditOpen(true);
  };

  const onUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cureToEdit) return;
    if (!editForm.fullname.trim() || !editForm.started_at || !editForm.description.trim()) {
      toast.error("Nom, début de ministère et description sont obligatoires.");
      return;
    }
    setEditing(true);
    try {
      const res = await cureAPI.modifier(String(cureToEdit.id), buildFormData(editForm, editFile, true));
      toast.success("Curé mis à jour");
      const updated = (res as unknown as { data?: ICure }).data ?? (res as unknown as ICure);
      if (updated) setCures((prev) => prev.map((c) => (c.id === cureToEdit.id ? updated : c)));
      setEditOpen(false);
      setCureToEdit(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    } finally {
      setEditing(false);
    }
  };

  /* ================= TOGGLE ================= */
  const toggleEnPoste = async (cure: ICure) => {
    const isCurrentlyActive = !cure.ended_at;
    const fd = new FormData();
    fd.append("_method", "PUT");
    fd.append("fullname", cure.fullname);
    fd.append("started_at", toDateInput(cure.started_at));
    fd.append("description", cure.description ?? "");
    if (isCurrentlyActive) {
      fd.append("ended_at", new Date().toISOString().slice(0, 10));
    }
    try {
      const res = await cureAPI.modifier(String(cure.id), fd);
      toast.success(isCurrentlyActive ? "Marqué comme ancien curé" : "Remis en poste");
      const updated = (res as unknown as { data?: ICure }).data ?? (res as unknown as ICure);
      if (updated) setCures((prev) => prev.map((c) => (c.id === cure.id ? updated : c)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!cureToDelete) return;
    try {
      setIsDeleting(true);
      await cureAPI.supprimer(String(cureToDelete));
      toast.success("Curé supprimé");
      setCures((prev) => prev.filter((c) => c.id !== cureToDelete));
      setDeleteOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Header title="Nos Curés" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={ChurchIcon} value={String(cures.length)} label="Total curés" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={User} value={String(actifs.length)} label="En activité" iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Calendar} value={String(anciens.length)} label="Anciens curés" iconBgColor="bg-gray-100" iconColor="text-gray-500" />
      </div>

      <div className="flex justify-end mb-6">
        <HeroButton variant="primary" className="bg-[#98141f] rounded-xl" onPress={openCreate}>
          <Plus className="w-4 h-4" /> Nouveau curé
        </HeroButton>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <Card key={i} className="animate-pulse h-64" />)}
        </div>
      ) : cures.length === 0 ? (
        <Card className="p-12 text-center">
          <Card.Content>
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">Aucun curé enregistré.</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cures.map((cure) => (
            <Card key={cure.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-gradient-to-br from-[#2d2d83] to-[#98141f]">
                <div className="absolute top-3 right-3">
                  <Chip variant="soft" color={cure.ended_at ? "default" : "success"} size="sm">
                    {cure.ended_at ? "Ancien" : "En poste"}
                  </Chip>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <Avatar className="w-20 h-20 ring-4 ring-white">
                    <Avatar.Image src={cure.photo || "/avatar-placeholder.png"} alt={cure.fullname} />
                    <Avatar.Fallback className="bg-[#2d2d83] text-white text-xl">
                      {cure.fullname?.charAt(0) || "?"}
                    </Avatar.Fallback>
                  </Avatar>
                </div>
              </div>

              <Card.Content className="pt-14 pb-5 px-5 text-center">
                <Card.Title className="text-lg font-bold text-[#2d2d83]">{cure.fullname}</Card.Title>

                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
                  <Chip variant="soft" color="default" size="sm">
                    {toDateFR(cure.started_at) || "—"} → {toDateFR(cure.ended_at) || "Présent"}
                  </Chip>
                </div>

                {cure.description && <p className="text-sm text-gray-500 mt-3 line-clamp-2">{cure.description}</p>}

                <Separator className="my-4" />

                <div className="flex flex-col gap-2">
                  <HeroButton
                    variant="ghost"
                    className={`w-full rounded-lg text-sm ${cure.ended_at ? "text-green-700 bg-green-50" : "text-gray-600 bg-gray-50"}`}
                    onPress={() => toggleEnPoste(cure)}
                  >
                    {cure.ended_at ? "Remettre en poste" : "Marquer comme ancien"}
                  </HeroButton>

                  <div className="flex justify-center gap-2">
                    <HeroButton
                      variant="outline"
                      className="rounded-lg text-[#2d2d83] border-[#2d2d83]/20"
                      onPress={() => openEdit(cure)}
                    >
                      <Edit className="w-4 h-4" /> Modifier
                    </HeroButton>
                    <HeroButton
                      variant="ghost"
                      className="rounded-lg text-red-500 hover:bg-red-50"
                      onPress={() => { setCureToDelete(cure.id); setDeleteOpen(true); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </HeroButton>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Nouveau curé</DialogTitle>
          </DialogHeader>
          <CureFormFields
            form={createForm}
            setForm={setCreateForm}
            file={createFile}
            setFile={setCreateFile}
            existingPhotoUrl={null}
            onSubmit={onCreateSubmit}
            submitLabel={creating ? "Ajout en cours..." : "Ajouter le curé"}
            disabled={creating}
            submitColor="bg-[#98141f] hover:bg-[#7a1019]"
          />
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Modifier le curé</DialogTitle>
          </DialogHeader>
          <CureFormFields
            form={editForm}
            setForm={setEditForm}
            file={editFile}
            setFile={setEditFile}
            existingPhotoUrl={cureToEdit?.photo ?? null}
            onSubmit={onUpdateSubmit}
            submitLabel={editing ? "Mise à jour..." : "Mettre à jour"}
            disabled={editing}
            submitColor="bg-[#2d2d83] hover:bg-[#232370]"
          />
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer ce curé ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Cette action est irréversible. Le profil et la photo seront définitivement supprimés.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <HeroButton variant="secondary" onPress={() => setDeleteOpen(false)} className="rounded-xl">
              Annuler
            </HeroButton>
            <HeroButton
              variant="primary"
              isDisabled={isDeleting}
              onPress={confirmDelete}
              className="bg-red-600 rounded-xl"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </HeroButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================= Reusable form ================= */
function CureFormFields(props: {
  form: CureFormState;
  setForm: React.Dispatch<React.SetStateAction<CureFormState>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  existingPhotoUrl?: string | null;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  disabled?: boolean;
  submitColor: string;
}) {
  const { form, setForm, existingPhotoUrl, setFile, onSubmit, submitLabel, disabled, submitColor } = props;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <ImageUploadField
        initialImageUrl={existingPhotoUrl ?? null}
        onChange={setFile}
        title="Photo du curé"
        height={140}
      />

      <TextField
        value={form.fullname}
        onChange={(v) => setForm((f) => ({ ...f, fullname: v }))}
        isRequired
      >
        <Label>Nom complet</Label>
        <Input placeholder="Père Jean-Baptiste KOFFI" />
      </TextField>

      <div className="grid grid-cols-2 gap-3">
        <DatePicker
          value={toDateValue(form.started_at)}
          onChange={(d) => setForm((f) => ({ ...f, started_at: toIso(d) }))}
        >
          <Label>Début de ministère</Label>
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
            <HeroCalendar>
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
        </DatePicker>

        <DatePicker
          value={toDateValue(form.ended_at)}
          onChange={(d) => setForm((f) => ({ ...f, ended_at: toIso(d) }))}
        >
          <Label>Fin (vide si en cours)</Label>
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
            <HeroCalendar>
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
        </DatePicker>
      </div>

      <TextField
        value={form.description}
        onChange={(v) => setForm((f) => ({ ...f, description: v }))}
        isRequired
      >
        <Label>Description</Label>
        <TextArea rows={3} placeholder="Biographie courte du curé..." />
      </TextField>

      <HeroButton
        type="submit"
        variant="primary"
        isDisabled={disabled}
        className={`w-full ${submitColor} text-white rounded-xl`}
      >
        {submitLabel}
      </HeroButton>
    </form>
  );
}
