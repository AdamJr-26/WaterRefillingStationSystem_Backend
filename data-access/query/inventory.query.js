module.exports = (Gallon, Vehicle) => {
  return {
    getGallons: async ({ adminId }) => {
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
  };
};
