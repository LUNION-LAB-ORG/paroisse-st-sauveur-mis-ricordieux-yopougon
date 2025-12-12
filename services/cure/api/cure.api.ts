export const CureAPI = {
  
  getAll: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/pastors`,
    method: "GET",
  },
  
};