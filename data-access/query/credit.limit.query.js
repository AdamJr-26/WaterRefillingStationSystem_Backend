module.exports = (CreditLimit) => {
  return {
    getCreditLimits: async ({ admin }) => {
      try {
        const data = await CreditLimit.find({
          admin: admin,
        }).exec();
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
