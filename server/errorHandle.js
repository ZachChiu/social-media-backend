const errorHandle = (res, message) => {
  res.status(404).json({
    status: "fail",
    message,
  });
};

module.exports = errorHandle;
