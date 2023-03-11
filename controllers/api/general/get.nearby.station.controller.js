module.exports = (query, responseUtil) => {
  return {
    getNearbyStation: async (req, res) => {
      try {
        const post = req.params;
        console.log("post", post);
        const position = {
          type: "Point",
          coordinates: [parseFloat(post.lng), parseFloat(post.lat)],
        };
        // const position = {
        //   type: "Point",
        //   coordinates: [parseFloat("120.4912128"), parseFloat("16.0464896")],
        // };
        const data = await query.getAllNearbyStation({ position });
        console.log("data", data);
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "Nearby Stations",
          data,
          "get_nearby_stations"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "get_nearby_stations"
        );
      }
    },
  };
};
