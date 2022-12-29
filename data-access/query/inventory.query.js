module.exports = (Gallon, Vehicle) => {
  return {
    getGallons: async ({ adminId }) => {
      // use population
      // get borrowed_gallons and get gallon:objectId ref
      // populate the gallon with object id from borrowed_gallon
      //  get borrowed count per gallon
      //
      // try {
      //   const filter = {
      //     admin: adminId,
      //   };
      //   const data = await Gallon.find(filter)
      //     .populate([
      //       {
      //         path: "borrowed.gallon",
      //         model: "BorrowedGallon", // o rGallonBorrowed?
      //         select: "total_item price_per_item ",
      //       },
      //     ])
      //     .exec();
      //   console.log("data", data);

      //   return { data };
      // } catch (error) {}
      try {
        const filter = {
          admin: adminId,
        };
        const data = await Gallon.find(filter).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getAvailableGallons: async ({ adminId }) => {
      try {
        const filter = {
          admin: adminId,
          total: { $gt: 0 },
        };
        const data = await Gallon.find(filter).select(["-borrowed"]).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getGallon: async ({ admin, id }) => {
      try {
        const filter = {
          admin: admin,
          _id: id,
        };
        const data = await Gallon.findOne(filter).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getAvailableVehicles: async ({ adminId }) => {
      try {
        const filter = {
          admin: adminId,
          available: true,
        };
        const data = await Vehicle.find(filter).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getVehicles: async ({ adminId }) => {
      try {
        const filter = {
          admin: adminId,
        };
        const data = await Vehicle.find(filter).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    checkIfAllGallonsAreAvailable: async ({ // not used/ still have bug
      admin,
      ArrayOfId,
      selected,
      ArrayOfTotal,
    }) => {
      try {
        console.log("ArrayOfId", ArrayOfId);
        console.log("ArrayOfTotal", ArrayOfTotal);

        const filter = {
          admin: admin,
          _id: ArrayOfId,
          total: {$gte: ArrayOfTotal},
        };
        
        const data = await Gallon.find(filter).select(selected).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
