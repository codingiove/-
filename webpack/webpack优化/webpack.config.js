const { resolve } = require("path");
let htmlwebpackplugin = require("html-webpack-plugin");
let webpack = require("webpack");
module.exports = {
  entry: {
    commonA: "./src/commonA.js",
    commonB: "./src/commonB.js",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "build"),
  },
  module: {},
  plugins: [
    new htmlwebpackplugin({
      template: "./src/index.html", // 这个文件作为模板
      filename: "index.html", // 模板名字
      // 进行压缩
      minify: {
        removeAttributeQuotes: true, // 去掉 ""
        collapseWhitespace: true, // 一行显示
      },
    }),
    // moment中引入了, ./locale就忽略掉,因为它引入了很多语言包
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
  ],
  devServer: {
    contentBase: "./build",
    compress: true,
    port: 3000,
    open: true,
  },
  optimization: {
    splitChunks: {
      // 分割代码块
      cacheGroups: {
        common: {
          // 公共代码
          chunks: "initial",
          minSize: 0,
          minChunks: 2, // 用了2次就抽离
        },
        vendor: {
          priority: 1,
          test: /node_modules/, // 抽离第三方库
          chunks: "initial",
          minSize: 0,
          minChunks: 2, // 用了2次就抽离
        },
      },
    },
  },
  mode: "development",
};
