export const ParticipantsAPI = {
  
  create: {
    endpoint: () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      console.log('NEXT_PUBLIC_BASE_URL:', baseUrl);
      if (!baseUrl) {
        console.error('NEXT_PUBLIC_BASE_URL n\'est pas défini');
        return '/participants'; // Fallback pour le développement
      }
      return `${baseUrl}/participants`;
    },
    method: "POST",
  },
  
  getByEvent: {
    endpoint: (eventId: number) => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      console.log('NEXT_PUBLIC_BASE_URL:', baseUrl);
      if (!baseUrl) {
        console.error('NEXT_PUBLIC_BASE_URL n\'est pas défini');
        return `/participants/event/${eventId}`; // Fallback
      }
      return `${baseUrl}/participants/event/${eventId}`;
    },
    method: "GET",
  },
  
  getAll: {
    endpoint: () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      console.log('NEXT_PUBLIC_BASE_URL:', baseUrl);
      if (!baseUrl) {
        console.error('NEXT_PUBLIC_BASE_URL n\'est pas défini');
        return '/participants'; // Fallback
      }
      return `${baseUrl}/participants`;
    },
    method: "GET",
  },
  
};
