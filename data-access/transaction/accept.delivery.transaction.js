module.exports = (db, Delivery, Gallon, Vehicle, Personel) => {
  return {
    // gallons:Array
    //

    // should include:
    // before everything changes, first we need to check if all gallons are still available.
    acceptDelivery: async ({
      delivery_personel_id,
      vehicle_id,
      delivery_id,
      gallons,
    }) => {
      const session = await db.startSession();
      try {
        session.startTransaction();
        await Vehicle.findOneAndUpdate(
          { _id: vehicle_id },
          { $set: { available: false } }
        ).exec();

        await Personel.findOneAndUpdate(
          { _id: delivery_personel_id },
          {
            $set: { status: "on-delivery" },
          }
        ).exec();

        const bulkOpsForGallon = gallons.map((gallon) => {
          return {
            updateOne: {
              filter: { _id: gallon._id },
              update: {
                $inc: {
                  total: -gallon.total,
                },
              },
            },
          };
        });
        
        await Gallon.bulkWrite(bulkOpsForGallon);
        const delivery = await Delivery.findOneAndUpdate(
          { _id: delivery_id },
          {
            $set: { approved: true },
          },
          { returnOriginal: false }
        )
          .select(["approved"])
          .exec();
        session.endSession();
        return { success: delivery.approved };
      } catch (error) {
        console.log("error session?", error);
        await session.abortTransaction();
        session.endSession();
        return { success: false, error };
      }
    },
  };
};
