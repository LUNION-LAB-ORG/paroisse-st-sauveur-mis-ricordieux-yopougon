"use client";

import { Edit, Plus, Trash2, User, Calendar, ChurchIcon, ImageIcon, X as XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Header } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, Avatar, Chip, Separator, Button as HeroButton } from "@heroui/react";

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
  // Accept "YYYY-MM-DD" directly, otherwise parse Date.
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
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
  if (isUpdate) fd.append("_method", "PUT"); // Laravel multipart PUT workaround
  fd.append("fullname", state.fullname);
  fd.append("started_at", state.started_at);
  // ended_at may be empty → ne pas envoyer pour indiquer "en poste"
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
                    {cure.ended_at ? "↩ Remettre en poste" : "✓ Marquer comme ancien"}
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
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
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
  const { form, setForm, file, setFile, existingPhotoUrl, onSubmit, submitLabel, disabled, submitColor } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localPreview, setLocalPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const previewUrl = localPreview || existingPhotoUrl || null;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Photo upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Photo du curé</label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-[#2d2d83]/30 transition-colors">
          {previewUrl ? (
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {file ? file.name : "Photo actuelle"}
                </p>
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#2d2d83] hover:underline"
                  >
                    Changer
                  </button>
                  {file && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-xs text-red-500 hover:underline inline-flex items-center gap-1"
                    >
                      <XIcon className="w-3 h-3" /> Retirer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center py-4 text-gray-500"
            >
              <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-sm">Cliquez pour ajouter une photo</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (max 2MB)</p>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
        <input
          value={form.fullname}
          onChange={(e) => setForm((f) => ({ ...f, fullname: e.target.value }))}
          placeholder="Père Jean-Baptiste KOFFI"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Début de ministère *</label>
          <input
            type="date"
            value={form.started_at}
            onChange={(e) => setForm((f) => ({ ...f, started_at: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fin (vide si en cours)</label>
          <input
            type="date"
            value={form.ended_at}
            onChange={(e) => setForm((f) => ({ ...f, ended_at: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Biographie courte du curé..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className={`w-full ${submitColor} text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-50`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
