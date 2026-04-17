"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Mail,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Chip, SearchField, Separator } from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { organisationAPI } from "@/features/organisation/apis/organisation.api";
import type {
  IOrganisation,
  IOrganisationStatutDemande,
} from "@/features/organisation/types/organisation.type";

const filters: Array<IOrganisationStatutDemande | "all"> = [
  "all",
  "pending",
  "accepted",
  "canceled",
];
const filterLabels: Record<string, string> = {
  all: "Toutes",
  pending: "En attente",
  accepted: "Confirmées",
  canceled: "Annulées",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function OrganisationsPage() {
  const [data, setData] = useState<IOrganisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    id: number;
    action: "accept" | "reject";
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    organisationAPI
      .obtenirTous()
      .then((res) => setData(res.data ?? []))
      .catch(() => toast.error("Erreur lors du chargement des demandes"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data
    .filter((o) => filter === "all" || o.request_status === filter)
    .filter(
      (o) =>
        !search ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        o.eventType.toLowerCase().includes(search.toLowerCase()) ||
        (o.movement ?? "").toLowerCase().includes(search.toLowerCase()),
    );

  const counts = {
    total: data.length,
    pending: data.filter((o) => o.request_status === "pending").length,
    accepted: data.filter((o) => o.request_status === "accepted").length,
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const newStatus: IOrganisationStatutDemande =
        confirmAction.action === "accept" ? "accepted" : "canceled";
      await organisationAPI.modifier(confirmAction.id, {
        request_status: newStatus,
      });
      setData((prev) =>
        prev.map((o) =>
          o.id === confirmAction.id ? { ...o, request_status: newStatus } : o,
        ),
      );
      toast.success(
        confirmAction.action === "accept"
          ? "Demande confirmée"
          : "Demande annulée",
      );
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const statusMap: Record<string, "pending" | "confirmed" | "cancelled"> = {
    pending: "pending",
    accepted: "confirmed",
    canceled: "cancelled",
  };
  const labelMap: Record<string, string> = {
    pending: "En attente",
    accepted: "Confirmée",
    canceled: "Annulée",
  };

  return (
    <div>
      <Header title="Demandes d'événements" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={CalendarPlus}
          value={String(counts.total)}
          label="Total demandes"
          iconBgColor="bg-[#2d2d83]/10"
          iconColor="text-[#2d2d83]"
        />
        <StatCard
          icon={Clock}
          value={String(counts.pending).padStart(2, "0")}
          label="En attente"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={Check}
          value={String(counts.accepted).padStart(2, "0")}
          label="Confirmées"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchField
          className="flex-1 sm:max-w-xs"
          value={search}
          onChange={setSearch}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Rechercher (email, mouvement, type)..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <div className="flex gap-2 flex-wrap flex-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-[#2d2d83] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filterLabels[f]}
              {f !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({data.filter((o) => o.request_status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <Card className="p-12 text-center">
          <Card.Content>
            <p className="text-gray-400">Chargement...</p>
          </Card.Content>
        </Card>
      )}

      {!loading && filtered.length === 0 && (
        <Card className="p-12 text-center">
          <Card.Content>
            <CalendarPlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Aucune demande pour ce filtre.</p>
          </Card.Content>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((o) => {
            const isExpanded = expandedId === o.id;
            return (
              <Card key={o.id} className="hover:shadow-md transition-shadow">
                <Card.Content className="p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 w-28 shrink-0">
                      <CalendarPlus className="w-4 h-4 text-[#2d2d83]/60" />
                      <span className="text-sm font-medium text-gray-700">
                        {formatDate(o.date).split(" ")[0]}{" "}
                        {formatDate(o.date).split(" ")[1]}
                      </span>
                    </div>
                    <Chip variant="soft" color="default" size="sm">
                      {o.eventType}
                    </Chip>
                    {o.movement && (
                      <Chip variant="soft" color="accent" size="sm">
                        {o.movement}
                      </Chip>
                    )}
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-600 truncate">
                        {o.email}
                      </span>
                    </div>
                    <StatusBadge
                      status={statusMap[o.request_status ?? "pending"] ?? "pending"}
                      label={labelMap[o.request_status ?? "pending"] ?? "—"}
                    />
                    <div className="flex items-center gap-1">
                      {o.id && (
                        <Link
                          href={`/dashboard/organisations/${o.id}`}
                          className="inline-flex items-center justify-center h-8 w-8 p-0 text-[#2d2d83] hover:bg-[#2d2d83]/10 rounded-lg"
                          aria-label="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )}
                      {o.request_status === "pending" && o.id && (
                        <>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 rounded-lg"
                            onPress={() =>
                              setConfirmAction({ id: o.id!, action: "accept" })
                            }
                            aria-label="Confirmer"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                            onPress={() =>
                              setConfirmAction({ id: o.id!, action: "reject" })
                            }
                            aria-label="Refuser"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-100 rounded-lg"
                        onPress={() =>
                          setExpandedId(isExpanded ? null : (o.id ?? null))
                        }
                        aria-label="Détails"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>
                          {o.startTime} – {o.endTime}
                        </span>
                      </div>
                      {o.estimatedParticipants && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>
                            ~{o.estimatedParticipants} participants estimés
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {o.isParishMember === "yes"
                            ? "Membre de la paroisse"
                            : "Non-membre"}
                        </span>
                      </div>
                      {o.description && (
                        <p className="sm:col-span-2 text-gray-600 bg-gray-50 rounded-xl p-3">
                          {o.description}
                        </p>
                      )}
                    </div>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle
              className={
                confirmAction?.action === "accept"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {confirmAction?.action === "accept"
                ? "Confirmer cette demande ?"
                : "Refuser cette demande ?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            {confirmAction?.action === "accept"
              ? "La demande d'organisation sera marquée comme confirmée."
              : "La demande sera annulée."}
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setConfirmAction(null)}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={actionLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-60 ${
                confirmAction?.action === "accept"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {actionLoading
                ? "..."
                : confirmAction?.action === "accept"
                  ? "Confirmer"
                  : "Refuser"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
