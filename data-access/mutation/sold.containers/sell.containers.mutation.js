module.exports = (SoldContainer) => {
  return {
    sellContainer: async ({ fields, admin }) => {
      try {
        const data = new SoldContainer({ ...fields, admin });
        await data.save();
        return data;
      } catch (error) {
        console.log("[SELL.CONTAINER.MUTATION.JS:sellContainer]", error);
        throw error;
      }
    },
  };
};
