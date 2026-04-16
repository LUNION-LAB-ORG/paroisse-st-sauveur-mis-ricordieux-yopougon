"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2, User, Calendar, ChurchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Header } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Card, Avatar, Chip, Separator, TextField, Label, Input as HeroInput, TextArea as HeroTextArea } from "@heroui/react";
import { Button as HeroButton } from "@heroui/react";

import { cureAPI } from "@/features/cure/apis/cure.api";
import {
  CureSchema,
  CureType,
  UpdateCureSchema,
  UpdateCureType,
} from "@/features/cure/schemas/cure.schema";

export default function CuresPage() {
  const [cures, setCures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cureToEdit, setCureToEdit] = useState<any | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cureToDelete, setCureToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const actifs = cures.filter((c) => !c.ended_at);
  const anciens = cures.filter((c) => !!c.ended_at);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchCures = async () => {
      try {
        const res = await cureAPI.obtenirTous();
        setCures(res.data ?? []);
      } catch (err: any) {
        toast.error(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchCures();
  }, []);

  /* ================= CREATE ================= */
  const createForm = useForm<CureType>({ resolver: zodResolver(CureSchema) });

  const onCreateSubmit = async (data: CureType) => {
    const payload: CureType = { ...data, photo: file ?? undefined };
    try {
      const res = await cureAPI.ajouter(payload);
      toast.success("Curé ajouté avec succès");
      if (res) setCures((prev) => [...prev, res]);
      createForm.reset();
      setFile(null);
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    }
  };

  /* ================= UPDATE ================= */
  const updateForm = useForm<UpdateCureType>({ resolver: zodResolver(UpdateCureSchema) });

  useEffect(() => {
    if (cureToEdit) {
      updateForm.reset({
        fullname: cureToEdit.fullname,
        started_at: cureToEdit.started_at,
        ended_at: cureToEdit.ended_at,
        description: cureToEdit.description,
      });
    }
  }, [cureToEdit, updateForm]);

  const onUpdateSubmit = async (data: UpdateCureType) => {
    if (!cureToEdit) return;
    try {
      const res = await cureAPI.modifier(String(cureToEdit.id), data);
      toast.success("Curé mis à jour");
      setCures((prev) => prev.map((c) => (c.id === cureToEdit.id ? (res as any) : c)));
      setEditOpen(false);
      setCureToEdit(null);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    }
  };

  /* ================= TOGGLE EN POSTE ================= */
  const toggleEnPoste = async (cure: any) => {
    const isCurrentlyActive = !cure.ended_at;
    const payload: UpdateCureType = isCurrentlyActive
      ? { ended_at: new Date().toISOString().slice(0, 10) }
      : { ended_at: null };
    try {
      const res = await cureAPI.modifier(String(cure.id), payload);
      toast.success(isCurrentlyActive ? "Marqué comme ancien curé" : "Remis en poste");
      setCures((prev) => prev.map((c) => (c.id === cure.id ? (res as any) : c)));
    } catch (err: any) {
      toast.error(err.message || "Erreur");
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
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div>
      <Header title="Nos Curés" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={ChurchIcon} value={String(cures.length)} label="Total curés" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={User} value={String(actifs.length)} label="En activité" iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Calendar} value={String(anciens.length)} label="Anciens curés" iconBgColor="bg-gray-100" iconColor="text-gray-500" />
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-6">
        <HeroButton
          variant="primary"
          className="bg-[#98141f] rounded-xl"
          onPress={() => setCreateOpen(true)}
        >
          <Plus className="w-4 h-4" /> Nouveau curé
        </HeroButton>
      </div>

      {/* Profile cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-64" />
          ))}
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
              {/* Photo header */}
              <div className="relative h-40 bg-gradient-to-br from-[#2d2d83] to-[#98141f]">
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <Chip
                    variant="soft"
                    color={cure.ended_at ? "default" : "success"}
                    size="sm"
                  >
                    {cure.ended_at ? "Ancien" : "En poste"}
                  </Chip>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <Avatar className="w-20 h-20 ring-4 ring-white">
                    <Avatar.Image
                      src={cure.photo || "/avatar-placeholder.png"}
                      alt={cure.fullname}
                    />
                    <Avatar.Fallback className="bg-[#2d2d83] text-white text-xl">
                      {cure.fullname?.charAt(0) || "?"}
                    </Avatar.Fallback>
                  </Avatar>
                </div>
              </div>

              <Card.Content className="pt-14 pb-5 px-5 text-center">
                <Card.Title className="text-lg font-bold text-[#2d2d83]">
                  {cure.fullname}
                </Card.Title>

                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
                  <Chip variant="soft" color="default" size="sm">
                    {cure.started_at || "—"} → {cure.ended_at || "Présent"}
                  </Chip>
                </div>

                {cure.description && (
                  <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                    {cure.description}
                  </p>
                )}

                <Separator className="my-4" />

                <div className="flex flex-col gap-2">
                  {/* Toggle En poste / Ancien */}
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
                      onPress={() => { setCureToEdit(cure); setEditOpen(true); }}
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

      {/* ================= CREATE MODAL ================= */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Nouveau curé</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={createForm.handleSubmit(onCreateSubmit)}>
            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo du curé</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#2d2d83]/30 transition-colors">
                {file ? (
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500 hover:underline">Supprimer</button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cliquez pour ajouter une photo</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 2MB)</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                  </label>
                )}
              </div>
            </div>

            <TextField>
              <Label>Nom complet</Label>
              <HeroInput {...createForm.register("fullname")} placeholder="Père Jean-Baptiste KOFFI" />
            </TextField>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Début de ministère</label>
                <Input type="date" {...createForm.register("started_at")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin (vide si en cours)</label>
                <Input type="date" {...createForm.register("ended_at")} />
              </div>
            </div>

            <TextField>
              <Label>Description</Label>
              <HeroTextArea {...createForm.register("description")} placeholder="Biographie courte du curé..." rows={3} />
            </TextField>

            <button type="submit" className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-xl py-3 font-medium transition-colors">
              Ajouter le curé
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= UPDATE MODAL ================= */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Modifier le curé</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={updateForm.handleSubmit(onUpdateSubmit)}>
            <TextField>
              <Label>Nom complet</Label>
              <HeroInput {...updateForm.register("fullname")} />
            </TextField>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
                <Input type="date" {...updateForm.register("started_at")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                <Input type="date" {...updateForm.register("ended_at")} />
              </div>
            </div>

            <TextField>
              <Label>Description</Label>
              <HeroTextArea {...updateForm.register("description")} rows={3} />
            </TextField>

            <button type="submit" className="w-full bg-[#2d2d83] hover:bg-[#232370] text-white rounded-xl py-3 font-medium transition-colors">
              Mettre à jour
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE MODAL ================= */}
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
