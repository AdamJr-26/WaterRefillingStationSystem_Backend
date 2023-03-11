const mongoose = require("mongoose");

module.exports = (Products) => {
  return {
    getProducts: async ({ admin }) => {
      try {
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
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
        const data = await Products.aggregate(pipeline);
        return data;
      } catch (error) {
        throw error;
      }
    },
    getProductsFromCustomer: async ({ admin }) => {
      try {
        const pipeline = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
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
        const data = await Products.aggregate(pipeline);
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
