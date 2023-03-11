const mongoose = require("mongoose");
module.exports = (Cart) => {
  return {
    getCart: async ({ customer }) => {
      try {
        const pipeline = [
          {
            $match: {
              customer: mongoose.Types.ObjectId(customer),
            },
          },
          {
            $lookup: {
              from: "gallons",
              localField: "gallon",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    liter: 1,
                    gallon_image: 1,
                  },
                },
              ],
              as: "gallon",
            },
          },
        ];
        const data = await Cart.aggregate(pipeline);
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
