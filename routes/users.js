const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { isAuth } = require("../service/auth");

router.post("/sign_in", function (req, res, next) {
  usersController.signIn(req, res, next);
});

router.post("/sign_up", function (req, res, next) {
  usersController.signUp(req, res, next);
});

router.get("/profile", isAuth, function (req, res, next) {
  usersController.getProfile(req, res, next);
});

router.post("/updatePassword", isAuth, function (req, res, next) {
  usersController.updatePassword(req, res, next);
});

router.patch("/updateProfile", isAuth, function (req, res, next) {
  usersController.updateProfile(req, res, next);
});

module.exports = router;
