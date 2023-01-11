const multer = require("multer");
const responseUtil = require("../utils/server.responses.util");

function attachmentsUpload() {
  const acceptedMimetypes = ["image/jpeg", "image/png"];
  const upload = multer({
    // limits: { fileSize: 20 * 1080 * 1080 * 1080 },
    fileFilter: (req, file, cb) => {
      if (acceptedMimetypes.includes(file.mimetype)) {
        return cb(null, true);
      } else {
        cb(null, false);
    }
    },
  });
  return upload;
}

module.exports = attachmentsUpload;
// const multer = require("multer");
// const responseUtil = require("../utils/server.responses.util");

// function attachmentsUpload() {
//   const acceptedMimetypes = ["image/jpeg", "image/png"];
//   const upload = multer({
//     fileFilter: (req,res, file, cb) => {
//       console.log("file", file);
//       console.log(file.mimetype);
//       if (acceptedMimetypes.includes(file.mimetype)) {
//         return cb(null, true);
//       } else {
//         return responseUtil.generateServerResponse(
//           res,
//           401,
//           "Eror",
//           "File format is not allowed",
//           "",
//           "upload_file_multer"
//         );
//       }
//     },
//   });
//   return upload;
// }

// module.exports = attachmentsUpload;
