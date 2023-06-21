module.exports = (CreditLimit) => {
  return {
    createCreditLimit: async ({ admin, payload }) => {
      try {
        const data = new CreditLimit({ admin, ...payload });
        await data.save();
        return data;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    deleteCreditLimit: async ({ admin, creditId }) => {
      try {
        const data = await CreditLimit.findOneAndDelete({
          admin: admin,
          _id: creditId,
        }).exec();
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
