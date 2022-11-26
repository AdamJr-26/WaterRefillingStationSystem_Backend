const cloudinaryConfig = require("../config/cloudinary.config");
const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const path = require("path");
const parser = new DatauriParser();
cloudinary.config(cloudinaryConfig);

// upload image for inventory: vehicle
//destinition: user-storage / inventory / vehicles / userEmail / vehicle_id%filename
const uploadImage = async (desitination, files) => {
  try {
    if (files?.length) {
      let uploadResults = [];
      let uploadPromises = [];
      files.forEach((file) => {
        const datauri = parser.format(
          path.extname(file.originalname).toString(),
          file.buffer
        );
        uploadPromises.push(
          cloudinary.uploader
            .upload(datauri.content, {
              folder: `${desitination.root}/${desitination.userFolder}`,
              resource_type: "auto",
            })
            .then((result) => {
              uploadResults.push({
                userFolder: desitination.userFolder,
                publicId: result.public_id,
                url: result.url,
                mimetype: file.mimetype,
              });
            })
            .catch((error) => {
              throw error;
            })
        );
      });
      return await Promise.all(uploadPromises).then(() => {
        return { uploadResults };
      });
    }
  } catch (error) {
    return { error };
  }
};
module.exports = {
  uploadImage,
};
