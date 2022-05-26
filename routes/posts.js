const express = require("express");
const router = express.Router();
const PostsController = require("../controllers/postsController");
const { isAuth } = require("../service/auth");
const { checkPostId } = require("../service/checkId");

router.get("/posts", isAuth, async function (req, res, next) {
  PostsController.getPosts(req, res);
});

router.get("/post/:id", isAuth, async function (req, res, next) {
  PostsController.getPost(req, res, next);
});

router.post("/post", isAuth, async function (req, res, next) {
  PostsController.createPost(req, res, next);
});

router.delete("/posts", async function (req, res, next) {
  PostsController.deletePosts(req, res, next);
});

router.delete("/post/:id", isAuth, async function (req, res, next) {
  PostsController.deletePost(req, res, next);
});

router.patch("/post/:id", isAuth, checkPostId, async function (req, res, next) {
  PostsController.updatePost(req, res, next);
});

module.exports = router;
