module.exports = (Discount) => {
  return {
    createDiscount: async ({ payload }) => {
      try {
        const data = await new Discount(payload);
        await data.save((error) => {
          if (error) throw new Error(error);
        });
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
