export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

// ---- Objet "links" interne dans meta ----
export interface MetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

// ---- Meta pagination (Laravel-style) ----
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

// ---- Réponse finale ----
export interface ListResponse {
  data: [];
  links: PaginationLinks;
  meta: PaginationMeta;
}