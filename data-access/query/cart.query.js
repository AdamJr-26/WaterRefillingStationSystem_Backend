const mongoose = require("mongoose");
module.exports = (Cart, Customer) => {
  return {
    getCart: async ({ customer }) => {
      try {
        // get admin id or where customer is subscribed.
        const customerData = await Customer.findOne({ _id: customer })
          .select(["admin"])
          .exec();
        const pipeline = [
          {
            $match: {
              customer: mongoose.Types.ObjectId(customer),
              admin: mongoose.Types.ObjectId(customerData?.admin),
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
        console.log("data", data);
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
