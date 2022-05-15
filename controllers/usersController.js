const Users = require("../models/usersModel");
const successHandle = require("../server/successHandle");
const errorHandle = require("../server/errorHandle");
const handleErrorAsync = require("../server/handleErrorAsync");
const { generateJWT } = require("../server/auth");

const validator = require("validator");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

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

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(errorHandle(400, "密碼錯誤", next));
    }

    generateJWT(user, res);
  }),
  signUp: handleErrorAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    // todo 補上找重複 EMAIL、密碼大小寫都要
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

    const encryptionPassword = await bcrypt.hash(password, 12);
    const newUser = await Users.create({
      name,
      email,
      password: encryptionPassword,
    });

    generateJWT(newUser, res);
  }),

  getProfile: handleErrorAsync(async (req, res, next) => {
    successHandle(res, req.user);
  }),

  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

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

    const encryptionPassword = await bcrypt.hash(password, 12);
    const id = req.user.id;
    Users.findByIdAndUpdate(
      id,
      { password: encryptionPassword },
      function (err, user) {
        if (err) {
          console.log(err);
          return next(errorHandle(400, "更改密碼失敗", next));
        } else {
          generateJWT(user, res);
        }
      }
    );
  }),
};

module.exports = userController;
