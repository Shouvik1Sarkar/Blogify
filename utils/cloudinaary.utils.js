import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});
//////////////////////////
// Uploads an image file//
//////////////////////////
const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    // resource_type: "auto", // this is when i want to use both image and videos
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    fs.unlinkSync(imagePath);
    // console.log("xxxxxxxxxxxxx", imagePath);
    // console.log("xxxxxxxxxxxxx", result);
    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(imagePath);
    console.error(error);
  }
};

export default uploadImage;
