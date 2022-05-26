const Post = require("../models/postsModel");
const handleErrorAsync = require("./handleErrorAsync");
const errorHandle = require("./errorHandle");

const checkPostId = handleErrorAsync(async (req, res, next) => {
  const id = req?.params?.id;

  await Post.findById(id, async function (err, post) {
    if (err || !post) {
      return next(errorHandle(400, "id 有誤", next));
    } else {
      req.post = post;
      next();
    }
  }).clone();
});

module.exports = { checkPostId };
