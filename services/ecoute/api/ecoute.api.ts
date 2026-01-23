export const EcouteAPI = {
  create: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/ecoute`,
    method: "POST",
  },
  getAll: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/ecoute`,
    method: "GET",
  },
  delete: {
    endpoint: (id: string) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/ecoute/${id}`,
    method: "DELETE",
  },
  update: {
    endpoint: (id: string) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/ecoute/${id}`,
    method: "PUT",
  },
};
