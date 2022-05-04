const Post = require("../models/postsModel");
const successHandle = require("../server/successHandle");
const errorHandle = require("../server/errorHandle");
const _ = require("lodash");

const postController = {
  async getPosts(res) {
    const posts = await Post.find();
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
      const { name, content } = req?.body;
      if (!name || !content) {
        errorHandle(res, "欄位未正確填寫");
      } else {
        const post = await Post.create({ name, content });
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
