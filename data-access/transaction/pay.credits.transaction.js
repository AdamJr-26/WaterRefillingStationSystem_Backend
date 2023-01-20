module.exports = (db, Credit, PayCreditReceipt) => {
  return {
    payCreditPerGallon: async ({ admin, credit_id, payload }) => {
      const session = await db.startSession();
      try {
        session.startTransaction();
        const credit = await Credit.findOneAndUpdate(
          {
            _id: credit_id,
            total: { $gte: Math.floor(payload?.totalGallonToPay) },
          },

          {
            $inc: { total: -Math.floor(Number(payload?.totalGallonToPay)) },
            $set: {
              "date.unix_timestamp": Math.floor(new Date().valueOf() / 1000),
              "date.utc_date": new Date(),
            },
          },
          { returnOriginal: false }
        )
          .select(["customer", "_id", "gallon"])
          .exec();
        if (!credit) {
          throw new Error("Cannot find customer's credit, please try again.");
        } else {
          const receipt = new PayCreditReceipt({
            admin: admin,
            customer: credit?.customer,
            credit: credit?._id,
            amount_paid: payload?.totalAmountToPay,
            gallon_count: payload?.totalGallonToPay,
          });
          await receipt.save((error) => {
            if (error)
              throw new Error("Something went wrong, please try again.");
          });
          session.endSession();
          return { data: receipt };
        }
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("error", error);
        return { error };
      }
    },
  };
};
