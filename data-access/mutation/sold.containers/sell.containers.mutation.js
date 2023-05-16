module.exports = (SoldContainer, Gallon) => {
  return {
    sellContainer: async ({ fields, admin }) => {
      try {
        console.log("fields, admin", fields, admin);
        const data = new SoldContainer({ ...fields, admin });
        await data.save();
        // if data, then reduce the gallon quantity
        await Gallon.findOneAndUpdate({
          _id: data.gallon,
          admin: admin,
        },{
          $inc: {
            total: -parseInt(fields.quantity),
          }
        }).exec();
     
        return data;
      } catch (error) {
        console.log("[SELL.CONTAINER.MUTATION.JS:sellContainer]", error);
        throw error;
      }
    },
  };
};
