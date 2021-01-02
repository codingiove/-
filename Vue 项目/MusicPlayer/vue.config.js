module.exports = {
  publicPath: "./",
  devServer: {
    open: true,
    proxy: {
      "/api": {
        // 匹配所有以'/api'开头的请求路径
        target: "https://autumnfish.cn", // 代理目标的基础路径,写了页面就不用再写了
        changeOrigin: true, // 支持跨域
        pathRewrite: {
          // 重写路径: 去掉路径开头的'/api'
          "^/api": "",
        },
      },
    },
  },
};
