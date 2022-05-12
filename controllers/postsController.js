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
      if (err) {
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
    } else {
      const createData = { user, content };
      if (image) {
        createData.image = image;
      }
      const post = await Post.create(createData);
      successHandle(res, post);
    }
  }),

  deletePosts: handleErrorAsync(async (req, res, next) => {
    await Post.deleteMany({});
    successHandle(res, []);
  }),

  deletePost: handleErrorAsync(async (req, res, next) => {
    const id = req?.params?.id;
    const post = await Post.findByIdAndDelete(id);

    if (id == null || post == null) {
      return next(errorHandle(400, "id 有誤", next));
    } else {
      successHandle(res, {});
    }
  }),

  updatePost: handleErrorAsync(async (req, res, next) => {
    const id = req?.params?.id;
    const { name, content } = req?.body;
    const originPost = await Post.findById(id);

    if (id == null || originPost == null) {
      return next(errorHandle(400, "id 有誤", next));
    } else if (!name || !content) {
      return next(errorHandle(400, "欄位未正確填寫", next));
    } else {
      const differentData = _.omitBy(
        { name, content },
        (value, key) => originPost[key] === value
      );
      const post = await Post.findByIdAndUpdate(id, differentData, {
        new: true,
      });
      successHandle(res, post);
    }
  }),
};

module.exports = postController;
