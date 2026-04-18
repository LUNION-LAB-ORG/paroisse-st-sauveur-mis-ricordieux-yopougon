"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Card, Button, Avatar, Chip } from "@heroui/react"
import { Save, Image as ImageIcon, X as XIcon, KeyRound } from "lucide-react"
import { Header } from "@/components/admin/header"
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const photoPreview = photoFile ? URL.createObjectURL(photoFile) : me.photo
  const roleMeta = me.role ? ROLE_LABELS[me.role] : null

  return (
    <div>
      <Header title="Mon profil" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <Card.Content className="p-6 text-center">
              <Avatar className="w-28 h-28 mx-auto mb-4 ring-4 ring-[#2d2d83]/10">
                {photoPreview ? <Avatar.Image src={photoPreview} alt={me.fullname} /> : null}
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

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 text-sm text-[#2d2d83] hover:underline"
                >
                  <ImageIcon className="w-4 h-4" />
                  {photoFile ? "Changer la photo" : "Modifier la photo"}
                </button>
                {photoFile && (
                  <button
                    type="button"
                    onClick={() => setPhotoFile(null)}
                    className="ml-3 inline-flex items-center gap-1 text-xs text-red-500 hover:underline"
                  >
                    <XIcon className="w-3 h-3" /> Annuler
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez le mot de passe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>
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
