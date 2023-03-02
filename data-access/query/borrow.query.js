const mongoose = require("mongoose");
module.exports = (Borrow) => {
  return {
    getTotalOfBorrowedGallon: async ({ customer_id, admin }) => {
      try {
        const pipelines = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              customer: mongoose.Types.ObjectId(customer_id),
            },
          },
          {
            $group: {
              _id: "$customer",
              total_borrowed: { $sum: "$total" },
            },
          },
        ];
        const data = await Borrow.aggregate(pipelines);
        
        return { data };
      } catch (error) {
        
        return { error };
      }
    },
    getBorrowedGallonsByCustomer: async ({ admin_id, customer_id }) => {
      // something's goin on here.
      try {
        const filter = {
          customer: customer_id,
          admin: admin_id,
          total: { $gt: 0 },
        };
        const data = await Borrow.find(filter)
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
