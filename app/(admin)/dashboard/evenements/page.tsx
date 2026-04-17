"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalIcon, Edit, Trash2, Plus, MapPin, Clock, Users, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Card, Chip, Separator, Button as HeroButton, TextField as HeroTextField, Label as HeroLabel, Input as HeroInput, TextArea as HeroTextArea } from "@heroui/react";
import { ImageIcon } from "lucide-react";

import { evenementAPI } from "@/features/evenement/apis/evenement.api";
import {
  EventSchema, EventTypeSchema, UpdateEventSchema, UpdateEventTypeSchema,
} from "@/features/evenement/schemas/evenement.schema";

export default function EvenementsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<any | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await evenementAPI.obtenirTous();
        setEvents(res.data ?? []);
      } catch (err: any) {
        toast.error(err.message || "Erreur chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const createForm = useForm<EventTypeSchema>({ resolver: zodResolver(EventSchema) });
  const onCreateSubmit = async (data: EventTypeSchema) => {
    try {
      const res = await evenementAPI.ajouter({ ...data, image: files[0] });
      toast.success("Événement créé");
      if (res) setEvents((prev) => [...prev, res]);
      createForm.reset();
      setCreateOpen(false);
    } catch (err: any) { toast.error(err.message || "Erreur"); }
  };

  const updateForm = useForm<UpdateEventTypeSchema>({ resolver: zodResolver(UpdateEventSchema) });
  useEffect(() => {
    if (eventToEdit) {
      updateForm.reset({
        title: eventToEdit.title, description: eventToEdit.description,
        location_at: eventToEdit.location_at, date_at: eventToEdit.date_at, time_at: eventToEdit.time_at,
      });
    }
  }, [eventToEdit, updateForm]);

  const onUpdateSubmit = async (data: UpdateEventTypeSchema) => {
    if (!eventToEdit) return;
    try {
      const res = await evenementAPI.modifier(String(eventToEdit.id), data);
      toast.success("Événement mis à jour");
      setEvents((prev) => prev.map((ev) => (ev.id === eventToEdit.id ? (res as any) : ev)));
      setEditOpen(false);
    } catch (err: any) { toast.error(err.message || "Erreur"); }
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      setIsDeleting(true);
      await evenementAPI.supprimer(String(eventToDelete));
      toast.success("Événement supprimé");
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete));
      setDeleteOpen(false);
    } catch (err: any) { toast.error(err.message || "Erreur"); }
    finally { setIsDeleting(false); }
  };

  return (
    <div>
      <Header title="Événements" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={CalIcon} value={String(events.length)} label="Total événements" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Users} value={String(events.filter((e) => { const d = new Date(e.date_at); return d >= new Date() }).length)} label="À venir" iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={CalIcon} value={String(events.filter((e) => { const d = new Date(e.date_at); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }).length)} label="Ce mois" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-6">
        <Link href="/dashboard/evenements/new">
          <HeroButton variant="primary" className="bg-[#98141f] rounded-xl">
            <Plus className="w-4 h-4" /> Nouvel événement
          </HeroButton>
        </Link>
      </div>

      {/* Events list - cards with image + details side by side */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Card key={i} className="animate-pulse h-32" />)}
        </div>
      ) : events.length === 0 ? (
        <Card className="p-12 text-center">
          <Card.Content>
            <CalIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">Aucun événement.</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <Card key={ev.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Card.Content className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Date badge + image */}
                  <div className="relative w-full sm:w-56 h-40 sm:h-auto shrink-0">
                    <Image
                      src={ev.image || "/placeholder.jpg"}
                      alt={ev.title}
                      fill
                      className="object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg"; }}
                    />
                    {/* Date overlay */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-sm">
                      <p className="text-2xl font-bold text-[#2d2d83] leading-none">
                        {ev.date_at ? new Date(ev.date_at).getDate() : "—"}
                      </p>
                      <p className="text-xs text-gray-500 uppercase">
                        {ev.date_at ? new Date(ev.date_at).toLocaleDateString("fr-FR", { month: "short" }) : ""}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#2d2d83] mb-2">{ev.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                          {ev.time_at && (
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ev.time_at}</span>
                          )}
                          {ev.location_at && (
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {ev.location_at}</span>
                          )}
                        </div>
                        {ev.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{ev.description}</p>
                        )}
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex items-center justify-between">
                      <Link href={`/dashboard/evenements/${ev.id}`} className="text-sm text-[#2d2d83] font-medium flex items-center gap-1 hover:underline">
                        <Eye className="w-3.5 h-3.5" /> Voir les inscrits
                      </Link>
                      <div className="flex gap-2">
                        <HeroButton variant="outline" className="rounded-lg text-sm text-[#2d2d83] border-[#2d2d83]/20" onPress={() => { setEventToEdit(ev); setEditOpen(true); }}>
                          <Edit className="w-3.5 h-3.5" /> Modifier
                        </HeroButton>
                        <HeroButton variant="ghost" className="rounded-lg text-red-500 hover:bg-red-50" onPress={() => { setEventToDelete(ev.id); setDeleteOpen(true); }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </HeroButton>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-[#2d2d83]">Nouvel événement</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={createForm.handleSubmit(onCreateSubmit)}>
            <HeroTextField>
              <HeroLabel>Titre</HeroLabel>
              <HeroInput {...createForm.register("title")} placeholder="Nom de l'événement" />
            </HeroTextField>

            <HeroTextField>
              <HeroLabel>Description</HeroLabel>
              <HeroTextArea {...createForm.register("description")} placeholder="Décrivez l'événement..." rows={3} />
            </HeroTextField>

            <HeroTextField>
              <HeroLabel>Lieu</HeroLabel>
              <HeroInput {...createForm.register("location_at")} placeholder="Paroisse St Sauveur" />
            </HeroTextField>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input type="date" {...createForm.register("date_at")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <Input type="time" {...createForm.register("time_at")} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image de l&apos;événement</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#2d2d83]/30 transition-colors cursor-pointer">
                {files.length > 0 ? (
                  <p className="text-sm text-gray-700">{files[0].name}</p>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-500">Ajouter une image</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setFiles([e.target.files[0]])} />
              </label>
            </div>

            <button type="submit" className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-xl py-3 font-medium transition-colors">
              Créer l&apos;événement
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-[#2d2d83]">Modifier l&apos;événement</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={updateForm.handleSubmit(onUpdateSubmit)}>
            <HeroTextField>
              <HeroLabel>Titre</HeroLabel>
              <HeroInput {...updateForm.register("title")} />
            </HeroTextField>

            <HeroTextField>
              <HeroLabel>Description</HeroLabel>
              <HeroTextArea {...updateForm.register("description")} rows={3} />
            </HeroTextField>

            <HeroTextField>
              <HeroLabel>Lieu</HeroLabel>
              <HeroInput {...updateForm.register("location_at")} />
            </HeroTextField>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input type="date" {...updateForm.register("date_at")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <Input type="time" {...updateForm.register("time_at")} />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#2d2d83] hover:bg-[#232370] text-white rounded-xl py-3 font-medium transition-colors">
              Mettre à jour
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-red-600">Supprimer cet événement ?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">L&apos;événement et toutes les inscriptions associées seront supprimés définitivement.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Annuler
            </button>
            <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
