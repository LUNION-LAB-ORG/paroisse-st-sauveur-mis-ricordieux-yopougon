export const OrganisationAPI = {
  create: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/organisations`,
    method: "POST",
  },
  getAll: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/organisations`,
    method: "GET",
  },
  delete: {
    endpoint: (id: string) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/organisations/${id}`,
    method: "DELETE",
  },
  update: {
    endpoint: (id: string) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/organisations/${id}`,
    method: "PUT", // ou PATCH selon ton backend
  },
};
