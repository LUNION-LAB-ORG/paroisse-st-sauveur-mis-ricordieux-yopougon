import type { ICreneau } from "@/features/horaire/types/horaire-admin.type";

import { hhmm } from "@/components/admin/contenus/dates";
import { LIBELLE_PAR_TYPE } from "@/features/horaire/types/horaire-admin.type";

/** Libellé d'une célébration : son intitulé, sinon celui de son type. */
export const libelleCreneau = (c: Pick<ICreneau, "label" | "type">) =>
  c.label?.trim() || LIBELLE_PAR_TYPE[c.type] || "Célébration";

/** « Messe du soir (18:30) » */
export const libelleCreneauHeure = (c: ICreneau) =>
  `${libelleCreneau(c)} (${hhmm(c.start_time)})`;
