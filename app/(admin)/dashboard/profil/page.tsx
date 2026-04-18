"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, Button, Avatar, Chip, TextField, Input, Label } from "@heroui/react"
import { Save, KeyRound } from "lucide-react"
import { Header } from "@/components/admin/header"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { userAPI } from "@/features/user/apis/user.api"
import { ROLE_LABELS, type IUser } from "@/features/user/types/user.type"

export default function ProfilPage() {
  const [me, setMe] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  useEffect(() => {
    userAPI
      .obtenirMoi()
      .then((res) => {
        const u = res.data
        setMe(u)
        setFullname(u.fullname ?? "")
        setEmail(u.email ?? "")
        setPhone(u.phone ?? "")
      })
      .catch(() => toast.error("Impossible de charger votre profil"))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!fullname.trim() || !phone.trim()) {
      toast.error("Nom et téléphone sont obligatoires.")
      return
    }
    if (password && password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("fullname", fullname)
      if (email) fd.append("email", email)
      fd.append("phone", phone)
      if (password) fd.append("password", password)
      if (photoFile) fd.append("photo", photoFile)

      const res = await userAPI.modifierMoi(fd)
      setMe(res.data)
      setPassword("")
      setConfirmPassword("")
      setPhotoFile(null)
      toast.success("Profil mis à jour")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Mon profil" />
        <p className="text-center text-gray-400 py-12">Chargement...</p>
      </div>
    )
  }

  if (!me) {
    return (
      <div>
        <Header title="Mon profil" />
        <p className="text-center text-gray-500 py-12">Profil indisponible.</p>
      </div>
    )
  }

  const roleMeta = (me.role && ROLE_LABELS[me.role as keyof typeof ROLE_LABELS]) || null

  return (
    <div>
      <Header title="Mon profil" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-5">
          <Card>
            <Card.Content className="p-6 text-center">
              <Avatar className="w-28 h-28 mx-auto mb-4 ring-4 ring-[#2d2d83]/10">
                {me.photo ? <Avatar.Image src={me.photo} alt={me.fullname ?? ""} /> : null}
                <Avatar.Fallback className="bg-[#2d2d83] text-white text-2xl font-semibold">
                  {me.fullname?.charAt(0).toUpperCase() || "?"}
                </Avatar.Fallback>
              </Avatar>
              <h2 className="text-lg font-bold text-[#2d2d83]">{me.fullname}</h2>
              <p className="text-sm text-gray-500 mt-1">{me.email}</p>
              {roleMeta && (
                <Chip variant="soft" size="sm" className={`mt-3 ${roleMeta.color}`}>
                  {roleMeta.label}
                </Chip>
              )}
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <ImageUploadField
                initialImageUrl={me.photo ?? null}
                onChange={setPhotoFile}
                title="Photo de profil"
                height={140}
              />
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-base font-semibold text-[#2d2d83]">
                Informations personnelles
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <TextField value={fullname} onChange={setFullname} isRequired>
                <Label>Nom complet</Label>
                <Input />
              </TextField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField value={email} onChange={setEmail} type="email">
                  <Label>Email</Label>
                  <Input />
                </TextField>
                <TextField value={phone} onChange={setPhone} type="tel" isRequired>
                  <Label>Téléphone</Label>
                  <Input />
                </TextField>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header className="px-6 pt-6 pb-3">
              <Card.Title className="text-base font-semibold text-[#2d2d83] flex items-center gap-2">
                <KeyRound className="w-4 h-4" /> Sécurité
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 pt-0 space-y-5">
              <p className="text-xs text-gray-500">
                Laissez ces champs vides pour conserver votre mot de passe actuel.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField value={password} onChange={setPassword} type="password">
                  <Label>Nouveau mot de passe</Label>
                  <Input placeholder="Minimum 6 caractères" />
                </TextField>
                <TextField value={confirmPassword} onChange={setConfirmPassword} type="password">
                  <Label>Confirmer</Label>
                  <Input placeholder="Répétez le mot de passe" />
                </TextField>
              </div>
            </Card.Content>
          </Card>

          <div className="flex justify-end">
            <Button variant="primary" isDisabled={saving} onPress={save} className="bg-[#98141f] rounded-xl">
              <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
