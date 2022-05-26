const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const uploadRouter = require("./routes/upload");

require("./connection");

process.on("uncaughtException", (err) => {
  console.error("Uncaughted Exception！");
  console.error(err);
  process.exit(1);
});

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/upload", uploadRouter);

app.use(function (req, res, next) {
  res.status(404).send("抱歉，您的頁面找不到");
});

// express 錯誤處理
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.status).json({
      status: "fail",
      message: err.message,
    });
  } else {
    console.error("出現重大錯誤", err);
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
};

// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.status).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

app.use(function (err, req, res, next) {
  err.status = err.status || 500;
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }
  if (err.name === "ValidationError") {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 Rejection:", promise, "原因:", reason);
});

module.exports = app;
