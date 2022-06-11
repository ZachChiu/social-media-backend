const Users = require("../models/usersModel");
const successHandle = require("../service/successHandle");
const errorHandle = require("../service/errorHandle");
const handleErrorAsync = require("../service/handleErrorAsync");
const { generateJWT } = require("../service/auth");

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

    if (!name || !email || !password || !confirmPassword) {
      return next(errorHandle(400, "欄位未正確填寫", next));
    }

    const sameUser = await Users.findOne({ email }).select("+email");
    if (sameUser) {
      return next(errorHandle(400, "此帳號已被註冊", next));
    }

    if (!validator.isEmail(email)) {
      return next(errorHandle(400, "Email 格式不正確", next));
    }

    if (password !== confirmPassword) {
      return next(errorHandle(400, "密碼不一致", next));
    }

    if (!validator.isLength(name, { min: 2 })) {
      return next(errorHandle(400, "暱稱至少 2 個字元以上", next));
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return next(
        errorHandle(400, "密碼需 8 碼以上，並由大小寫英文與數字混合而成", next)
      );
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
    const currentUser = await Users.findById(req.user._id)
      .populate({
        path: "following.user",
        select: "name photo",
      })
      .populate({
        path: "followers.user",
        select: "name photo",
      });
    successHandle(res, currentUser);
  }),

  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return next(errorHandle(400, "密碼不一致", next));
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return next(errorHandle(400, "密碼格式錯誤", next));
    }

    const encryptionPassword = await bcrypt.hash(password, 12);
    const id = req.user.id;
    Users.findByIdAndUpdate(
      id,
      { password: encryptionPassword },
      function (err, user) {
        if (err) {
          return next(errorHandle(400, "更改密碼失敗", next));
        } else {
          generateJWT(user, res);
        }
      }
    );
  }),

  updateProfile: handleErrorAsync(async (req, res, next) => {
    const { name, sex, photo } = req.body;

    if (!name || !sex) {
      return next(errorHandle(400, "欄位未正確填寫", next));
    }

    if (!["male", "female", "none"].includes(sex)) {
      return next(errorHandle(400, "性別填寫錯誤", next));
    }

    const updateData = {
      name,
      sex,
      photo,
    };

    const id = req.user.id;
    Users.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
      function (err, user) {
        if (err) {
          return next(errorHandle(400, "更新使用者資訊失敗", next));
        } else {
          successHandle(res, user);
        }
      }
    );
  }),

  postFollow: handleErrorAsync(async (req, res, next) => {
    const selfUser = req.user.id;
    const followUser = req.params.id;

    if (selfUser === followUser) {
      return next(errorHandle(400, "無法追蹤自己", next));
    }

    await Users.updateOne(
      {
        _id: selfUser,
        "following.user": { $ne: followUser },
      },
      {
        $addToSet: {
          following: { user: followUser },
        },
      }
    );

    await Users.updateOne(
      {
        _id: followUser,
        "followers.user": { $ne: selfUser },
      },
      {
        $addToSet: {
          followers: { user: selfUser },
        },
      }
    );

    successHandle(res, "success");
  }),

  deleteFollow: handleErrorAsync(async (req, res, next) => {
    const selfUser = req.user.id;
    const followUser = req.params.id;

    if (selfUser === followUser) {
      return next(errorHandle(400, "無法取消追蹤自己", next));
    }

    await Users.updateOne(
      {
        _id: selfUser,
      },
      {
        $pull: {
          following: { user: followUser },
        },
      }
    );

    await Users.updateOne(
      {
        _id: followUser,
      },
      {
        $pull: {
          followers: { user: selfUser },
        },
      }
    );

    successHandle(res, "success");
  }),
};

module.exports = userController;
