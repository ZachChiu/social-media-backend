const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const successHandle = require("../service/successHandle");
const errorHandle = require("../service/errorHandle");
const handleErrorAsync = require("../service/handleErrorAsync");
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
    }).populate({
      path: "user",
      select: "name photo",
    });
  }),

  createPost: handleErrorAsync(async (req, res, next) => {
    const { content, image } = req?.body;
    const user = req.user.id;
    if (!content) {
      return next(errorHandle(400, "欄位未正確填寫", next));
    }

    const createData = { user, content, image };
    await Post.create(createData, function (err, post) {
      if (err) {
        return next(errorHandle(400, "建立失敗", next));
      } else {
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
      if (err || !post) {
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

    const originPost = req.post;
    const differentData = _.omitBy(
      { content },
      (value, key) => originPost[key] === value
    );

    await Post.findByIdAndUpdate(
      id,
      differentData,
      {
        new: true,
      },
      function (err, post) {
        if (err || !post) {
          return next(errorHandle(400, "編輯失敗", next));
        } else {
          successHandle(res, post);
        }
      }
    ).clone();
  }),

  likePost: handleErrorAsync(async (req, res, next) => {
    const user = req?.user?.id;
    const id = req?.params?.id;

    await Post.findByIdAndUpdate(
      id,
      { $addToSet: { likes: user } },
      { new: true },
      function (err, post) {
        if (err) {
          return next(errorHandle(400, "按讚失敗", next));
        } else {
          successHandle(res, post, 201);
        }
      }
    ).clone();
  }),

  unlikePost: handleErrorAsync(async (req, res, next) => {
    const user = req?.user?.id;
    const id = req?.params?.id;

    await Post.findByIdAndUpdate(
      id,
      { $pull: { likes: user } },
      { new: true },
      function (err, post) {
        if (err) {
          return next(errorHandle(400, "取消按讚失敗", next));
        } else {
          successHandle(res, post, 201);
        }
      }
    ).clone();
  }),

  getUserPosts: handleErrorAsync(async (req, res, next) => {
    const userId = req?.params?.id;
    const timeSort =
      req?.query?.timeSort === "asc" ? "createdAt" : "-createdAt";
    const findBySearchContent =
      req?.query?.content != null
        ? { content: new RegExp(req?.query?.content) }
        : {};

    await Post.find(
      { $and: [{ user: userId }, findBySearchContent] },
      function (err, post) {
        if (err || !post) {
          return next(errorHandle(400, "id 有誤", next));
        } else {
          successHandle(res, post);
        }
      }
    )
      .sort(timeSort)
      .populate({
        path: "user",
        select: "name photo",
      })
      .clone();
  }),

  getLikeList: handleErrorAsync(async (req, res, next) => {
    const user = req?.user?.id;

    await Post.find(
      {
        likes: { $in: [user] },
      },
      function (err, post) {
        if (err) {
          return next(errorHandle(400, "取得按讚列表失敗", next));
        } else {
          successHandle(res, post);
        }
      }
    )
      .populate({
        path: "user",
        select: "name",
      })
      .clone();
  }),
};

module.exports = postController;
