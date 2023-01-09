const mongoose = require("mongoose");
module.exports = (Purchase) => {
  return {
    getSummaryOfDeliveryFromPurchases: async ({ delivery_id, admin }) => {
      console.log("delivery_id", delivery_id);
      try {
        const stages = [
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
              delivery: mongoose.Types.ObjectId(delivery_id),
            },
          },
          {
            $group: {
              _id: "$delivery",
              total_orders: {
                $sum: { $sum: "$items.orders" },
              },
              total_free: {
                $sum: { $sum: "$items.free" },
              },
              total_returned_gallon: {
                $sum: { $sum: "$items.return" },
              },
              total_borrowed_gallon: {
                $sum: { $sum: "$items.borrow" },
              },
              total_credited_gallon: {
                $sum: { $sum: "$items.credit" },
              },
              total_of_all_debt_payment: {
                $sum: "$debt_payment",
              },
              total_of_all_payment: {
                $sum: "$total_payment",
              },
              total_of_all_order_to_pay: {
                $sum: "$order_to_pay",
              },
            },
          },
        ];

        const data = await Purchase.aggregate(stages);
        console.log("[DATAAA]", data);
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
