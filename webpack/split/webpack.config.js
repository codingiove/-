const { resolve } = require("path");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "build"),
  },
  module: {
    rules: [],
  },

  mode: "development",
  externals:{
    //忽略库名 --- npm包名
    jquery:"JQuery"
  }
};
