const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const successHandle = require("../server/successHandle");
const errorHandle = require("../server/errorHandle");
const _ = require("lodash");

const postController = {
  async getPosts(req, res) {
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
  },
  async getPost(req, res) {
    try {
      const id = req?.params?.id;
      const post = await Post.findById(id);
      if (id == null || post == null) {
        errorHandle(res, "id 有誤");
      } else {
        successHandle(res, post);
      }
    } catch (error) {
      errorHandle(res, error.message);
    }
  },
  async createPost(req, res) {
    try {
      const { user, content, image } = req?.body;
      if (!user || !content) {
        errorHandle(res, "欄位未正確填寫");
      } else {
        const createData = { user, content };
        if (image) {
          createData.image = image;
        }
        const post = await Post.create(createData);
        successHandle(res, post);
      }
    } catch (error) {
      errorHandle(res, error.message);
    }
  },

  async deletePosts(res) {
    try {
      await Post.deleteMany({});
      successHandle(res, []);
    } catch (error) {
      errorHandle(res, "刪除失敗");
    }
  },

  async deletePost(req, res) {
    try {
      const id = req?.params?.id;
      const post = await Post.findByIdAndDelete(id);

      if (id == null || post == null) {
        errorHandle(res, "id 有誤");
      } else {
        successHandle(res, {});
      }
    } catch (error) {
      errorHandle(res, "刪除失敗");
    }
  },

  async updatePost(req, res) {
    try {
      const id = req?.params?.id;
      const { name, content } = req?.body;
      const originPost = await Post.findById(id);

      if (id == null || originPost == null) {
        errorHandle(res, "id 有誤");
      } else if (!name || !content) {
        errorHandle(res, "欄位有誤");
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
    } catch (error) {
      errorHandle(res, "更新失敗");
    }
  },
};

module.exports = postController;
