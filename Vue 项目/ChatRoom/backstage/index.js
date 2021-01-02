const express = require("express");
const app = express();
const bodyparser = require("body-parser"); // 解析前端返回的数据
let token = require("./plugIn/token"); // token
let path = require("path");

const io = require("socket.io")(app.listen(8888));

require("./plugIn/socket")(io); // 聊天室

// 设置跨域访问
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，* 代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的 header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") {
    res.status(200).send(); //让options尝试请求快速结束
  } else {
    next();
  }
}),
  // app.use(bodyparser.json()); // 解析 json
  // app.use(bodyparser.urlencoded({ extended: true })); // 解析表单的方式

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 判断前端传 token过来没  调用 next 往下执行 中间件
app.use((req, res, next) => {
  // 有 token
  if (req.body.token) {
    return token.DecodeToken(req.body.token) !== 0
      ? next()
      : res.status(400).send({ code: 8, success: "Token 失效" });
  } else {
     next();
  }
});

// 导出静态资源,动态拼接路径,只要通过 /file 就能访问里面的内容 (动态获取,"./file"的绝对路径)
app.use("/file", express.static(path.join(__dirname, "./file")));

require("./router/router")(app); // 路由
require("./plugIn/multer")(app); // 文件上传

// 404页面
app.use((req, res, next) => {
  res.send("抱歉！页面无法访问……");
});

app.listen(3000, () => {
  console.log("启动");
});
