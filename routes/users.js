const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { isAuth } = require("../service/auth");
const { checkUserId } = require("../service/checkId");
const passport = require("passport");

router.post("/sign_in", function (req, res, next) {
  usersController.signIn(req, res, next);
});

router.post("/sign_up", function (req, res, next) {
  usersController.signUp(req, res, next);
});

router.get("/profile", isAuth, function (req, res, next) {
  usersController.getProfile(req, res, next);
});

router.get("/following", isAuth, function (req, res, next) {
  usersController.getFollowing(req, res, next);
});

router.get("/profile/:id", isAuth, checkUserId, function (req, res, next) {
  usersController.getProfileById(req, res, next);
});

router.post("/updatePassword", isAuth, function (req, res, next) {
  usersController.updatePassword(req, res, next);
});

router.patch("/updateProfile", isAuth, function (req, res, next) {
  usersController.updateProfile(req, res, next);
});

router.post("/:id/follow", isAuth, checkUserId, function (req, res, next) {
  usersController.postFollow(req, res, next);
});

router.delete("/:id/follow", isAuth, checkUserId, function (req, res, next) {
  usersController.deleteFollow(req, res, next);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.PAGE_URL}sign-in?error=login-fail`,
  }),
  function (req, res, next) {
    usersController.getGoogleData(req, res, next);
  }
);

module.exports = router;
