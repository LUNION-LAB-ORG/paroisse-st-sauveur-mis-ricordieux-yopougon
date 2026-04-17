/**
 * Utilitaires pour calculer les tendances (mois courant vs mois précédent).
 * Renvoie un objet prêt à brancher sur <StatCard trend={...} trendUp={...} />.
 */

/** Vérifie si une date ISO tombe sur un mois/année donné */
function isInMonth(iso: string | null | undefined, year: number, month: number): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return false;
  return d.getFullYear() === year && d.getMonth() === month;
}

export interface TrendResult {
  /** Pourcentage au format "12%", "NEW", ou null si non pertinent */
  trend: string | null;
  /** true si en hausse, false si en baisse */
  trendUp: boolean;
}

/**
 * Calcule la tendance en comparant 2 nombres (courant vs précédent).
 * - previous = 0 && current > 0 → "NEW"
 * - previous = 0 && current = 0 → null (rien)
 * - Sinon → pourcentage arrondi
 */
export function computeTrend(current: number, previous: number): TrendResult {
  if (previous === 0 && current === 0) return { trend: null, trendUp: true };
  if (previous === 0) return { trend: "NEW", trendUp: true };
  const diff = current - previous;
  const pct = Math.round((diff / previous) * 100);
  return {
    trend: `${Math.abs(pct)}%`,
    trendUp: diff >= 0,
  };
}

/**
 * Compte les items dont la date (dateField) tombe sur le mois courant et le mois précédent,
 * puis renvoie la tendance.
 */
export function trendFromItemsByDate<T extends Record<string, unknown>>(
  items: T[],
  dateField: keyof T,
): TrendResult {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prev = new Date(currentYear, currentMonth - 1, 1);
  const prevMonth = prev.getMonth();
  const prevYear = prev.getFullYear();

  let currentCount = 0;
  let previousCount = 0;
  for (const item of items) {
    const iso = item[dateField] as string | null | undefined;
    if (isInMonth(iso, currentYear, currentMonth)) currentCount++;
    else if (isInMonth(iso, prevYear, prevMonth)) previousCount++;
  }

  return computeTrend(currentCount, previousCount);
}

/**
 * Somme les valeurs d'un champ (amountField) pour les items du mois courant et précédent,
 * puis renvoie la tendance.
 */
export function trendFromItemsByDateSum<T extends Record<string, unknown>>(
  items: T[],
  dateField: keyof T,
  amountField: keyof T,
): TrendResult {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prev = new Date(currentYear, currentMonth - 1, 1);
  const prevMonth = prev.getMonth();
  const prevYear = prev.getFullYear();

  let currentSum = 0;
  let previousSum = 0;
  for (const item of items) {
    const iso = item[dateField] as string | null | undefined;
    const amount = Number(item[amountField] ?? 0);
    if (isInMonth(iso, currentYear, currentMonth)) currentSum += amount;
    else if (isInMonth(iso, prevYear, prevMonth)) previousSum += amount;
  }

  return computeTrend(currentSum, previousSum);
}
