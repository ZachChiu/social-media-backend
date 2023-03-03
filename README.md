# Social Media Backend

此 side project 以社群媒體為故事背景，採前後端分離。

前端 [DEMO](https://social-media-mejt.onrender.com/)
前端部分可參考 [social-media-frontend](https://github.com/ZachChiu/social-media-frontend)

### 使用技術：

1. 使用 Node.js 後端環境 
2. Express 後端框架
3. 使用 MongoDB 非關聯式資料庫資料庫
4. Mongoose
5. jwt 驗證
6. bcryptjs 密碼加密
7. imgur
8. Postman 建立 API 測試文件


### 專案功能：

1. 登入註冊 post /users/sign_in, post /users/sign_up
2. 取得使用者資訊 get /users/profile
3. 更新使用者資訊 patch /users/updateProfile
4. 追蹤/取消追蹤 post/delete /users/:id/follow
5. 上傳圖片到 imgur 第三方服務 post /upload
6. 取得所有貼文 get /posts
7. 創建貼文 post /post
8. 刪除貼文 delete /post/:id
9. 更新貼文 patch /post/:id
10. 按讚/取消按讚 post/delete /post/:id/like
等共 21 隻API

### 未來追加功能：

1. Google / Facebook / Line 登入註冊
2. 金流服務
3. Socket 聊天室


