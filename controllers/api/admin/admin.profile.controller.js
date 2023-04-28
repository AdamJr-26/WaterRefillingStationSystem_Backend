module.exports = (
  query,
  mutation,
  responseUtil,
  convertBufferToBase64,
  getAdminId,
  uploadImage
) => {
  return {
    getAdminProfile: async (req, res) => {
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
        console.log("admin.error", admin.error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "delivery admin profile ERROR",
          "Something went wrong, please try again.",
          "admin_profile"
        );
      }
    },
    updateProfile: async (req, res) => {
      try {
        const adminId = getAdminId(req);
        const { image } = req.body;
        const file = convertBufferToBase64({ image, name: adminId });

        const cloudinary = await uploadImage(
          {
            root: "user-storage/profile/admins",
            userFolder: adminId.toString(),
          },
          [file]
        );
        console.log("cloudinary", cloudinary);
        const display_photo = cloudinary.uploadResults[0].url;
        const fields = { display_photo: display_photo };
        const data = await mutation.updateProfile({ fields, adminId });
        responseUtil.generateServerResponse(
          res,
          200,
          "Update profile successfully",
          "Update Success",
          data,
          "admin_profile"
        );
      } catch (error) {
        console.log("ErrorUpdateProfile", error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "UpdateError",
          "Update profile failed",
          "adminProfile"
        );
      }
    },
  };
};
