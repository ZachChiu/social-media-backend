const multer = require("multer");
const path = require("path");
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const extname = path.extname(file.originalname);
    if (![".png", ".jpg", ".jpeg"].includes(extname)) {
      cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg、png。"));
    }
    cb(null, true);
  },
}).any();

module.exports = upload;
