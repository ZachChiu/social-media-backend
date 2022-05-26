const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController.js");
const { isAuth } = require("../service/auth");
const upload = require("../service/image.js");

router.post("/", isAuth, upload, function (req, res, next) {
  uploadController.uploadImage(req, res, next);
});

module.exports = router;
