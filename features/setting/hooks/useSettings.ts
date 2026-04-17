"use client";

import { useEffect, useState } from "react";
import { settingAPI } from "../apis/setting.api";
import type { ISettingsMap } from "../types/setting.type";

// Cache module-level pour éviter de refetch sur chaque usage
let cached: ISettingsMap | null = null;
let pending: Promise<ISettingsMap> | null = null;

async function fetchMap(): Promise<ISettingsMap> {
  if (cached) return cached;
  if (pending) return pending;
  pending = settingAPI.obtenirMap().then((res) => {
    cached = res.data ?? {};
    return cached;
  }).finally(() => {
    pending = null;
  });
  return pending;
}

/**
 * Hook léger : renvoie la map des settings (nom, adresse, tel, etc).
 * Cache module-level + fetch paresseux.
 */
export function useSettings(): { settings: ISettingsMap; loading: boolean } {
  const [settings, setSettings] = useState<ISettingsMap>(cached ?? {});
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let mounted = true;
    fetchMap()
      .then((m) => {
        if (mounted) setSettings(m);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}

/** Helper pour lire une clé avec fallback */
export function useSetting(key: string, fallback: string = ""): string {
  const { settings } = useSettings();
  return settings[key] ?? fallback;
}

/** Invalider le cache (après save depuis le dashboard) */
export function invalidateSettingsCache() {
  cached = null;
  pending = null;
}
