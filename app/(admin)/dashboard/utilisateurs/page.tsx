"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import {
  Card,
  Button,
  Chip,
  SearchField,
  Avatar,
  Switch,
} from "@heroui/react"
import {
  Plus,
  Edit,
  Trash2,
  Users as UsersIcon,
  Shield,
  Church,
  Mail,
  Phone,
  Image as ImageIcon,
  X as XIcon,
  KeyRound,
} from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { userAPI } from "@/features/user/apis/user.api"
import {
  IUser,
  IUserRole,
  IUserStatus,
  ROLE_LABELS,
} from "@/features/user/types/user.type"

interface FormState {
  fullname: string
  email: string
  phone: string
  password: string
  role: IUserRole
  status: IUserStatus
}

const EMPTY: FormState = {
  fullname: "",
  email: "",
  phone: "",
  password: "",
  role: "ADMIN",
  status: "ENABLE",
}

export default function UtilisateursPage() {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")

  // Modal create/edit
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<IUser | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete
  const [toDelete, setToDelete] = useState<IUser | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    try {
      const res = await userAPI.obtenirTous({ per_page: "100" })
      setUsers((res.data ?? []) as IUser[])
    } catch {
      toast.error("Erreur chargement utilisateurs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return users
      .filter((u) => filterRole === "all" || u.role === filterRole)
      .filter(
        (u) =>
          !search ||
          u.fullname.toLowerCase().includes(search.toLowerCase()) ||
          (u.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (u.phone ?? "").includes(search),
      )
  }, [users, filterRole, search])

  const counts = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "ADMIN").length,
      priest: users.filter((u) => u.role === "PRIEST").length,
      active: users.filter((u) => u.status === "ENABLE").length,
    }
  }, [users])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setPhotoFile(null)
    setOpen(true)
  }

  const openEdit = (u: IUser) => {
    setEditing(u)
    setForm({
      fullname: u.fullname,
      email: u.email ?? "",
      phone: u.phone ?? "",
      password: "",
      role: (u.role ?? "ADMIN") as IUserRole,
      status: u.status,
    })
    setPhotoFile(null)
    setOpen(true)
  }

  const save = async () => {
    if (!form.fullname.trim() || !form.phone.trim()) {
      toast.error("Nom et téléphone sont obligatoires.")
      return
    }
    if (!editing && !form.password) {
      toast.error("Le mot de passe est requis pour un nouveau compte.")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      if (editing) fd.append("_method", "PUT")
      fd.append("fullname", form.fullname)
      if (form.email) fd.append("email", form.email)
      fd.append("phone", form.phone)
      if (form.password) fd.append("password", form.password)
      fd.append("role", form.role)
      fd.append("status", form.status)
      if (photoFile) fd.append("photo", photoFile)

      if (editing) {
        const res = await userAPI.modifier(editing.id, fd)
        setUsers((prev) => prev.map((x) => (x.id === editing.id ? res.data : x)))
        toast.success("Utilisateur mis à jour")
      } else {
        const res = await userAPI.ajouter(fd)
        setUsers((prev) => [res.data, ...prev])
        toast.success("Compte créé")
      }
      setOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (u: IUser) => {
    const newStatus = u.status === "ENABLE" ? "DISABLE" : "ENABLE"
    try {
      const res = await userAPI.modifier(u.id, { status: newStatus })
      setUsers((prev) => prev.map((x) => (x.id === u.id ? res.data : x)))
      toast.success(newStatus === "ENABLE" ? "Compte activé" : "Compte désactivé")
    } catch {
      toast.error("Erreur")
    }
  }

  const remove = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await userAPI.supprimer(toDelete.id)
      setUsers((prev) => prev.filter((x) => x.id !== toDelete.id))
      toast.success("Utilisateur supprimé")
      setToDelete(null)
    } catch {
      toast.error("Erreur")
    } finally {
      setDeleting(false)
    }
  }

  const photoPreview = photoFile ? URL.createObjectURL(photoFile) : editing?.photo ?? null

  return (
    <div>
      <Header title="Utilisateurs & Comptes" />

      <p className="text-sm text-gray-500 mb-6 max-w-3xl">
        Gérez les comptes ayant accès à l&apos;administration de la paroisse : administrateurs et prêtres.
        Désactivez un compte pour bloquer son accès sans le supprimer.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={UsersIcon} value={String(counts.total)} label="Total" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Shield} value={String(counts.admin)} label="Administrateurs" iconBgColor="bg-[#98141f]/10" iconColor="text-[#98141f]" />
        <StatCard icon={Church} value={String(counts.priest)} label="Prêtres" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
        <StatCard icon={UsersIcon} value={String(counts.active)} label="Actifs" iconBgColor="bg-green-100" iconColor="text-green-600" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchField className="flex-1 md:max-w-sm" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Rechercher (nom, email, tél)..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Tous" },
            { key: "ADMIN", label: "Admin" },
            { key: "PRIEST", label: "Prêtres" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterRole(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterRole === f.key ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Button variant="primary" className="bg-[#98141f] rounded-xl md:ml-auto" onPress={openCreate}>
          <Plus className="w-4 h-4" /> Nouveau compte
        </Button>
      </div>

      {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

      {!loading && filtered.length === 0 && (
        <Card className="p-12">
          <Card.Content className="text-center">
            <UsersIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun utilisateur pour ce filtre.</p>
          </Card.Content>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u) => {
            const roleMeta = u.role ? ROLE_LABELS[u.role] : { label: "—", color: "bg-gray-100 text-gray-600" }
            return (
              <Card key={u.id} className={u.status === "DISABLE" ? "opacity-60" : ""}>
                <Card.Content className="p-5">
                  <div className="flex items-start gap-4 mb-3">
                    <Avatar className="w-14 h-14 ring-2 ring-[#2d2d83]/10 shrink-0">
                      {u.photo ? <Avatar.Image src={u.photo} alt={u.fullname} /> : null}
                      <Avatar.Fallback className="bg-[#2d2d83] text-white font-semibold">
                        {u.fullname?.charAt(0).toUpperCase() || "?"}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#2d2d83] truncate">{u.fullname}</h3>
                      <div className="flex items-center flex-wrap gap-1.5 mt-1">
                        <Chip variant="soft" size="sm" className={roleMeta.color}>
                          {roleMeta.label}
                        </Chip>
                        <Chip
                          variant="soft"
                          color={u.status === "ENABLE" ? "success" : "danger"}
                          size="sm"
                        >
                          {u.status === "ENABLE" ? "Actif" : "Désactivé"}
                        </Chip>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4 text-sm text-gray-600">
                    {u.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    )}
                    {u.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{u.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Switch isSelected={u.status === "ENABLE"} onChange={() => toggleStatus(u)}>
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch>
                      <span>{u.status === "ENABLE" ? "Activé" : "Désactivé"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0 rounded-lg text-[#2d2d83] hover:bg-[#2d2d83]/10"
                        onPress={() => openEdit(u)}
                        aria-label="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0 rounded-lg text-red-500 hover:bg-red-50"
                        onPress={() => setToDelete(u)}
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">
              {editing ? "Modifier l'utilisateur" : "Nouveau compte"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-[#2d2d83]/30 transition-colors">
                {photoPreview ? (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {photoFile ? photoFile.name : "Photo actuelle"}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs text-[#2d2d83] hover:underline"
                        >
                          Changer
                        </button>
                        {photoFile && (
                          <button
                            type="button"
                            onClick={() => setPhotoFile(null)}
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
                    className="w-full flex flex-col items-center justify-center py-3 text-gray-500"
                  >
                    <ImageIcon className="w-8 h-8 text-gray-300 mb-1" />
                    <p className="text-sm">Ajouter une photo</p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
              <input
                value={form.fullname}
                onChange={(e) => setForm((f) => ({ ...f, fullname: e.target.value }))}
                placeholder="Père Jean Dupont"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+225 07 00 00 00 00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe {editing ? <span className="text-gray-400 text-xs">(laisser vide pour ne pas changer)</span> : "*"}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder={editing ? "••••••" : "Minimum 6 caractères"}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as IUserRole }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 bg-white"
                >
                  <option value="ADMIN">Administrateur</option>
                  <option value="PRIEST">Prêtre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as IUserStatus }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 bg-white"
                >
                  <option value="ENABLE">Actif</option>
                  <option value="DISABLE">Désactivé</option>
                </select>
              </div>
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-60"
            >
              {saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer le compte"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer cet utilisateur ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            <strong>{toDelete?.fullname}</strong> n&apos;aura plus accès au tableau de bord. Cette action est réversible (soft delete).
          </p>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setToDelete(null)}>
              Annuler
            </Button>
            <Button variant="primary" className="bg-red-600" isDisabled={deleting} onPress={remove}>
              {deleting ? "..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
