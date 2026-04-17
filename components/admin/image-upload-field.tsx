"use client";

import { useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@heroui/react";
import { toast } from "sonner";

export interface ImageUploadFieldProps {
  /** URL de l'image existante (édition) — sera utilisée comme preview initiale */
  initialImageUrl?: string | null;
  /** Callback appelé à chaque changement de fichier (null si retiré) */
  onChange: (file: File | null) => void;
  /** Taille max en Mo (défaut 5) */
  maxSizeMb?: number;
  /** Types MIME acceptés (défaut: jpg/jpeg/png/webp) */
  accept?: string;
  /** Hauteur du bloc en px (défaut: 192) */
  height?: number;
  /** Titre affiché en header du bloc */
  title?: string;
}

export function ImageUploadField({
  initialImageUrl,
  onChange,
  maxSizeMb = 5,
  accept = "image/jpeg,image/png,image/webp",
  height = 192,
  title = "Image",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (f.size > maxBytes) {
      toast.error(`Image trop lourde (max ${maxSizeMb} Mo)`);
      return;
    }
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
    onChange(f);
  };

  const handleClear = () => {
    setFileName(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[#2d2d83]/30 transition-colors cursor-pointer">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Prévisualisation"
            className="w-full object-cover"
            style={{ height }}
          />
        ) : (
          <div className="p-8 text-center" style={{ minHeight: height }}>
            <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Cliquez pour ajouter</p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WEBP (max {maxSizeMb} Mo)
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {preview && (
        <div className="flex items-center justify-between gap-2 text-xs">
          {fileName ? (
            <span className="text-gray-500 truncate flex-1">{fileName}</span>
          ) : (
            <span className="text-gray-400">Image actuelle</span>
          )}
          <Button
            variant="ghost"
            className="h-7 px-2 rounded-lg text-red-500 hover:bg-red-50"
            onPress={handleClear}
          >
            <X className="w-3.5 h-3.5" /> Retirer
          </Button>
        </div>
      )}
    </div>
  );
}
