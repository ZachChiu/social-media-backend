var express = require("express");
var router = express.Router();
const PostsController = require("../controllers/postsController");

router.get("/", async function (req, res, next) {
  PostsController.getPosts(res);
});

router.get("/:id", async function (req, res, next) {
  PostsController.getPost(req, res);
});

router.post("/", async function (req, res, next) {
  PostsController.createPost(req, res);
});

router.delete("/", async function (req, res, next) {
  PostsController.deletePosts(res);
});

router.delete("/:id", async function (req, res, next) {
  PostsController.deletePost(req, res);
});

router.patch("/:id", async function (req, res, next) {
  PostsController.updatePost(req, res);
});

module.exports = router;
