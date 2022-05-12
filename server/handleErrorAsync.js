const handleErrorAsync = (func) =>
  async function (req, res, next) {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };

module.exports = handleErrorAsync;
