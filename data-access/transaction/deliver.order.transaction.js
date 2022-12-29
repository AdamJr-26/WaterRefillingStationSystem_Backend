module.exports = (db, Delivery, Borrow, Credit, Purchase, Gallon, Schedule) => {
  return {
    deliverOrderTransaction: async ({ purchase }) => {
      // includes transaction, session
      const session = await db.startSession();
      try {
        session.startTransaction();
        const items = purchase?.items; // list of gallons/items
        const admin = purchase?.admin; // admin id
        const customer = purchase?.customer; // customer id
        const personel = purchase?.personel; // personel //
        const delivery = purchase?.delivery; // delivery id

        // update schedules by removing it.
        // const sched = await Schedule.findOneAndDelete(
        //   {
        //     admin: admin,
        //     customer: customer,
        //     _id: purchase.schedule_id,
        //   },
        //   {
        //     projection: {
        //       _id: 1,
        //     },
        //   }
        // );
        // console.log("sched", sched);
        // if (!sched) throw new Error("SCHEDULE DOESN'T EXIST");
        // // borrow

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
                gallon: item?.gallon,
              },
              update: {
                $inc: {
                  total: item?.credit || 0,
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
