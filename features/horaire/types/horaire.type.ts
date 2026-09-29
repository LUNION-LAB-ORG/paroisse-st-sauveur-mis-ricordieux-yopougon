export interface IHoraireItem {
  time: string;
  end_time: string | null;
  label: string;
  location: string | null;
  type: string;
  cancelled: boolean;
}

export interface IJourHoraire {
  date: string;
  /** 0 = dimanche … 6 = samedi */
  weekday: number;
  items: IHoraireItem[];
}

/** Changement ponctuel : célébration ajoutée, ou créneau annulé ce jour-là. */
export interface IExceptionHoraire {
  id: number;
  date: string;
  start_time: string | null;
  label: string | null;
  location: string | null;
  is_cancelled: boolean;
  time_slot_id: number | null;
}
