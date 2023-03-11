const { default: mongoose } = require("mongoose");

module.exports = (Cart, Customer) => {
  return {
    addToCart: async ({ payload }) => {
      try {
        // check if customer is already subscribed.
        const isSubscribed = await Customer.findOne({ admin: payload.admin })
          .select(["_id"])
          .exec();

        if (!isSubscribed) {
          let error = new Error(
            "Cannot add to cart because the customer is not subscribed to this station."
          );
          error.name = "NotAllowed";
          throw error;
        }

        const isExist = await Cart.findOne({ gallon: payload.gallon })
          .select(["_id"])
          .exec();

        if (isExist) {
          let error = new Error("You cannot add to cart same product.");
          error.name = "DuplicateError";
          throw error;
        }

        const data = new Cart(payload);
        data.save();
        return data;
      } catch (error) {
        throw error;
      }
    },

  };
};
