module.exports = (Admin) => {
  return {
    getAllNearbyStation: async ({ position }) => {
      try {
        const pipeline = [
         
          {
            $geoNear: {
              near: position,
              distanceField: "dist.calculated",
              maxDistance: 10000,
              includeLocs: "dist.location",
              spherical: true,
            },
          },
          {
            $project: {
              dist: 1,
              address: 1,
              wrs_name: 1,
              display_photo: 1,
            },
          },
        ];
        const data = await Admin.aggregate(pipeline);
        console.log("stations->>>>>>>>>.", data);
        return data;
      } catch (error) {
        console.log("error->>>>>>>>>.", error);
        throw error;
      }
    },
  };
};
