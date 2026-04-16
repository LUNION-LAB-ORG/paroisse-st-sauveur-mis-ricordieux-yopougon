"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Calendar,
  Users,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  Settings,
  Save,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { StatCard } from "@/components/admin/stat-card"
import { Card } from "@heroui/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { evenementAPI } from "@/features/evenement/apis/evenement.api"
import { participantAPI } from "@/features/participant/apis/participant.api"
import type { IEvenement } from "@/features/evenement/types/evenement.type"
import type { IParticipant } from "@/features/participant/types/participant.type"

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
  } catch { return iso }
}

function formatDateShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch { return iso }
}

type PaymentStatus = IParticipant["payment_status"]

function PaymentBadge({ status }: { status: PaymentStatus }) {
  if (!status || status === "pending") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        En attente
      </span>
    )
  }
  if (status === "paid" || status === "succeeded") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Payé
      </span>
    )
  }
  if (status === "free") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Gratuit
      </span>
    )
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
        Échoué
      </span>
    )
  }
  return null
}

interface ConfigForm {
  is_paid: boolean
  price: string
  max_participants: string
  registration_deadline: string
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<IEvenement | null>(null)
  const [participants, setParticipants] = useState<IParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState<"participants" | "configuration">("participants")

  // Config form state
  const [config, setConfig] = useState<ConfigForm>({
    is_paid: false,
    price: "",
    max_participants: "",
    registration_deadline: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      evenementAPI.obtenirParId(id).catch(() => null),
      participantAPI.obtenirTous({ event_id: id }).catch(() => ({ data: [] as IParticipant[] })),
    ]).then(([ev, parts]) => {
      const e = ev as IEvenement | null
      setEvent(e)
      setParticipants((parts as { data: IParticipant[] }).data ?? [])
      if (e) {
        setConfig({
          is_paid: e.is_paid ?? false,
          price: e.price !== null && e.price !== undefined ? String(e.price) : "",
          max_participants: e.max_participants !== null && e.max_participants !== undefined ? String(e.max_participants) : "",
          registration_deadline: e.registration_deadline
            ? e.registration_deadline.slice(0, 16) // "YYYY-MM-DDTHH:mm"
            : "",
        })
      }
    }).finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await participantAPI.supprimer(deleteId)
      setParticipants((prev) => prev.filter((p) => p.id !== deleteId))
      toast.success("Participant supprimé")
      setDeleteId(null)
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        is_paid: config.is_paid,
        price: config.is_paid && config.price ? Number(config.price) : null,
        max_participants: config.max_participants ? Number(config.max_participants) : null,
        registration_deadline: config.registration_deadline || null,
      }
      const updated = await evenementAPI.modifier(id, payload)
      setEvent(updated)
      toast.success("Configuration enregistrée")
    } catch {
      toast.error("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <Link
            href="/dashboard/evenements"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2d2d83] mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux événements
          </Link>
          <h1 className="text-xl lg:text-2xl font-bold text-[#2d2d83]">
            {loading ? "Chargement..." : event?.title ?? `Événement #${id}`}
          </h1>
          {event && (
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(event.date_at)} · {event.time_at} · {event.location_at}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Users}
          value={String(participants.length)}
          label="Inscrits"
          iconBgColor="bg-[#2d2d83]/10"
          iconColor="text-[#2d2d83]"
        />
        <StatCard
          icon={Mail}
          value={String(participants.filter((p) => p.email).length)}
          label="Avec email"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={Phone}
          value={String(participants.filter((p) => p.phone).length)}
          label="Avec téléphone"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("participants")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "participants"
              ? "border-[#2d2d83] text-[#2d2d83]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users className="w-4 h-4" /> Participants
        </button>
        <button
          onClick={() => setActiveTab("configuration")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "configuration"
              ? "border-[#2d2d83] text-[#2d2d83]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Settings className="w-4 h-4" /> Configuration
        </button>
      </div>

      {/* Tab: Participants */}
      {activeTab === "participants" && (
        <>
          {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

          {!loading && participants.length === 0 && (
            <Card className="p-12 text-center">
              <Card.Content>
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">Aucun inscrit pour cet événement.</p>
              </Card.Content>
            </Card>
          )}

          {!loading && participants.length > 0 && (
            <Card>
              <Card.Content className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Téléphone</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Paiement</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {participants.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.fullname}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{p.phone ?? "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{p.email ?? "—"}</td>
                          <td className="px-4 py-3">
                            <PaymentBadge status={p.payment_status} />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDateShort(p.created_at)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setDeleteId(p.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          )}
        </>
      )}

      {/* Tab: Configuration */}
      {activeTab === "configuration" && (
        <Card>
          <Card.Content className="p-6">
            <h2 className="text-base font-semibold text-[#2d2d83] mb-5">Paramètres de l&apos;événement</h2>

            <div className="space-y-5 max-w-lg">
              {/* is_paid toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Événement payant</p>
                  <p className="text-xs text-gray-500 mt-0.5">Active le paiement Wave lors de l&apos;inscription</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig((c) => ({ ...c, is_paid: !c.is_paid }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.is_paid ? "bg-[#2d2d83]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.is_paid ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* price */}
              {config.is_paid && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Prix (XOF)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={config.price}
                      onChange={(e) => setConfig((c) => ({ ...c, price: e.target.value }))}
                      placeholder="Ex : 5000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/30 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                      XOF
                    </span>
                  </div>
                </div>
              )}

              {/* max_participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre maximum de participants
                </label>
                <input
                  type="number"
                  min={0}
                  value={config.max_participants}
                  onChange={(e) => setConfig((c) => ({ ...c, max_participants: e.target.value }))}
                  placeholder="Laisser vide = illimité"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/30"
                />
                <p className="text-xs text-gray-400 mt-1">Laisser vide pour ne pas limiter les inscriptions</p>
              </div>

              {/* registration_deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date limite d&apos;inscription
                </label>
                <input
                  type="datetime-local"
                  value={config.registration_deadline}
                  onChange={(e) => setConfig((c) => ({ ...c, registration_deadline: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/30"
                />
                <p className="text-xs text-gray-400 mt-1">Laisser vide pour ne pas définir de date limite</p>
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="flex items-center gap-2 bg-[#2d2d83] hover:bg-[#24246b] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                ) : (
                  <><Save className="w-4 h-4" /> Enregistrer</>
                )}
              </button>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Retirer cet inscrit ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Cette inscription sera supprimée définitivement.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setDeleteId(null)}
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
  )
}
