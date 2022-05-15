const Users = require("../models/usersModel");
const handleErrorAsync = require("../server/handleErrorAsync");
const errorHandle = require("../server/errorHandle");
const jwt = require("jsonwebtoken");

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

module.exports = isAuth;
