"use client";

import { Button } from "@heroui/react";
import { CalendarClock, MapPin, ArrowLeft, Share2, Clock } from "lucide-react";
import Image from "next/image";
import { NewsItemType } from "@/features/actualite/types/actualite.type";

interface ActualiteDetailProps {
  actualite: NewsItemType;
  onBack: () => void;
}

export default function ActualiteDetail({ actualite, onBack }: ActualiteDetailProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: actualite.title,
          text: actualite.new_resume ?? actualite.title,
          url: window.location.href,
        });
      } catch (err) {
      
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onPress={onBack}
              className="flex items-center gap-2 text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux actualités
            </Button>
            <Button
              variant="ghost"
              onPress={handleShare}
              className="flex items-center gap-2 text-gray-700"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Image principale */}
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] -mx-4 md:-mx-8 lg:-mx-12 rounded-none overflow-hidden mb-8">
          <Image
            src={actualite.image || "/assets/images/default-actualite.jpg"}
            alt={actualite.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Titre et métadonnées */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-6">
            {actualite.title}
          </h1>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-blue-600" />
              <span>{actualite.published_at || "Date non spécifiée"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{actualite.location || "Lieu non spécifié"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Publié récemment</span>
            </div>
          </div>

          {/* Catégorie/Statut */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              actualite.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {actualite.status === 'published' ? 'Publié' : 'Brouillon'}
            </span>
          </div>
        </div>

        {/* Contenu de l'actualité */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            {/* Résumé */}
            <div className="text-gray-700 text-lg leading-relaxed mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              {actualite.new_resume}
            </div>

            {/* Contenu complet */}
            <div className="text-gray-800 leading-relaxed">
              {actualite.content ? (
                <div dangerouslySetInnerHTML={{ __html: actualite.content }} />
              ) : (
                <p className="text-gray-600">
                  Le contenu complet de cette actualité sera bientôt disponible.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onPress={onBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux actualités
              </Button>
              <Button
                onPress={handleShare}
                variant="primary"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager l'article
              </Button>
            </div>
          </div>
        </div>

        {/* Articles similaires (placeholder) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Articles similaires</h2>
          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <p className="text-gray-600">
              D'autres articles similaires seront bientôt disponibles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
