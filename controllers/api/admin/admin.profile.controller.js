module.exports =(query, responseUtil)=>{
    return {
        getAdminProfile: async (req, res) => {
           console.log("res.user getting admin profile", req.user)
           const gmail = req.user?.gmail;
            const admin = await query.getAdminProfile(gmail);
            if (admin?.data && !admin.error) {
              responseUtil.generateServerResponse(
                res,
                200,
                "delivery admin profile",
                "success",
                admin.data,
                "admin_profile"
              );
            } else {
              console.log("admin.error",admin.error)
              responseUtil.generateServerErrorCode(
                res,
                400,
                "delivery admin profile ERROR",
                "Something went wrong, please try again.",
                "admin_profile"
              );
            }
          },
    }
}