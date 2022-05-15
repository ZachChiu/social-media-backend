const Users = require("../models/usersModel");
const handleErrorAsync = require("./handleErrorAsync");
const successHandle = require("./successHandle");

const errorHandle = require("./errorHandle");
const jwt = require("jsonwebtoken");

const generateJWT = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  const userData = { jwt: token, name: user.name };
  successHandle(res, userData, 201);
};

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token = req?.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return next(errorHandle(401, "尚未登入", next));
  }

  let userId = "";
  jwt.verify(token, process.env.JWT_SECRET, function (err, res) {
    if (err) {
      return next(errorHandle(401, "登入狀態已過期，請重新登入", next));
    } else {
      userId = res.id;
    }
  });

  const currentUser = await Users.findById(userId);
  req.user = currentUser;
  next();
});

module.exports = { generateJWT, isAuth };
