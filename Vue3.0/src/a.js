// 1 加载模块
let mongoose = require("mongoose");
// 2 连接数据库
mongoose.connect("mongodb://localhost/数据库名");
// 3 约束
let Hello = new mongoose.Schema({ name: String, age: Number });
// 4 创建模型(表结构) (模型名,约束)(MongoDB默认会在模型名后面多加一个s,hsls)
let add = mongoose.model("hsl", Hello);
// 添加数据保存
new add({ name: "6萨达", age: 19 }).save((err, data) => {
  console.log(data);
});
