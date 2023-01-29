module.exports = (Expense) => {
  return {
    createNewReportExpense: async ({ admin, payload }) => {
      try {
        const data = new Expense({ ...payload, admin });
        await data.save((error) => {
          if (error) throw new Error("Sorry, something went wrong.");
        });
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
