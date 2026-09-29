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
