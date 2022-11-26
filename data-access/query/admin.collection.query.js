module.exports = (Admin) => {
  return {
    checkAdminIfNotVerified: async (id) => {
      try {
        const admin = await Admin
          .findOne({ _id: id, verified: true })
          .select(["gmail", "verify"])
          .exec();
        return { data: admin };
      } catch (error) {
        return { error };
      }
    },
    isAdminExistAndVerified: async ({ gmail, password }) => {
      try {
        const data = await Admin
          .findOne({ "gmail": gmail, "verify": true })
          .exec();
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getAdminGmailIfExisting: async (gmail) => {
      try {
        const email = await Admin
          .findOne({ "gmail": gmail })
          .select(["gmail"])
          .exec();

        return { email };
      } catch (err) {
        console.log(err);
        return { err };
      }
    },
    getStationByID: async (id) => {
      try {
        const station = await Admin
          .findOne({ "stations.admin.station_id": id })
          .exec();

        return { success: true, station };
      } catch (err) {
        return { success: false, err, station };
      }
    },
  };
};
