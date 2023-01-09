module.exports = (db, Credit, PayCreditReceipt) => {
  return {
    payCreditPerGallon: async ({ admin, credit_id, payload }) => {
      const session = await db.startSession();
      try {
        session.startTransaction();
        const credit = await Credit.findOneAndUpdate(
          {
            _id: credit_id,
          },
          {
            $inc: { total: -Number(payload?.totalGallonToPay) },
          },
          { returnOriginal: false }
        )
          .select(["customer", "_id", "gallon"])
          .exec();
        console.log("credit", credit);
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
