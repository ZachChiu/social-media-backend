const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const isAuth = require("../server/isAuth");

router.post("/sign_in", function (req, res, next) {
  usersController.signIn(req, res, next);
});

router.post("/sign_up", function (req, res, next) {
  usersController.signUp(req, res, next);
});

router.get("/profile", isAuth, function (req, res, next) {
  usersController.getProfile(req, res, next);
});

module.exports = router;
