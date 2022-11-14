module.exports = (query, responseUtil) => {
  return {
    getPersonelProfile: async (req, res) => {
      const personel = await query.getProfile({gmail: "Adamcompiomarcaida@gmail.com"});
      if (personel.data && !personel.error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "delivery personel profile",
          "success",
          personel.data,
          "personel_profile"
        );
      } else {
        console.log("personel.error",personel.error)
        responseUtil.generateServerErrorCode(
          res,
          400,
          "delivery personel profile ERROR",
          "Something went wrong, please try again.",
          "personel_profile"
        );
      }
    },
  };
};
