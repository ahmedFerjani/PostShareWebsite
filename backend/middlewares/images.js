const multer = require("multer");

// Adding Serer side image upload (store image and validate it), will be used as a middleware
// for every request where we use images
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/npg": "jpg"
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    /*const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("incalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); */
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("_");
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "_" + Date(Date.now()).toString() + "." + extension);
  }
});

module.exports = multer({ storage: storage }).single("image");
