const cloudinaryConfig = require("../config/cloudinary.config");
const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const path = require("path");
const parser = new DatauriParser();
cloudinary.config(cloudinaryConfig);
const { Buffer } = require("buffer");
// upload image for inventory: vehicle
//destinition: user-storage / inventory / vehicles / userEmail / vehicle_id%filename
const uploadImage = async (desitination, files) => {
  // console.log("files[0].buffer", Buffer.from(files[0].buffer, "base64"));
  // console.log("files[0].buffer", files[0].buffer);

  try {
    if (files?.length) {
      let uploadResults = [];
      let uploadPromises = [];

      files.forEach((file) => {
        const datauri = parser.format(
          path.extname(file.originalname).toString(),
          file.buffer
          // Buffer.from(file.buffer, "base64")
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
async function deleteFiles(files) {
  try {
    let deleteResults = null;
    let deletePromises = [];

    files.forEach((file) => {
      deletePromises.push(
        cloudinary.uploader
          .destroy(file.publicId, "image") // it destroys specific mimetypes which is "image"
          .then((result) => {
            deleteResults = result;
          })
          .catch((error) => {
            throw error;
          })
      );
    });

    return await Promise.all(deletePromises).then(() => {
      return deleteResults;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  uploadImage,
  deleteFiles,
};
