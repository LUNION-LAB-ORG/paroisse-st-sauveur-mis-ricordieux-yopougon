export type INotificationType =
  | "messe"
  | "listen"
  | "donation"
  | "event_register"
  | "organisation"
  | "system";

export interface INotification {
  id: number;
  type: INotificationType | string;
  icon: string | null;
  title: string;
  message: string | null;
  related_type: string | null;
  related_id: number | null;
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}
