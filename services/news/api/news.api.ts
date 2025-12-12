export const NewsAPI = {
  create: {
    endpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/events`,
    method: "POST",
  },
  getAll: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/news`,
    method: "GET",
  },
  getOne: {
    endpoint: (id: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/events/${id}`,
    method: "GET",
  },
  update: {
    endpoint: (id: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/events/${id}`,
    method: "PATCH",
  },
  delete: {
    endpoint: (id: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/events/${id}`,
    method: "DELETE",
  },
};