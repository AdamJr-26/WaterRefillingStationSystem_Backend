module.exports = (db, Borrow, ReturnGallonReceipt) => {
  return {
    returnBorrowedGallon: async ({ admin, borrow_id, payload , gallon_id}) => {
      const session = await db.startSession();
      
      try {
        session.startTransaction();

        const borrow = await Borrow.findOneAndUpdate(
          {
            _id: borrow_id,
            total: { $gte: Math.floor(payload?.gallonToReturn) },
          },
          {
            $inc: { total: -Math.floor(Number(payload?.gallonToReturn)) },
          },
          { returnOriginal: false }
        )
          .select(["customer", "_id", "gallon"])
          .exec();

        if (!borrow) {
           new Error("Borrow gallons was not found; please try again.");
        } else {
          const receipt = new ReturnGallonReceipt({
            admin: admin,
            customer: borrow?.customer,
            borrow: borrow?._id,
            total_returned: payload?.gallonToReturn,
            gallon: gallon_id,
          });
          await receipt.save((error) => {
            if (error)
               new Error("Something went wrong, please try again.");
          });
          session.endSession();
          return { data: receipt };
        }
      } catch (error) {
        console.log("errorerror", error);
        await session.abortTransaction();
        session.endSession();
        return { error };
      }
    },
  };
};
