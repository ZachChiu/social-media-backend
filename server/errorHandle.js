const errorHandle = (res, message) => {
  res.status(400).json({
    status: "fail",
    message,
  });
};

module.exports = errorHandle;
