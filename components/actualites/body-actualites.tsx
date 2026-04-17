"use client";

import { useMemo, useState } from "react";
import { NewsItemType } from "@/features/actualite/types/actualite.type";
import CardContainer from "./card-container";
import FilterActualites from "./filterActualites";

const txt1 = "Annonces importantes";
const txt2 = "Toutes les actualités";

/**
 * Slug normalisé d'une catégorie. "Annonce", "annonce", "Annonces" → "annonce".
 */
function normalizeCategory(cat?: string | null): string {
  if (!cat) return "";
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Catégories considérées comme "annonces importantes" */
const IMPORTANT_CATEGORIES = new Set(["annonce", "annonces", "urgent", "important"]);

export default function BodyActualites({ news }: { news: NewsItemType[] }) {
  const [category, setCategory] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");

  // Catégories disponibles à partir des news réelles
  const availableCategories = useMemo(() => {
    const set = new Map<string, string>();
    for (const n of news) {
      const label = (n.category ?? "").trim();
      if (!label) continue;
      const key = normalizeCategory(label);
      if (!set.has(key)) set.set(key, label);
    }
    return Array.from(set.entries()).map(([key, label]) => ({ key, label }));
  }, [news]);

  const filtered = useMemo(() => {
    return news.filter((n) => {
      // Filtre catégorie
      if (category) {
        if (normalizeCategory(n.category) !== category) return false;
      }
      // Filtre date — comparaison au niveau du jour (YYYY-MM-DD)
      if (fromDate) {
        const pub = n.published_at ?? n.created_at;
        if (!pub) return false;
        const d = new Date(pub);
        if (isNaN(d.getTime())) return false;
        const pubDay = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (pubDay < fromDate) return false;
      }
      return true;
    });
  }, [news, category, fromDate]);

  // "Annonces importantes" = catégories importantes (parmi published seulement)
  const important = useMemo(
    () =>
      news.filter(
        (n) => n.status === "published" && IMPORTANT_CATEGORIES.has(normalizeCategory(n.category)),
      ),
    [news],
  );

  // Liste principale : uniquement publiées
  const allPublished = useMemo(() => filtered.filter((n) => n.status === "published"), [filtered]);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-20">
        {/* Filtres */}
        <div className="w-full">
          <FilterActualites
            categories={availableCategories}
            category={category}
            fromDate={fromDate}
            onCategoryChange={setCategory}
            onFromDateChange={setFromDate}
            onReset={() => {
              setCategory("");
              setFromDate("");
            }}
          />
        </div>

        {/* Annonces importantes — masquées si aucune */}
        {important.length > 0 && (
          <div>
            <h2 className="text-blue-900 text-3xl lg:text-4xl font-bold mb-8">{txt1}</h2>
            <CardContainer dataContainer={important} txt1={""} />
          </div>
        )}

        {/* Toutes les actualités */}
        <div>
          <h2 className="text-blue-900 text-3xl lg:text-4xl font-bold mb-8">{txt2}</h2>
          {allPublished.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Aucune actualité ne correspond aux filtres.</p>
          ) : (
            <CardContainer dataContainer={allPublished} txt1={""} />
          )}
        </div>
      </div>
    </section>
  );
}
