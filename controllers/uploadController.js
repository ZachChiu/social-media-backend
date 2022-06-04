const handleErrorAsync = require("../service/handleErrorAsync");
const successHandle = require("../service/successHandle");
const errorHandle = require("../service/errorHandle");
const { ImgurClient } = require("imgur");
const sizeOf = require("image-size");

const uploadController = {
  uploadImage: handleErrorAsync(async (req, res, next) => {
    const { image } = req.body;
    if (!image) {
      return errorHandle(400, "未上傳檔案", next);
    }

    // const dimensions = sizeOf(req.files[0].buffer);
    // if (dimensions.height !== dimensions.width) {
    //   return errorHandle(400, "尺寸須符合 1:1", next);
    // }

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    const response = await client.upload({
      image,
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID,
    });
    console.log(response);
    if (response.success) {
      successHandle(res, response.data.link);
    } else {
      return errorHandle(400, "上傳檔案失敗", next);
    }
  }),
};

module.exports = uploadController;
