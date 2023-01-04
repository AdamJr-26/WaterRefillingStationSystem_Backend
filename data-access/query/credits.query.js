const mongoose = require("mongoose");
module.exports = (Credit) => {
  return {
    getTotalDebt: async ({ admin, customer }) => {
      try {
        const payCreditsPipelines = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              customer: mongoose.Types.ObjectId(customer),
            },
          },
          {
            $group: {
              _id: "$customer",
              total_debt: { $sum: { $multiply: ["$price", "$total"] } },
            },
          },
        ];
        const data = await Credit.aggregate(payCreditsPipelines);

        return { data };
      } catch (error) {
        return { error };
      }
    },
    getCustomerCredits: async ({ customer_id, admin_id }) => {
      try {
        const filter = {
          customer: customer_id,
          admin: admin_id,
          total: { $gt: 0 },
        };
        const data = await Credit.find(filter)
          .populate([
            {
              path: "gallon",
              model: "Gallon",
              select: "name liter gallon_image",
            },
          ])
          .exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
