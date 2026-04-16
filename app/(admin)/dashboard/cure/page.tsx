"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Eye, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";

import { DataTable } from "@/components/admin/data-table";
import { DetailModal } from "@/components/admin/detail-modal";
import { Header } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { cureAPI } from "@/features/cure/apis/cure.api";

import {
  CureSchema,
  CureType,
  UpdateCureSchema,
  UpdateCureType,
} from "@/features/cure/schemas/cure.schema";

/* ================= PAGE ================= */

export default function CuresPage() {
  const [cures, setCures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [cureToEdit, setCureToEdit] = useState<any | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cureToDelete, setCureToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchCures = async () => {
      try {
        const res = await cureAPI.obtenirTous();
        setCures(res.data ?? []);
      } catch (err: any) {
        toast.error(err.message || "Erreur lors du chargement des cures");
      } finally {
        setLoading(false);
      }
    };

    fetchCures();
  }, []);

  /* ================= CREATE ================= */

  const createForm = useForm<CureType>({
    resolver: zodResolver(CureSchema),
  });

  const onCreateSubmit = async (data: CureType) => {
    const payload: CureType = {
      ...data,
      photo: file ?? undefined,
    };

    try {
      const res = await cureAPI.ajouter(payload);
      toast.success("Cure créée avec succès");
      if (res) setCures((prev) => [...prev, res]);
      createForm.reset();
      setFile(null);
      setCreateOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    }
  };

  /* ================= UPDATE ================= */

  const updateForm = useForm<UpdateCureType>({
    resolver: zodResolver(UpdateCureSchema),
  });

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

      toast.success("Cure mise à jour");

      setCures((prev) =>
        prev.map((c) => (c.id === cureToEdit.id ? (res as any) : c))
      );

      setEditOpen(false);
      setCureToEdit(null);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    }
  };

  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    if (!cureToDelete) return;

    try {
      setIsDeleting(true);

      await cureAPI.supprimer(String(cureToDelete));

      toast.success("Cure supprimée");
      setCures((prev) => prev.filter((c) => c.id !== cureToDelete));
      setDeleteOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ================= TABLE ================= */

  const columns = [
    { key: "fullname", label: "Nom complet" },
    { key: "started_at", label: "Début" },
    { key: "ended_at", label: "Fin" },
    {
      key: "photo",
      label: "Photo",
      render: (_: any, row: any) => (
        <div className="w-14 h-14 overflow-hidden rounded-full border">
          <Image
            src={row.photo || "/avatar-placeholder.png"}
            alt={row.fullname}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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

          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setCureToEdit(row);
              setEditOpen(true);
            }}
          >
            <Edit size={16} />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setCureToDelete(row.id);
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
      <Header title="Gestion des cures" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon={User} value={cures.length.toString()} label="Total" />
        <StatCard icon={User} value="—" label="En cours" />
        <StatCard icon={User} value="—" label="Terminées" />
      </div>

      <DataTable
        columns={columns}
        data={cures}
        actionButton={{
          label: "+ Nouveau curé",
          onClick: () => setCreateOpen(true),
        }}
      />

      {/* ================= DETAIL ================= */}
      {selectedItem && (
        <DetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title="Détails de la cure"
          data={{
            image: selectedItem.photo,
            fullname: selectedItem.fullname,
            debut: selectedItem.started_at,
            fin: selectedItem.ended_at,
            description: selectedItem.description,
          }}
        />
      )}

      {/* ================= CREATE ================= */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une cure</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={createForm.handleSubmit(onCreateSubmit)}
          >
            <Input
              {...createForm.register("fullname")}
              placeholder="Nom complet"
            />
            <Input type="date" {...createForm.register("started_at")} />
            <Input type="date" {...createForm.register("ended_at")} />
            <Textarea
              {...createForm.register("description")}
              placeholder="Description"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />

            <Button type="submit">Créer</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= UPDATE ================= */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la cure</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
          >
            <Input {...updateForm.register("fullname")} />
            <Input type="date" {...updateForm.register("started_at")} />
            <Input type="date" {...updateForm.register("ended_at")} />
            <Textarea {...updateForm.register("description")} />

            <Button type="submit">Mettre à jour</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE ================= */}
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
