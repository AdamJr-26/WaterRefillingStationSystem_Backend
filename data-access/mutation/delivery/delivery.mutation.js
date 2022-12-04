module.exports = (Delivery, db) => {
  // create delivery, update vehicle to occupied/in-use,
  return {
    createDelivery: async ({ payload }) => {
      try {
        const data = new Delivery(payload);
        await data.save((error) => {
          if (error) {
            throw new Error("Error creatinting new delivery");
          }
        });
        return { data };
      } catch (error) {
        console.log("error")
        return { error };
      }
    },
  };
};
