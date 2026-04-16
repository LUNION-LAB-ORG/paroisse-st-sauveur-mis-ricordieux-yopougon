"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import ActualiteDetail from "./actualite-detail";
import { NewsItemType } from "@/features/actualite/types/actualite.type";
import { actualiteAPI } from "@/features/actualite/apis/actualite.api";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const [actualite, setActualite] = useState<NewsItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActualite = async () => {
      try {
        const { id } = await params;
        const actualiteId = parseInt(id);
        
      
        
        // Utiliser l'API actualite
        const result = await actualiteAPI.obtenirTous();

        const news = result?.data ?? [];
        const foundActualite = news.find((item: NewsItemType) => item.id === actualiteId);

        if (!foundActualite) {
          setError(`Actualité avec ID ${actualiteId} non trouvée`);
          return;
        }

 
        setActualite(foundActualite);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Erreur lors du chargement de l\'actualité');
      } finally {
        setLoading(false);
      }
    };

    fetchActualite();
  }, [params]);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'actualité...</p>
        </div>
      </div>
    );
  }

  if (error || !actualite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Actualité non trouvée</h1>
          <p className="text-gray-600 mb-6">
            {error || "L'actualité que vous recherchez n'existe pas."}
          </p>
          <button
            onClick={handleBack}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-md"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <ActualiteDetail actualite={actualite} onBack={handleBack} />;
}
