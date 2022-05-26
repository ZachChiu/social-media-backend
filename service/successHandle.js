const successHandle = (res, data, status = 200) => {
  res.status(status).json({
    status: "success",
    data,
  });
};

module.exports = successHandle;
