module.exports = (Gallon, Vehicle) => {
  return {
    addGallon: async (payload, id) => {
      // id is the id of admin who has authorized
      try {
        const gallon = new Gallon({ ...payload, admin: id });
        await gallon.save((err) => {
          if (err) {
            throw new Error(`[Add Gallon] ${err}`);
          }
        });
        return { data: gallon };
      } catch (error) {
        return { error };
      }
    },
    addVehicle: async (payload, id) => {
      try {
        const vehicle = new Vehicle({ ...payload, admin: id });
        await vehicle.save((err) => {
          if (err) {
            throw new Error(`[Add Vehicle] ${err}`);
          }
        });
        return { data: vehicle };
      } catch (error) {
        return { error };
      }
    },
    updateGallonPrice: async ({ admin, id, price }) => {
      try {
        const filter = {
          admin: admin,
          _id: id,
        };
        const update = {
          $set: { price: price },
        };
        const data = await Gallon.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        }).exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    updateAddCountGallon: async ({ admin, id, add_count }) => {
      try {
        const filter = {
          admin: admin,
          _id: id,
        };
        const update = {
          $inc: { total: add_count },
        };
        const data = await Gallon.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        });
        return { data };
      } catch (error) {
        return { error };
      }
    },
    updateReduceCountGallon: async ({ admin, id, reduce_count }) => {
      try {
        const filter = {
          admin: admin,
          _id: id,
        };
        const update = {
          $inc: { total: -reduce_count },
        };
        const data = await Gallon.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        });
        return { data };
      } catch (error) {
        return { error };
      }
    },
    updateContainerPrice: async ({ admin, id, containerPrice }) => {
      try {
        const filter = {
          admin: admin,
          _id: id,
        };
        const update = {
          $set: { containerPrice: containerPrice },
        };
        const data = await Gallon.findOneAndUpdate(filter, update, {
          returnOriginal: false,
        });
        return { data };
      } catch (error) {
        return { error };
      }
    },
  };
};
