const mongoose = require("mongoose");
module.exports = (Expense, startOfMonth, endOfMonth) => {
  return {
    getExpensesPaginated: async ({ page, limit, date, admin }) => {
      try {
        const options = { ...(page && limit ? { page, limit } : {}) };
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              $expr: {
                $and: [
                  {
                    $gte: [
                      "$date.unix_timestamp",
                      Math.floor(startOfMonth(new Date(date)).valueOf() / 1000),
                    ],
                  },
                  {
                    $lte: [
                      "$date.unix_timestamp",
                      Math.floor(endOfMonth(new Date(date)).valueOf() / 1000),
                    ],
                  },
                ],
              },
            },
          },
        ];
        const aggregation = Expense.aggregate(pipeline);
        const data = await Expense.aggregatePaginate(aggregation, options);
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
