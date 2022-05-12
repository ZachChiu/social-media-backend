var express = require("express");
var router = express.Router();
const PostsController = require("../controllers/postsController");
const handleErrorAsync = require("../server/handleErrorAsync");

router.get("/", async function (req, res, next) {
  PostsController.getPosts(req, res);
});

router.get("/:id", async function (req, res, next) {
  PostsController.getPost(req, res, next);
});

router.post("/", async function (req, res, next) {
  PostsController.createPost(req, res, next);
});

router.delete("/", async function (req, res, next) {
  PostsController.deletePosts(req, res, next);
});

router.delete("/:id", async function (req, res, next) {
  PostsController.deletePost(req, res, next);
});

router.patch("/:id", async function (req, res, next) {
  PostsController.updatePost(req, res, next);
});

module.exports = router;
