export type ISettingType = "text" | "textarea" | "url" | "email" | "phone" | "image" | "boolean";

export interface ISetting {
  key: string;
  value: string | null;
  type: ISettingType | string;
  label: string | null;
}

export interface ISettingsGrouped {
  [group: string]: ISetting[];
}

export interface ISettingsMap {
  [key: string]: string;
}
