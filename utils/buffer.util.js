function convertBufferToBase64({ image, name }) {
  try {
    console.log("name", name);
    // remove the 'data:image'
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    // decode the base64 to string data
    const buffer = Buffer.from(base64Data, "base64");
    // extract the file extension from the base64 string
    const ext = image.substring("data:image/".length, image.indexOf(";base64"));
    return {
      buffer: buffer,
      originalname: name,
      mimeType: `image/${ext}`,
    };
  } catch (error) {
    throw error;
  }
}
module.exports = convertBufferToBase64;
