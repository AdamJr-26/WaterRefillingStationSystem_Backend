module.exports = (Discount) => {
  return {
    getDiscountsByGetFree: async (admin) => {
      try {
        const data = await Discount.find({
          admin: admin,
          "get_free.name": "get-free",
        }).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
