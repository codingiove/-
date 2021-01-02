let multer = require("multer");
let fs = require("fs");
let flg = false; // 控制文件创建
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let files = `./file/${req.body.url}`;
    // 判断文件夹是否存在,不让他重复创建
    fs.stat(files, function (error, stats) {
      stats && (flg = stats.isDirectory());
      // 动态创建文件夹
      if (!flg) {
        console.log("创建文件.....");
        fs.mkdir(files, (error) => error && console.log(error));
        // 存储路径
        cb(null, files);
      } else {
        cb(null, files);
      }
    });
  },
  filename: function (req, file, cb) {
    // 获取文件后缀名
    let type = file.originalname.replace(/.+\./, ".");
    // 存储文件命名
    cb(null, req.body.name + type);
  },
});

var upload = multer({ storage });
module.exports = function (app) {
  app.post("/files/upload", upload.array("file", 10), (req, res, next) => {
    res.send(req.files);
  });
};
