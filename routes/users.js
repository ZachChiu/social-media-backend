const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.post("/sign_in", function (req, res, next) {
  usersController.signIn(req, res, next);
});

router.post("/sign_up", function (req, res, next) {
  usersController.signUp(req, res, next);
});

module.exports = router;
