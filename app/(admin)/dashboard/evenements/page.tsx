"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Edit, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/data-table";
import { DetailModal } from "@/components/admin/detail-modal";
import { Header } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { evenementAPI } from "@/features/evenement/apis/evenement.api";

import {
  EventSchema,
  EventTypeSchema,
  UpdateEventSchema,
  UpdateEventTypeSchema,
} from "@/features/evenement/schemas/evenement.schema";
import Image from "next/image";

/* ================= PAGE ================= */

export default function EvenementsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [eventToEdit, setEventToEdit] = useState<any | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await evenementAPI.obtenirTous();
        setEvents(res.data ?? []);
      } catch (err: any) {
        toast.error(err.message || "Erreur lors du chargement des evenements");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /* ================= CREATE ================= */

  const createForm = useForm<EventTypeSchema>({
    resolver: zodResolver(EventSchema),
  });

  const onCreateSubmit = async (data: EventTypeSchema) => {
    const payload: EventTypeSchema = {
      ...data,
      image: files[0],
    };

    try {
      const res = await evenementAPI.ajouter(payload);
      toast.success("évènement créé");
      if (res) setEvents((prev) => [...prev, res]);
      createForm.reset();
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    }
  };

  /* ================= UPDATE (JSON !!) ================= */

  const updateForm = useForm<UpdateEventTypeSchema>({
    resolver: zodResolver(UpdateEventSchema),
  });

  useEffect(() => {
    if (eventToEdit) {
      updateForm.reset({
        title: eventToEdit.title,
        description: eventToEdit.description,
        location_at: eventToEdit.location_at,
        date_at: eventToEdit.date_at,
        time_at: eventToEdit.time_at,
      });
    }
  }, [eventToEdit, updateForm]);

  const onUpdateSubmit = async (data: UpdateEventTypeSchema) => {
    if (!eventToEdit) return;

    try {
      const res = await evenementAPI.modifier(String(eventToEdit.id), data);

      toast.success("évènement mis à jour");

      setEvents((prev) =>
        prev.map((ev) => (ev.id === eventToEdit.id ? (res as any) : ev))
      );

      setEditOpen(false);
      setEventToEdit(null);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    }
  };

  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);

      await evenementAPI.supprimer(String(eventToDelete));

      toast.success("évènement supprimé");
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete));
      setDeleteOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ================= TABLE ================= */

  const columns = [
    { key: "title", label: "Titre" },
    { key: "location_at", label: "Lieu" },
    { key: "date_at", label: "Date" },
    { key: "time_at", label: "Heure" },
    {
      key: "image",
      label: "Image",
      render: (_: any, row: any) => (
        <div className="w-16 h-16 overflow-hidden rounded-md border">
          <Image
            src={row.image}
            alt={row.title}
            width={200}
            height={200}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
            }}
          />
        </div>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {/* 👁️ EYE – DETAIL */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedItem(row);
              setDetailOpen(true);
            }}
          >
            <Eye size={16} />
          </Button>

          {/* ✏️ EDIT */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setEventToEdit(row);
              setEditOpen(true);
            }}
          >
            <Edit size={16} />
          </Button>

          {/* ❌ DELETE */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setEventToDelete(row.id);
              setDeleteOpen(true);
            }}
          >
            <X size={16} />
          </Button>
        </div>
      ),
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div>
      <Header title="Gestion des évènements" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon={Calendar} value="02" label="En attente" />
        <StatCard icon={Calendar} value="19" label="Confirmés" />
        <StatCard icon={Calendar} value="10" label="Ce mois" />
      </div>

      <DataTable
        columns={columns}
        data={events}
        actionButton={{
          label: "+ Nouvel évènement",
          onClick: () => setCreateOpen(true),
        }}
      />

      {/* ================= DETAIL MODAL ================= */}
      {selectedItem && (
        <DetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title="Détails de l'évènement"
          data={{
            image: selectedItem.image,
            title: selectedItem.title,
            date: selectedItem.date_at,
            heure: selectedItem.time_at,
            lieu: selectedItem.location_at,
            description: selectedItem.description,
          }}
        />
      )}

      {/* ================= CREATE MODAL ================= */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un évènement</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={createForm.handleSubmit(onCreateSubmit)}
          >
            <Input {...createForm.register("title")} placeholder="Titre" />
            <Input
              {...createForm.register("description")}
              placeholder="Description"
            />
            <Input {...createForm.register("location_at")} placeholder="Lieu" />
            <Input type="date" {...createForm.register("date_at")} />
            <Input type="time" {...createForm.register("time_at")} />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setFiles([e.target.files[0]])}
            />

            <Button type="submit">Créer</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= UPDATE MODAL ================= */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'évènement</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
          >
            <Input {...updateForm.register("title")} />
            <Input {...updateForm.register("description")} />
            <Input {...updateForm.register("location_at")} />
            <Input type="date" {...updateForm.register("date_at")} />
            <Input type="time" {...updateForm.register("time_at")} />

            <Button type="submit">Mettre à jour</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE MODAL ================= */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer</DialogTitle>
          </DialogHeader>

          <p>Cette action est irréversible.</p>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
