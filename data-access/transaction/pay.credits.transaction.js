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
          new Error("Cannot find customer's credit, please try again.");
          session.endSession();
          return { data: null };
        } else {
          
          const receipt = new PayCreditReceipt({
            admin: admin,
            customer: credit?.customer,
            credit: credit?._id,
            gallon: payload?.gallon_id,
            amount_paid: payload?.totalAmountToPay,
            gallon_count: payload?.totalGallonToPay,
          });
          // add personnel id
          await receipt.save((error) => {
            if (error) new Error("Something went wrong, please try again.");
          });
          console.log("receipt", receipt);
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
