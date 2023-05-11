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
    deleteDiscount: async ({ id }) => {
      try {
        const data = await Discount.findOneAndDelete({ _id: id }).exec();
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
