module.exports = (db, Delivery, Gallon, Vehicle) => {
  return {
    finishDelivery: async ({ delivery_id, admin }) => {
      const session = await db.startSession();
      try {
        session.startTransaction();
        const filter = {
          admin: admin,
          _id: delivery_id,
        };
        const update = {
          $set: { returned: true },
        };
        const data = await Delivery.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        }).exec();

        const delivery = await Delivery.findOne({ _id: delivery_id })
          .select(["delivery_items", "vehicle"])
          .exec();
        if (!delivery?.delivery_items) {
          throw new Error("No delivery was found; please try again.");
        } else {
          const returnUndeliveredGallon = delivery?.delivery_items?.map(
            (item) => {
              return {
                updateOne: {
                  filter: {
                    _id: item?.gallon,
                  },
                  update: {
                    $inc: {
                      total: item?.total,
                    },
                  },
                },
              };
            }
          );
          await Gallon.bulkWrite(returnUndeliveredGallon);
          await Vehicle.findOneAndUpdate(
            { _id: delivery?.vehicle },
            {
              $set: {
                available: true,
              },
            }
          );
        }
        session.endSession();
        return { data: data?._id, success: true };
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("error", error);
        return { error };
      }
    },
  };
};
