import Vue from "vue";
import App from "./App";
import io from "./socket/weapp.socket.io";
// Vue.config.productionTip = false;

Vue.prototype.socket = io("http://47.114.38.181:8124"); // 连接到后端地址 http://47.114.38.181:8124
App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
