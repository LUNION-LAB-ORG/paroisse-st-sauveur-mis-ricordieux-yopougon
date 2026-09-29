import type { ISettingsMap } from "../types/setting.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const settingServerAPI = {
  async obtenirMap(): Promise<ISettingsMap> {
    const res = await fetchPublicOrNull<{ data: ISettingsMap }>(
      "/settings/map",
    );

    return res?.data ?? {};
  },
};
