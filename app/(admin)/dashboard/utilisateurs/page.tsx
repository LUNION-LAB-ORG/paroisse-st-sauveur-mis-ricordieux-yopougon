"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  Avatar,
  Button,
  Card,
  Chip,
  Input,
  Label,
  ListBox,
  SearchField,
  Select,
  Switch,
  Table,
  TextField,
} from "@heroui/react"
import {
  Plus,
  Edit,
  Trash2,
  Users as UsersIcon,
  Shield,
  Church,
  KeyRound,
} from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { ImageUploadField } from "@/components/admin/image-upload-field"
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
  role: "admin",
  status: "active",
}

function formatDateFR(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
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
          u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
          (u.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (u.phone ?? "").includes(search),
      )
  }, [users, filterRole, search])

  const counts = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      priest: users.filter((u) => u.role === "priest").length,
      active: users.filter((u) => u.status === "active").length,
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
      fullname: u.fullname ?? "",
      email: u.email ?? "",
      phone: u.phone ?? "",
      password: "",
      role: (u.role ?? "admin") as IUserRole,
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
    const newStatus: IUserStatus = u.status === "active" ? "inactive" : "active"
    try {
      const res = await userAPI.modifier(u.id, { status: newStatus })
      setUsers((prev) => prev.map((x) => (x.id === u.id ? res.data : x)))
      toast.success(newStatus === "active" ? "Compte activé" : "Compte désactivé")
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

  return (
    <div>
      <Header title="Utilisateurs & Comptes" />

      <p className="text-sm text-gray-500 mb-6 max-w-3xl">
        Gérez les comptes ayant accès à l&apos;administration de la paroisse : administrateurs et prêtres.
        Désactivez un compte pour bloquer son accès sans le supprimer.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={UsersIcon} value={String(counts.total)} label="Total" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Shield} value={String(counts.admin)} label="Administrateurs" iconBgColor="bg-[#98141f]/10" iconColor="text-[#98141f]" />
        <StatCard icon={Church} value={String(counts.priest)} label="Prêtres" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
        <StatCard icon={UsersIcon} value={String(counts.active)} label="Actifs" iconBgColor="bg-green-100" iconColor="text-green-600" />
      </div>

      {/* Filtres + bouton créer */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <SearchField className="flex-1 md:max-w-sm" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Rechercher (nom, email, tél)..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Select
          selectedKey={filterRole}
          onSelectionChange={(k) => setFilterRole(String(k))}
          className="w-full md:w-48"
        >
          <Label>Rôle</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="all" textValue="Tous">Tous</ListBox.Item>
              <ListBox.Item id="admin" textValue="Administrateurs">Administrateurs</ListBox.Item>
              <ListBox.Item id="priest" textValue="Prêtres">Prêtres</ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>

        <Button variant="primary" className="bg-[#98141f] rounded-xl md:ml-auto" onPress={openCreate}>
          <Plus className="w-4 h-4" /> Nouveau compte
        </Button>
      </div>

      {/* Table HeroUI */}
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
        <Card className="overflow-hidden">
          <Card.Content className="p-0">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label="Liste des utilisateurs" className="min-w-[800px]">
                  <Table.Header>
                    <Table.Column isRowHeader>Utilisateur</Table.Column>
                    <Table.Column>Contact</Table.Column>
                    <Table.Column>Rôle</Table.Column>
                    <Table.Column>Statut</Table.Column>
                    <Table.Column>Créé le</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {filtered.map((u) => {
                      const roleMeta =
                        (u.role && ROLE_LABELS[u.role as keyof typeof ROLE_LABELS]) ||
                        { label: u.role ?? "—", color: "bg-gray-100 text-gray-600" }
                      return (
                        <Table.Row key={u.id} className={u.status === "inactive" ? "opacity-60" : ""}>
                          <Table.Cell>
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="w-10 h-10 ring-2 ring-[#2d2d83]/10 shrink-0">
                                {u.photo ? <Avatar.Image src={u.photo} alt={u.fullname ?? ""} /> : null}
                                <Avatar.Fallback className="bg-[#2d2d83] text-white text-sm font-semibold">
                                  {u.fullname?.charAt(0).toUpperCase() || "?"}
                                </Avatar.Fallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-[#2d2d83] truncate">
                                  {u.fullname || <span className="text-gray-400 italic">Sans nom</span>}
                                </p>
                              </div>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="text-sm">
                              {u.email && <p className="text-gray-700 truncate">{u.email}</p>}
                              {u.phone && <p className="text-gray-500 text-xs">{u.phone}</p>}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <Chip variant="soft" size="sm" className={roleMeta.color}>
                              {roleMeta.label}
                            </Chip>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center gap-2">
                              <Switch isSelected={u.status === "active"} onChange={() => toggleStatus(u)}>
                                <Switch.Control>
                                  <Switch.Thumb />
                                </Switch.Control>
                              </Switch>
                              <Chip
                                variant="soft"
                                color={u.status === "active" ? "success" : "danger"}
                                size="sm"
                              >
                                {u.status === "active" ? "Actif" : "Désactivé"}
                              </Chip>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <span className="text-sm text-gray-500">{formatDateFR(u.created_at)}</span>
                          </Table.Cell>
                          <Table.Cell>
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
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card.Content>
        </Card>
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
            {/* Photo via composant projet uniforme */}
            <ImageUploadField
              initialImageUrl={editing?.photo ?? null}
              onChange={setPhotoFile}
              title="Photo de profil"
              height={140}
            />

            {/* Nom */}
            <TextField value={form.fullname} onChange={(v) => setForm((f) => ({ ...f, fullname: v }))} isRequired>
              <Label>Nom complet</Label>
              <Input placeholder="Père Jean Dupont" />
            </TextField>

            <div className="grid grid-cols-2 gap-3">
              <TextField value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} type="email">
                <Label>Email</Label>
                <Input placeholder="user@example.com" />
              </TextField>
              <TextField value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} type="tel" isRequired>
                <Label>Téléphone</Label>
                <Input placeholder="+225 07 00 00 00 00" />
              </TextField>
            </div>

            <TextField value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} type="password">
              <Label className="inline-flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                Mot de passe {editing && <span className="text-gray-400 text-xs font-normal">(vide = inchangé)</span>}
              </Label>
              <Input placeholder={editing ? "••••••" : "Minimum 6 caractères"} />
            </TextField>

            <div className="grid grid-cols-2 gap-3">
              <Select
                selectedKey={form.role}
                onSelectionChange={(k) => setForm((f) => ({ ...f, role: String(k) as IUserRole }))}
              >
                <Label>Rôle</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="admin" textValue="Administrateur">Administrateur</ListBox.Item>
                    <ListBox.Item id="priest" textValue="Prêtre">Prêtre</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              <Select
                selectedKey={form.status}
                onSelectionChange={(k) => setForm((f) => ({ ...f, status: String(k) as IUserStatus }))}
              >
                <Label>Statut</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="active" textValue="Actif">Actif</ListBox.Item>
                    <ListBox.Item id="inactive" textValue="Désactivé">Désactivé</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <Button
              variant="primary"
              isDisabled={saving}
              onPress={save}
              className="w-full bg-[#98141f] rounded-xl py-3 font-medium"
            >
              {saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer le compte"}
            </Button>
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
            <strong>{toDelete?.fullname}</strong> n&apos;aura plus accès au tableau de bord.
            Cette action est réversible (soft delete).
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
