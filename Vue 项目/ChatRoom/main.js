import Vue from "vue";
import App from "./App";
// import store from "./resource/Vue/store";
import myTime from "./resource/js/Date";
import { http } from "./resource/js/http.js";
import io from "./resource/socket/weapp.socket.io";
Vue.config.productionTip = false;

// 具体时间
Vue.filter("Date_Time", function (Time) {
  return myTime.dateTime(Time);
});

//把 vuex 定义成全局组件
// Vue.prototype.$store = store

// 全局请求
Vue.prototype.$http = http;

// 本人头像
Vue.prototype.$user = function (img) {
  return `http://192.168.0.103:3000/file/user/${img}`;
};
// 图片地址
Vue.prototype.Pictures = "http://192.168.0.103:3000/";

// 聊天室
Vue.prototype.socket = io("http://192.168.0.103:8888");
App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
