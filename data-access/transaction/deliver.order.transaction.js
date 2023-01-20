const mongoose = require("mongoose");
module.exports = (db, Delivery, Borrow, Credit, Purchase, Gallon, Schedule) => {
  return {
    deliverOrderByScheduleTransaction: async ({ purchase }) => {
      // includes transaction, session
      const session = await db.startSession();
      try {
        session.startTransaction();
        const items = purchase?.items; // list of gallons/items
        const admin = purchase?.admin; // admin id
        const customer = purchase?.customer; // customer id
        const personel = purchase?.personel; // personel //
        const delivery = purchase?.delivery; // delivery id
        const debt_payment = purchase?.debt_payment; //
        const order_to_pay = purchase?.order_to_pay || 0;
        const total_payment = purchase?.total_payment;

        // console.log("order_to_pay", order_to_pay);
        console.log("purchase", purchase);

        // pay credits
        // get total of debt
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
              all_gallons: {
                $push: { gallon_id: "$gallon" },
              },
            },
          },
        ];
        const payCredit = await Credit.aggregate(payCreditsPipelines);
        const gallons = payCredit[0]?.all_gallons || [];
        // if order to pay is equal to total_payment just paying for "order to pay"
        // if total_payment is equal to order_to_pay + total_debt then create payment.
        // else throw error "cannot accept payment"
        if (
          total_payment != order_to_pay &&
          total_payment ==
            Number(payCredit[0]?.total_debt) + Number(order_to_pay)
        ) {
          const bulkOpsForPayCreditPerGallon = gallons?.map((gln) => {
            return {
              deleteOne: {
                filter: {
                  admin,
                  customer,
                  gallon: gln?.gallon_id,
                },
              },
            };
          });
          await Credit.bulkWrite(bulkOpsForPayCreditPerGallon);
        } else if (
          total_payment < order_to_pay ||
          (total_payment > order_to_pay &&
            total_payment !==
              Number(payCredit[0]?.total_debt) + Number(order_to_pay))
        ) {
          throw new Error("Cannot accept payment");
        }

        const bulksOpsForBorrow = items?.map((item) => {
          return {
            updateOne: {
              filter: {
                admin: admin,
                customer: customer,
                gallon: item?.gallon,
              },
              update: {
                $inc: {
                  total: item?.borrow || 0,
                },
              },
              upsert: true,
            },
          };
        });
        // return - mababawawasan ang borrowed and delete if zero
        const bulksOpsForReturn = items?.map((item) => {
          return {
            updateOne: {
              filter: { admin, customer, gallon: item?.gallon, },
              update: {
                $inc: { total: -item?.return || 0 },
              },
            },
          };
        });

        // credit
        const bulksOpsForCredit = items?.map((item) => {
          return {
            updateOne: {
              filter: {
                admin,
                customer,
                delivery,
                gallon: item?.gallon,
              },
              update: {
                $inc: {
                  total: item?.credit || 0,
                },
                $set: {
                  price: item?.price,
                },
              },
              upsert: true,
            },
          };
        });

        // delivery - mababawasan per gallon
        const bulksOpsForDelivery = items?.map((item) => {
          return {
            updateOne: {
              filter: {
                admin: admin,
                delivery_personel: personel,
                _id: delivery,
                approved: true,
                "delivery_items.gallon": item?.gallon,
              },
              update: {
                $inc: {
                  "delivery_items.$.total": -(
                    Number(item?.orders) + Number(item?.free)
                  ),
                },
              },
            },
          };
        });

        // update gallons  in inventory
        const bulksOpsForGallonBorrow = items?.map((item) => {
          return {
            updateOne: {
              filter: {
                _id: item?.gallon,
              },
              update: {
                $inc: {
                  total: -Number(item?.borrow) || 0,
                },
              },
            },
          };
        });
        const bulksOpsForGallonReturn = items?.map((item) => {
          return {
            updateOne: {
              filter: {
                _id: item?.gallon,
              },
              update: {
                $inc: {
                  total: item?.return || 0,
                },
              },
            },
          };
        });
        await Borrow.bulkWrite(bulksOpsForBorrow);
        await Borrow.bulkWrite(bulksOpsForReturn);
        await Gallon.bulkWrite(bulksOpsForGallonBorrow);
        await Gallon.bulkWrite(bulksOpsForGallonReturn);
        await Credit.bulkWrite(bulksOpsForCredit);
        await Delivery.bulkWrite(bulksOpsForDelivery);

        // create purchase
        const purch = await new Purchase(purchase);
        await purch.save((error) => {
          if (error) throw new Error(`[ERROR SAVING PURCHASE] ${error}`);
        });
        session.endSession();
        return { data: { success: true } };
      } catch (error) {
        console.log("[ERROR]", error);
        await session.abortTransaction();
        session.endSession();
        return { error };
      }
    },
  };
};
