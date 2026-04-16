export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IActionResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
