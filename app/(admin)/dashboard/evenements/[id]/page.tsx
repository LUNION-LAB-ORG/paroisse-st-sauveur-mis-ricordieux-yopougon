"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Calendar, Users, Trash2, ArrowLeft, Mail, Phone } from "lucide-react"
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

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<IEvenement | null>(null)
  const [participants, setParticipants] = useState<IParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    Promise.all([
      evenementAPI.obtenirParId(id).catch(() => null),
      participantAPI.obtenirTous({ event_id: id }).catch(() => ({ data: [] as IParticipant[] })),
    ]).then(([ev, parts]) => {
      setEvent(ev as IEvenement | null)
      setParticipants((parts as { data: IParticipant[] }).data ?? [])
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <Link href="/dashboard/evenements" className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2d2d83] mb-2">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} value={String(participants.length)} label="Inscrits" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Mail} value={String(participants.filter((p) => p.email).length)} label="Avec email" iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Phone} value={String(participants.filter((p) => p.phone).length)} label="Avec téléphone" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
      </div>

      <h2 className="text-lg font-bold text-[#2d2d83] mb-4">Liste des inscrits</h2>

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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Téléphone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.fullname}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{p.email ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{p.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{p.message ?? "—"}</td>
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

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Retirer cet inscrit ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Cette inscription sera supprimée définitivement.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteId(null)} disabled={deleting} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Annuler
            </button>
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
