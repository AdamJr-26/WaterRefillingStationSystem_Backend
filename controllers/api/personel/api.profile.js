module.exports = (query, mutation, responseUtil, uploadImage) => {
  return {
    getPersonelProfile: async (req, res) => {
      console.log("get profile p[ersonel req.user", req.user);
      const userGmail = req.user?.gmail;
      const personel = await query.getProfile({ gmail: userGmail });
      if (personel?.data && !personel.error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "delivery personel profile",
          "success",
          personel.data,
          "personel_profile"
        );
      } else {
        console.log("personel.error", personel.error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "delivery personel profile ERROR",
          "Something went wrong, please try again.",
          "personel_profile"
        );
      }
    },
    updatePersonelProfilePicture: async (req, res) => {
      const personel_id = req.user?._id;
      const { image } = req.body;
      const file = JSON.parse(image);
      if (file) {
        // upload image
        // update display photo in mongodb database.
        // delete image from cloudinary after success of changing prfile
        const cloudinary = await uploadImage(
          {
            root: "user-storage/profile/personels",
            userFolder: personel_id,
          },
          [file]
        );
        console.log("cloudinary", cloudinary);

        const display_photo = cloudinary.uploadResults[0].url;
        console.log("display_photodisplay_photo", display_photo);
        if (display_photo) {
          const { data, error } = await mutation.updatePersonelProfilePicture({
            personel_id,
            display_photo,
            cloudinary: cloudinary.uploadResults[0],
          });
          // console.log("data", data);
          if (data && !error) {
            responseUtil.generateServerResponse(
              res,
              200,
              "success",
              "Display photo changed",
              data,
              "change_profile_picture"
            );
          } else {
            responseUtil.generateServerErrorCode(
              res,
              400,
              "Error",
              "Oops something went wrong, please try again",
              "change_profile_picture"
            );
          }
        } else {
          // error uploading image.
        }
      }
    },
  };
};
