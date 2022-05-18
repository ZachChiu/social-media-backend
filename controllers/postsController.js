const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const successHandle = require("../server/successHandle");
const errorHandle = require("../server/errorHandle");
const handleErrorAsync = require("../server/handleErrorAsync");

const _ = require("lodash");

const postController = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    const timeSort =
      req?.query?.timeSort === "asc" ? "createdAt" : "-createdAt";

    const findBySearchContent =
      req?.query?.content != null
        ? { content: new RegExp(req?.query?.content) }
        : {};

    const posts = await Post.find(findBySearchContent)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(timeSort);
    successHandle(res, posts);
  }),

  getPost: handleErrorAsync(async (req, res, next) => {
    const id = req?.params?.id;

    if (id == null) {
      return next(errorHandle(400, "id 有誤", next));
    }
    Post.findById(id, function (err, post) {
      if (err || post == null) {
        return next(errorHandle(400, "id 有誤", next));
      } else {
        successHandle(res, post);
      }
    });
  }),

  createPost: handleErrorAsync(async (req, res, next) => {
    const { user, content, image } = req?.body;
    if (!user || !content) {
      return next(errorHandle(400, "欄位未正確填寫", next));
    }
    Post.findById(user, async function (err, post) {
      if (err) {
        return next(errorHandle(400, "使用者 id 有誤", next));
      } else {
        const createData = { user, content, image };
        const post = await Post.create(createData);
        successHandle(res, post);
      }
    });
  }),

  deletePosts: handleErrorAsync(async (req, res, next) => {
    await Post.deleteMany({});
    successHandle(res, []);
  }),

  deletePost: handleErrorAsync(async (req, res, next) => {
    const id = req?.params?.id;
    if (id == null) {
      return next(errorHandle(400, "id 有誤", next));
    }

    Post.findByIdAndDelete(id, function (err, post) {
      if (err) {
        return next(errorHandle(400, "id 有誤", next));
      } else {
        successHandle(res, post);
      }
    });
  }),

  updatePost: handleErrorAsync(async (req, res, next) => {
    const id = req?.params?.id;
    const { content, image } = req?.body;

    if (id == null) {
      return next(errorHandle(400, "id 有誤", next));
    }

    if (!content) {
      return next(errorHandle(400, "欄位未正確填寫", next));
    }

    Post.findById(id, async function (err, originPost) {
      if (err) {
        return next(errorHandle(400, "id 有誤", next));
      } else {
        const differentData = { content, image };
        _.omitBy({ content }, (value, key) => originPost[key] === value);
        const post = await Post.findByIdAndUpdate(id, differentData, {
          new: true,
        });
        successHandle(res, post);
      }
    });
  }),
};

module.exports = postController;
