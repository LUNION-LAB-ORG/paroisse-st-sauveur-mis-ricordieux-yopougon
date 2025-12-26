export const NewsAPI = {
  create: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/news`,
    method: "POST",
  },
  getAll: {
    endpoint: () => `http://st-sauveur.lunion-lab.com/api/news`,
    method: "GET",
  },
  delete: {
    endpoint: (id: string) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/news/${id}`,
    method: "DELETE",
  },
  update: {
    endpoint: (id: string) =>
      `${process.env.NEXT_PUBLIC_BASE_URL}/news/${id}`,
    method: "PUT", // ou PATCH selon ton backend
  },
};
