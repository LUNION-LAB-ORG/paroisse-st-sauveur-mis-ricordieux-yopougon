export const IntentionsAPI = {
  create: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/messes`,
    method: "POST",
  },
  getAll: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/messes`,
    method: "GET",
  },
  delete: {
    endpoint: (id: string) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/messes/${id}`,
    method: "DELETE",
  },
  update: {
    endpoint: (id: string) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/messes/${id}`,
    method: "PUT", // ou PATCH selon ton backend
  },
};
