const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let filename = `${uuidv4()}.${extension}`;
    req.body.filename = filename;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
