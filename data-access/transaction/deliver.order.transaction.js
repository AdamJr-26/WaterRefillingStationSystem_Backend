const mongoose = require("mongoose");
module.exports = (
  db,
  Delivery,
  Borrow,
  Credit,
  Purchase,
  Gallon,
  Schedule,
  PayCreditReceipt,
  ReturnGallonReceipt
) => {
  return {
    deliverOrderByScheduleTransaction: async ({ purchase }) => {
      console.log("purchase=>>>>>>>>>>", purchase);
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
        const walkIn = purchase?.walkIn;
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
              _id: "$customer", // should I use $items.gallon?
              total_debt: { $sum: { $multiply: ["$price", "$total"] } },
              all_gallons: {
                $push: {
                  gallon_id: "$gallon",
                  price: "$price",
                  total: "$total",
                  credit_id: "$_id",
                },
              },
            },
          },
        ];
        const payCredit = await Credit.aggregate(payCreditsPipelines);
        const gallons = payCredit[0]?.all_gallons || [];
        // if order to pay is equal to total_payment just paying for "order to pay"
        // if total_payment is equal to order_to_pay + total_debt then create payment.
        // else throw error "cannot accept payment"
        console.log("gallons", gallons);
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
          // create credit receipt.
          gallons.forEach(async (gallon) => {
            const receipt = new PayCreditReceipt({
              admin: admin,
              customer: customer,
              credit: gallon.credit_id,
              amount_paid: gallon.total * gallon.price,
              gallon_count: gallon?.total,
              gallon: gallon.gallon_id,
            });
            await receipt.save((error) => {
              if (error) new Error("Something went wrong, please try again.");
            });
          });
        } else if (
          total_payment < order_to_pay ||
          (total_payment > order_to_pay &&
            total_payment !==
              Number(payCredit[0]?.total_debt) + Number(order_to_pay))
        ) {
          throw new Error("Cannot accept payment");
        }
        // return gallon bulkwrite options
        const bulkWriteOpsForReturnGallons = items?.map((item) => {
          return {
            updateOne: {
              filter: {
                _id: mongoose.Types.ObjectId(),
                admin: admin,
                customer: customer,
                gallon: item.gallon,
              },
              update: {
                $set: {
                  total_returned: item.return,
                },
              },
              upsert: true,
            },
          };
        });
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
              filter: { admin, customer, gallon: item?.gallon },
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
                // delivery, // I HAD TO REMOVE DELIVERY FIELD IT BECAUSE WALK IN DONT HAVE THIS ID.
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
        // const bulksOpsForGallonBorrow = items?.map((item) => {
        //   return {
        //     updateOne: {
        //       filter: {
        //         _id: item?.gallon,
        //       },
        //       update: {
        //         $inc: {
        //           total: -Number(item?.borrow) || 0,
        //         },
        //       },
        //     },
        //   };
        // });

        // const bulksOpsForGallonReturn = items?.map((item) => {
        //   return {
        //     updateOne: {
        //       filter: {
        //         _id: item?.gallon,
        //       },
        //       update: {
        //         $inc: {
        //           total: item?.return || 0,
        //         },
        //       },
        //     },
        //   };
        // });
        await Borrow.bulkWrite(bulksOpsForBorrow);
        await Borrow.bulkWrite(bulksOpsForReturn);
        // await Gallon.bulkWrite(bulksOpsForGallonBorrow);
        // await Gallon.bulkWrite(bulksOpsForGallonReturn);
        await ReturnGallonReceipt.bulkWrite(bulkWriteOpsForReturnGallons);
        await Credit.bulkWrite(bulksOpsForCredit);
        // DAHIL walk-in dapat wala mababawas sa delivery if meron man.
        if (!walkIn) {
          await Delivery.bulkWrite(bulksOpsForDelivery);
        }

        // create purchase
        const purch = await new Purchase(purchase);
        await purch.save((error) => {
          if (error) throw new Error(`[ERROR SAVING PURCHASE] ${error}`);
        });
        session.endSession();

        return { data: { success: true, purchase: purch } };
      } catch (error) {
        console.log("[ERROR]", error);
        await session.abortTransaction();
        session.endSession();
        return { error };
      }
    },
  };
};
