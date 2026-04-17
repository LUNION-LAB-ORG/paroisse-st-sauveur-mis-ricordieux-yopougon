"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Check,
  Clock,
  Edit,
  Mail,
  MapPin,
  Users,
  X,
  Coins,
  Calendar,
  ArrowRight,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  Chip,
  SearchField,
  Separator,
  Avatar,
} from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Header } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { organisationAPI } from "@/features/organisation/apis/organisation.api";
import type {
  IOrganisation,
  IOrganisationStatutDemande,
} from "@/features/organisation/types/organisation.type";

const FILTERS: { key: IOrganisationStatutDemande | "all"; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: "En attente" },
  { key: "accepted", label: "Confirmées" },
  { key: "canceled", label: "Annulées" },
];

function formatDateLong(iso?: string) {
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

function formatDay(iso?: string): { day: string; month: string; year: string } {
  if (!iso) return { day: "—", month: "", year: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: iso, month: "", year: "" };
  return {
    day: d.toLocaleDateString("fr-FR", { day: "2-digit" }),
    month: d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
    year: d.toLocaleDateString("fr-FR", { year: "numeric" }),
  };
}

function formatTime(t?: string): string {
  if (!t) return "—";
  if (/^\d{2}:\d{2}/.test(t)) return t.slice(0, 5);
  const d = new Date(t);
  if (!isNaN(d.getTime())) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return t;
}

type StatusMeta = {
  chipColor: "warning" | "success" | "danger" | "default";
  label: string;
  accent: string;
};

const STATUS_META: Record<IOrganisationStatutDemande, StatusMeta> = {
  pending: { chipColor: "warning", label: "En attente", accent: "border-l-amber-400" },
  accepted: { chipColor: "success", label: "Confirmée", accent: "border-l-green-500" },
  canceled: { chipColor: "danger", label: "Annulée", accent: "border-l-red-400" },
};

export default function OrganisationsPage() {
  const [data, setData] = useState<IOrganisation[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [confirmAction, setConfirmAction] = useState<{ id: number; action: "accept" | "reject" } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    organisationAPI
      .obtenirTous()
      .then((res) => setData(res.data ?? []))
      .catch(() => toast.error("Erreur lors du chargement des demandes"))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    total: data.length,
    pending: data.filter((o) => o.request_status === "pending").length,
    accepted: data.filter((o) => o.request_status === "accepted").length,
    canceled: data.filter((o) => o.request_status === "canceled").length,
  }), [data]);

  const filtered = useMemo(() => {
    return data
      .filter((o) => filter === "all" || o.request_status === filter)
      .filter((o) =>
        !search ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        (o.eventType ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (o.movement ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (o.title ?? "").toLowerCase().includes(search.toLowerCase()),
      );
  }, [data, filter, search]);

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const newStatus: IOrganisationStatutDemande =
        confirmAction.action === "accept" ? "accepted" : "canceled";
      await organisationAPI.modifier(confirmAction.id, { request_status: newStatus });
      setData((prev) =>
        prev.map((o) => (o.id === confirmAction.id ? { ...o, request_status: newStatus } : o)),
      );
      toast.success(confirmAction.action === "accept" ? "Demande confirmée" : "Demande annulée");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  return (
    <div>
      <Header title="Demandes d'événements" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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
        <StatCard
          icon={X}
          value={String(counts.canceled).padStart(2, "0")}
          label="Annulées"
          iconBgColor="bg-red-100"
          iconColor="text-red-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <SearchField
          className="flex-1 lg:max-w-sm"
          value={search}
          onChange={setSearch}
          aria-label="Rechercher une demande"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Nom, email, mouvement, type..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => {
            const count = f.key === "all" ? counts.total : counts[f.key as keyof typeof counts] ?? 0;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-[#2d2d83] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 ${
                    filter === f.key ? "bg-white/20 text-white" : "bg-white text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse h-56" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <Card className="p-12">
          <Card.Content className="text-center">
            <CalendarPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune demande pour ces filtres</p>
            <p className="text-gray-400 text-sm mt-1">
              Essayez d&apos;ajuster la recherche ou les statuts.
            </p>
          </Card.Content>
        </Card>
      )}

      {/* Liste compacte de cartes */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((o) => {
            const status = (o.request_status ?? "pending") as IOrganisationStatutDemande;
            const meta = STATUS_META[status];
            const d = formatDay(o.date);
            const initials = (o.movement || o.email || "?").slice(0, 2).toUpperCase();
            const priceLabel = o.is_paid
              ? o.price
                ? `${new Intl.NumberFormat("fr-FR").format(Number(o.price))} F`
                : "Payant"
              : "Gratuit";
            return (
              <Card
                key={o.id}
                className={`border-l-4 ${meta.accent} hover:shadow-sm transition-shadow`}
              >
                <Card.Content className="p-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Date capsule compacte */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-[#2d2d83]/5 text-[#2d2d83] shrink-0">
                      <span className="text-[9px] uppercase font-semibold tracking-wide">{d.month}</span>
                      <span className="text-lg font-bold leading-none">{d.day}</span>
                    </div>

                    {/* Image thumbnail si présente */}
                    {o.image ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={o.image} alt={o.title ?? "image"} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Avatar className="w-12 h-12 shrink-0">
                        <Avatar.Fallback className="bg-[#2d2d83]/10 text-[#2d2d83] text-sm font-semibold">
                          {initials}
                        </Avatar.Fallback>
                      </Avatar>
                    )}

                    {/* Titre + méta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
                        <h3 className="font-semibold text-[#2d2d83] truncate max-w-[200px]">
                          {o.title || o.eventType || "Demande"}
                        </h3>
                        <Chip variant="soft" color="default" size="sm">{o.eventType}</Chip>
                        {o.movement && (
                          <Chip variant="soft" color="accent" size="sm">{o.movement}</Chip>
                        )}
                        <Chip variant="soft" color={meta.chipColor} size="sm">{meta.label}</Chip>
                        <Chip
                          variant="soft"
                          color={o.is_paid ? "accent" : "success"}
                          size="sm"
                        >
                          {o.is_paid ? `Payant · ${priceLabel}` : "Gratuit"}
                        </Chip>
                        {o.converted_event_id ? (
                          <Chip variant="soft" color="success" size="sm">Converti</Chip>
                        ) : null}
                      </div>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(o.startTime)}–{formatTime(o.endTime)}
                        </span>
                        {o.location_at && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{o.location_at}</span>
                          </span>
                        )}
                        {o.estimatedParticipants && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3 h-3" />~{o.estimatedParticipants}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          {priceLabel}
                        </span>
                        <span className="inline-flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[160px]">{o.email}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions compactes */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/dashboard/organisations/${o.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#2d2d83] hover:bg-[#2d2d83]/10 transition-colors"
                        aria-label="Détails"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {status === "pending" && o.id ? (
                        <>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg text-green-600 hover:bg-green-50"
                            onPress={() => setConfirmAction({ id: o.id!, action: "accept" })}
                            aria-label="Confirmer"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50"
                            onPress={() => setConfirmAction({ id: o.id!, action: "reject" })}
                            aria-label="Refuser"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : null}
                      {status === "accepted" && !o.converted_event_id ? (
                        <Link
                          href={`/dashboard/organisations/${o.id}`}
                          className="inline-flex items-center justify-center gap-1 h-8 px-3 rounded-lg text-xs font-medium text-white bg-[#98141f] hover:bg-[#7a1019] transition-colors"
                        >
                          Convertir <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog confirmer/refuser */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className={confirmAction?.action === "accept" ? "text-green-600" : "text-red-600"}>
              {confirmAction?.action === "accept" ? "Confirmer cette demande ?" : "Refuser cette demande ?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            {confirmAction?.action === "accept"
              ? "La demande sera marquée comme confirmée et pourra être convertie en événement officiel."
              : "La demande sera annulée. L'organisateur sera invité à en soumettre une nouvelle si besoin."}
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              isDisabled={actionLoading}
              onPress={() => setConfirmAction(null)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              isDisabled={actionLoading}
              onPress={handleConfirmAction}
              className={`rounded-xl ${confirmAction?.action === "accept" ? "bg-green-600" : "bg-red-600"}`}
            >
              {actionLoading
                ? "..."
                : confirmAction?.action === "accept"
                ? "Confirmer"
                : "Refuser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{label}</p>
        <p className="text-sm text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}
