export const EventAPI = {
  
  getAll: {
    endpoint: () => `${process.env.NEXT_PUBLIC_BASE_URL}/events`,
    method: "GET",
  },
 
};