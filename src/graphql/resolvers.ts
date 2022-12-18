export const resolvers = {
  Query: {
    date: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return new Date();
    },
  },
};
