module.exports = (stationModel) => {
  return {
    getAdminGmailIfExisting: async (gmail) => {
      try {
        const email = await stationModel
          .find({ "admin.gmail": gmail })
          .select(["admin.gmail"])
          .exec();

        return email
      } catch (err) {
        console.log(err)
        return [];
      }
    },
  };
};
