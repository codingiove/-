const { resolve } = require("path");
console.log(__dirname);
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "build.js",
    path: resolve(__dirname, "build"),
  },

  module: {
    // 规则
    rules: [
      // loader 的顺序默认是从右向左执行 从下到上执行
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  // plugins: [],
  mode: "development",
};
