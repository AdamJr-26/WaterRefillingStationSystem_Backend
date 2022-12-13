module.exports = (query, getAdminId, responseUtil)=>{
    return {
        getAvailableGallons: async (req, res) => {
            const adminId = getAdminId(req);
            const { data, error } = await query.getAvailableGallons({
              adminId,
            });
            if (data && !error) {
              responseUtil.generateServerResponse(
                res,
                201,
                "success",
                "fetching gallon",
                data,
                "get_gallons"
              );
            } else {
              responseUtil.generateServerErrorCode(
                res,
                400,
                "Error",
                "Oops something went wrong, please try again",
                "get_gallons"
              );
            }
          },
    }
}