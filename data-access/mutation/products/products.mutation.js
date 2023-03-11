module.exports = (Products) => {
  return {
    addProductToShop: async (payload) => {
      try {
        const data = new Products(payload);
        await data.save();
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
