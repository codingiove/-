<template>
  <view>
    <view class="status-bar">
      <!-- 注册 -->
      <view url="" class="login-c" @tap="out">
        <image src="/static/back.png" class="login-back"></image>
      </view>
      <!-- 上面好友 -->
      <view class="scrollv">
        <view class="users">
          <view
            v-for="(item, index) in users"
            class="user-l"
            @tap="otochat(index)"
            :key="index"
          >
            <!-- 好友是否给我发消息 -->
            <view class="tip" v-if="item.tip"></view>
            <image :src="`/static/images/${item.img}.png`"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="gundong">
      <!-- 聊天 -->
      <scroll-view
        class="main"
        :scroll-into-view="scrollToView"
        scroll-y
        scroll-with-animation="true"
      >
        <view v-for="(item, index) in chat" :key="index" :id="`lwh${item._Id}`">
          <!-- 好友发的 -->
          <view class="left msg" v-if="item.id == 1">
            <image :src="`../../static/images/m.png`"></image>
            <view class="nr">
              <view class="neir">
                {{ item.MessageContent }}
              </view>
              <!-- 名字加时间 -->
              <view class="nt" v-if="item.time !== ''"
                >{{ item.name + " " + dateTime(item.time) }}
              </view>
            </view>
          </view>
          <!-- 自己发的 -->
          <view class="right msg" v-if="item.id == 2">
            <image  src="../../static/images/m.png"></image>
            <view class="nr">
              <view class="neir">
                {{ item.MessageContent }}
              </view>
              <view class="nt" v-if="item.time !== ''">{{
                dateTime(item.time)
              }}</view>
            </view>
          </view>

          <!-- 欢迎 -->
          <view class="center" v-if="item.id == 3">
            <view class="inner">{{ item.name }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 发送信息 -->
    <view class="send">
      <input
        confirm-type="send"
        class="chat-send"
        v-model="chatm"
        auto-height="true"
        show-confirm-bar="false"
        maxlength="-1"
        @keydown.enter="sendMsg"
      />
      <image
        src="../../static/send.png"
        mode="aspectFit"
        @tap="sendMsg"
      ></image>
    </view>
    <!-- 弹出层一对一聊天 -->
    <view class="modify" :animation="animationData">
      <view class="u-name">
        {{ uname }}
      </view>
      <scroll-view class="modfiy-mian" scroll-y="true">
        <view v-for="(item, index) in Friends" :key="index">
          <view class="left msg" v-if="item.fid == fid">
            <image :src="`/static/images/${item.img}.png`"></image>
            <view class="nr">
              <view class="neir">
                {{ item.MessageContent }}
              </view>
              <!-- 一对一聊天时间 -->
              <view class="nt" v-if="item.time !== ''">{{
                dateTime(item.time)
              }}</view>
            </view>
          </view>
          <view class="right msg" v-if="item.fid == uid && item.tid == fid">
            <image :src="`/static/images/${item.img}.png`"></image>
            <view class="nr">
              <view class="neir">
                {{ item.MessageContent }}
              </view>
              <!-- 一对一聊天时间 -->
              <view class="nt">{{ dateTime(item.time) }}</view>
            </view>
          </view>
          <!-- 离开 -->
          <view class="center" v-if="item.id == 3">
            <view class="inner">{{ item.name }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="bg" @tap="outotoChat" :style="{ display: bg }"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      chatm: "", //消息内容
      name: "", //用户名称
      uname: "", // 好友名
      fid: "", // 好友 ID
      uid: "a", // 用户 ID
      img: "", //用户头像
      chat: [], //聊天内容
      member: 0, // 成员个数
      animationData: {}, // 动画
      bb: false,
      bg: "none", // 背景
      users: [],
      Friends: [],
      Time: "2002 09:31:45", // 群时间对比
      Time2: "2002 09:31:45", // 一对一时间对比
      scrollToView: "", // 进来滚动到信息最下面
    };
  },
  onLoad: function (e) {
    this.name = e.name;
    this.img = e.img;
    this.join(e.name, e.img); // 获取用户信息
    this.welcome();
    this.getMsg();
    this.UserLeaves();
    this.myself();
    this.GetMsg();
  },
  methods: {
    Scroll_to_bottom() {
      // 滚动到最底部
      this.scrollToView = "";
      let arr = this.chat;
      this.scrollToView = "lwh" + arr[arr.length - 1]._Id; // 定位到最后面
      console.log(this.scrollToView);
    },
    //加入群
    join(name, img) {
      this.socket.emit("Join", name, img);
    },
    //欢迎加入群
    welcome() {
      this.socket.on("welcome", (name, user) => {
        let data = {
          name: `欢迎 ${name} 加入群聊`,
          id: 3, // 1 别人 2 自己 3 欢迎
        };
        this.chat.push(data);
        for (let index in user) {
          if (user[index].id === this.uid) {
            user.splice(index, 1);
          }
        }
        this.users = user;
      });
    },
    // 间隔时间差
    Interval_time(old, now) {
      // old ---> this.Time  == 2002 09:31:45
      // now ---> new Date() == 现在时间
      // 现在时间是最大的
      old = new Date(old);
      now = new Date(now);
      let told = old.getTime(); //  输入的时间
      let tnow = now.getTime(); //  现在时间
      // 过一分钟才显示当前时间
      return tnow >= told + 1000 * 60 * 5 ? now : "";
    },
    //发送消息
    sendMsg(event) {
      // 群聊天
      if (this.chatm.length > 0 && this.fid == "") {
        let time = this.Interval_time(this.Time, new Date());
        time && (this.Time = time); // 存储时间,做下次对比
        // 间隔时间
        // 1 别人 2 自己
        let msg = {
          _Id: Math.ceil(Math.random() * 1000),
          MessageContent: this.chatm,
          img: this.img,
          time,
          id: 2,
        };
        let data = JSON.parse(JSON.stringify(msg));
        data.id = 1;
        this.chat.push(msg); // 给自己看见
        this.socket.emit("sendMsg", data); // 给别人看见
        this.chatm = "";
        this.Scroll_to_bottom();
      } else {
        let time = this.Interval_time(this.Time2, new Date());
        time && (this.Time2 = time); // 存储时间,做下次对比
        // 一对一聊天
        let msg = {
          MessageContent: this.chatm,
          img: this.img,
          time,
          fid: this.uid,
          tid: this.fid,
        };
        let data = JSON.parse(JSON.stringify(msg));
        data.name = this.name;
        this.Friends.push(msg); // 给自己看见
        this.socket.emit("msg", data); // 一对一
        this.chatm = "";
      }
    },
    // 获取消息
    getMsg() {
      this.socket.on("sendMsg", (data) => {
        this.chat.push(data);
      });
    },
    // 退出
    UserLeaves() {
      this.socket.on("quit", (name, user) => {
        let data = {
          name: `${name} 退出群聊`,
          id: 3,
        };
        this.chat.push(data);
        this.users = user;
      });
    },
    // 返回
    out() {
      uni.navigateTo({
        url: "/pages/index/index",
      });
      this.socket.emit("disconnecting");
      console.log("退出");
    },
    //一对一动画
    modify() {
      var animation = uni.createAnimation({
        duration: 400,
        timingFunction: "ease",
      });
      this.bb = !this.bb;
      if (this.bb) {
        this.bg = "block";
        animation.bottom(0).step();
      } else {
        this.bg = "none";
        animation.bottom().step();
      }
      this.animation = animation;
      this.animationData = animation.export();
    },
    //进入一对一聊天
    otochat(e) {
      this.uname = this.users[e].name;
      this.fid = this.users[e].id;
      this.users[e].tip = false;
      this.modify();
    },
    //退出一对一聊天
    outotoChat: function () {
      this.uname = "";
      this.fid = "";
      this.modify();
    },
    //获取自己
    myself() {
      this.socket.on("myself", (name, user, id) => {
        this.uid = id;
        let data = {
          name: "欢迎 " + name + " 加入群聊",
          id: 3,
        };
        this.chat.push(data);
        for (let index in user) {
          if (user[index].id === this.uid) {
            user.splice(index, 1);
          }
        }
        this.users = user;
      });
    },
    //获取一对一消息
    GetMsg() {
      this.socket.on("MGS", (data) => {
        let fid = data.fid;
        for (let index in this.users) {
          // 给发的那个好友加个红点
          if (this.users[index].id === fid) {
            this.users[index].tip = true;
          }
        }
        this.Friends.push(data);
      });
    },
    // 时间处理
    dateTime(date) {
      let old = new Date(date); // 传的时间
      let current = new Date(); // 当前时间

      let hour = old.getHours(); // 传的小时
      let minute = old.getMinutes(); // 传的分钟
      let year = old.getFullYear(); // 传的年份
      let month = old.getMonth() + 1; // 传的月份
      let DatE = old.getDate(); // 传的日期

      let current_hour = current.getHours();
      let current_minute = current.getMinutes();
      let current_month = current.getMonth() + 1;
      let current_DatE = current.getDate();

      hour < 10 ? (hour = "0" + hour) : hour;
      minute < 10 ? (minute = "0" + minute) : minute;
      // 处理今天时间
      if (month === current_month && DatE === current_DatE) {
        return hour <= 12
          ? `上午${hour}:${minute}`
          : hour <= 18
          ? `下午${hour}:${minute}`
          : `${hour}:${minute}`;
      }
    },
  },
};
</script>

<style lang="scss">
.status-bar {
  position: fixed;
  left: 0;
  width: 100%;
  height: 88rpx;
  padding-top: var(--status-bar-height);
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  overflow: hidden;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  z-index: 998;
  color: #272832;
  -webkit-transition-property: all;
  transition-property: all;
  background: rgba(255, 255, 255, 0.96);
  .login-c {
    width: 60rpx;
    height: 60rpx;
    padding-top: 22rpx;
    padding-left: 32rpx;
  }
  .login-back {
    width: 20rpx;
    height: 34rpx;
  }

  .scrollv {
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    width: 84%;
    .users {
      //background: #eee;
      display: flex;
      .user-l {
        padding: 12rpx 8rpx;
        position: relative;
        image {
          width: 64rpx;
          height: 64rpx;
          border-radius: 50%;
        }
        .tip {
          width: 14rpx;
          height: 14rpx;
          background: rgba(255, 77, 60, 1);
          position: absolute;
          top: 12rpx;
          right: 10rpx;
          border-radius: 50%;
          z-index: 10;
        }
      }
    }
  }
}
.main {
  padding: 160rpx 0 160rpx;
}
.main,
.modfiy-mian {
  .msg {
    display: flex;

    align-items: flex-end;
    padding: 40rpx 0;
    image {
      flex: none;
      width: 64rpx;
      height: 64rpx;
      border-radius: 18rpx;
      margin: 0 20rpx;
    }
    .nr {
      .neir {
        max-width: 380rpx;
        padding: 26rpx 32rpx;
        min-height: 48rpx;
        font-size: 28rpx;
        color: rgba(25, 29, 35, 1);
        line-height: 40rpx;
      }
      .nt {
        padding-top: 8rpx;
        position: absolute;
        font-size: 24rpx;
        color: rgba(25, 29, 35, 0.5);
        line-height: 34rpx;
      }
    }
  }
  .left {
    flex-direction: row;
    .neir {
      background: rgba(244, 244, 244, 1);
      border-radius: 24rpx 24rpx 24rpx 0px;
    }
  }
  .right {
    flex-direction: row-reverse;
    .neir {
      background: rgba(255, 234, 222, 1);
      border-radius: 24rpx 24rpx 0px 24rpx;
    }
    .nt {
      right: 132rpx;
    }
  }
  .center {
    text-align: center;
    padding: 32rpx 0 20rpx;
    .inner {
      font-size: 24rpx;
      display: inline-block;
      color: rgba(25, 29, 35, 0.5);
      line-height: 34rpx;
    }
  }
}
.send {
  position: fixed;
  z-index: 1002;
  bottom: 0;
  width: 100%;

  padding-bottom: var(--status-bar-height);
  min-height: 100rpx;
  background: rgba(255, 255, 255, 0.96);
  display: flex;
  .chat-send {
    margin: 12rpx 48rpx;

    flex: 1;
    width: 100%;
    min-height: 40rpx;
    background: rgba(242, 242, 242, 1);
    border-radius: 24rpx;
    font-size: 28rpx;
    color: rgba(25, 29, 35, 1);
    line-height: 40rpx;
    padding: 24rpx 80rpx 24rpx 24rpx;
  }
  image {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    right: 68rpx;
    top: 32rpx;
  }
}
.modify {
  position: fixed;
  overflow: hidden;
  left: 0;
  bottom: -90%;
  width: 100%;
  height: 90%;
  z-index: 1000;
  background: #fff;
  border-radius: 48rpx 48rpx 0px 0px;
}
.u-name {
  position: absolute;
  top: 0;
  background-color: #fff;
  height: 80rpx;
  text-align: center;
  width: 100%;
  line-height: 80rpx;
}
.modfiy-mian {
  padding: 88rpx 28rpx 120rpx;
  box-sizing: border-box;
  height: 100%;
}
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.4);
}
.gundong {
  height: 3000px;
}
</style>
