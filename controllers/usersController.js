const Users = require("../models/usersModel");
const successHandle = require("../server/successHandle");
const errorHandle = require("../server/errorHandle");
const handleErrorAsync = require("../server/handleErrorAsync");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const _ = require("lodash");

const generateJWT = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  const userData = { jwt: token, name: user.name };
  successHandle(res, userData, 201);
};

const userController = {
  signIn: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandle(400, "帳號或密碼不得為空", next));
    }

    if (!validator.isEmail(email)) {
      return next(errorHandle(400, "Email 格式不正確", next));
    }

    const user = await Users.findOne({ email }).select("+password");

    if (user == null) {
      return next(errorHandle(400, "此帳號尚未註冊", next));
    }

    console.log(password, user.password);
    const auth = await bcrypt.compare(password, user.password);

    console.log(auth);
    if (!auth) {
      return next(errorHandle(400, "密碼錯誤", next));
    }

    generateJWT(user, res);
  }),
  signUp: handleErrorAsync(async (req, res, next) => {
    let { name, email, password, confirmPassword } = req.body;

    // 補上找重複 EMAIL、密碼大小寫都要
    if (!name || !email || !password || !confirmPassword) {
      return next(errorHandle(400, "欄位未正確填寫", next));
    }

    if (!validator.isEmail(email)) {
      return next(errorHandle(400, "Email 格式不正確", next));
    }

    if (password !== confirmPassword) {
      return next(errorHandle(400, "密碼不一致", next));
    }

    if (
      !validator.isLength(password, {
        min: 8,
      })
    ) {
      return next(errorHandle(400, "密碼不得少於八碼", next));
    }

    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await Users.create({
      name,
      email,
      password: password,
    });

    generateJWT(newUser, res);
  }),
};

module.exports = userController;
