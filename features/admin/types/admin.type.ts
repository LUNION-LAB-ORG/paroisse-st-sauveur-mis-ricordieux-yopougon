export type IEtatHomelie = "published" | "draft" | "scheduled" | "missing";

export interface ITableauDeBord {
  masses: { to_process: number; to_pay: number };
  donations_week: { total: number; count: number };
  comments: { pending: number; publications: number };
  listens: { pending: number };
  next_event: {
    id: number;
    slug: string;
    title: string;
    date_at: string;
    registrations: number;
    attendees: number;
    max_participants: number | null;
  } | null;
  liturgy: {
    imported_days: number;
    last_import_at: string | null;
    homily_today: IEtatHomelie;
    homily_tomorrow: IEtatHomelie;
  };
  church_project: {
    progress: number;
    collected_amount: number;
    goal_amount: number;
    current_phase: string | null;
  };
  today_masses: {
    time_slot_id: number;
    time: string;
    label: string;
    intentions: number;
    confidential: number;
  }[];
  tasks: { key: string; label: string; href: string }[];
}

export interface IActivite {
  id: number;
  description: string;
  user: { id: number; name: string } | null;
  created_at: string;
}

export interface IIntegration {
  key: "aelf" | "whatsapp" | "youtube" | "maps" | "payment";
  status: "connected" | "error" | "not_configured";
  detail?: string | null;
}

export type IRessourceOrdonnable =
  | "services"
  | "priests"
  | "history-milestones"
  | "announcements"
  | "councils";
