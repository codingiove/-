<template>
  <view class="warp" :key="UpdateKey">
    <!-- 头部 -->
    <view class="top-bar">
      <navigator
        hover-class="none"
        :url="`/pages/details/details?id=${user.id}`"
        redirect
        class="top-bar-left"
      >
        <!-- 本人头像 -->
        <image :src="user.img"></image>
      </navigator>
      <view class="top-bar-right">
        <navigator
          class="search"
          url="/pages/search/search"
          redirect
          hover-class="none"
        >
          <image src="../../static/img/index/search.png"></image>
        </navigator>
        <view class="add" @tap="Group">
          <image src="../../static/img/index/group.png"></image>
        </view>
      </view>
    </view>
    <!-- 主体 -->
    <view class="mian">
      <!-- 好友申请   -->
      <navigator
        v-if="tip > 0"
        :url="`/pages/FriendRequest/FriendRequest?id=${user.id}`"
        hover-class="none"
        class="friends"
      >
        <view class="friends-list">
          <view class="friends-list-l">
            <text class="tip"> {{ tip }}</text>
            <image src="/static/img/Snipaste.png" />
          </view>
          <view class="friends-list-r">
            <view class="top">
              <view class="name">好友申请</view>
              <view class="time">{{ time }}</view>
            </view>
            <view class="content">{{ NewLeave }}</view>
          </view>
        </view>
      </navigator>
      <!-- 没有好友 -->
      <non-existent v-if="Friendshow">
        <view>您占时没有好友</view>
        <navigator
          url="/pages/search/search"
          class="AddSearch"
          hover-class="none"
        >
          搜索好友</navigator
        >
      </non-existent>
      <!-- 好友列表   -->
      <view class="friends">
        <view
          class="friends-list"
          v-for="item in FriendsData"
          :key="item.id"
          @tap="ChatPage(item)"
        >
          <view class="friends-list-l">
            <text class="tip" v-if="item.tip > 0">{{ item.tip }}</text>
            <image :src="item.img" />
          </view>
          <view class="friends-list-r">
            <view class="top">
              <view class="name">{{ item.name }}</view>
              <view class="time">{{ item.time | Date_Time }}</view>
            </view>
            <text class="content2">{{ item.message }} </text>
          </view>
        </view>
      </view>
      <!-- 群 -->
      <view class="group">
        <view
          class="group-list"
          v-for="item in GroupArr"
          :key="item.group_id"
          @tap="ChatPage(item)"
        >
          <view class="group-list-l">
            <!-- <text class="tip" v-if="item.tip > 0">{{ item.tip }}</text> -->
            <image :src="item.group_img" />
          </view>
          <view class="group-list-r">
            <view class="top">
              <view class="name">{{ item.group_name }}</view>
              <view class="time">{{ item.time | Date_Time }}</view>
            </view>
            <text class="content2">{{ "哈哈哈哈哈哈" }} </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import myTime from "../../resource/js/Date"; // 时间处理

import nonExistent from "../../components/Common/empty";
export default {
  components: {
    nonExistent,
  },
  data() {
    return {
      // 用户信息
      user: {},
      tip: 0, // 信息数量
      time: "", //最新时间
      FriendsData: [], //好友
      Friendshow: false, // 没有好友
      GroupArr: [], // 群
      NewLeave: "", // 留言
      UpdateKey: 0,
    };
  },
  onLoad() {
    this.Getfriends();
    this.ChatTypeConversion();
    this.GetGroup();
    this.Friends();
    this.HomePageData();
  },
  created() {},
  methods: {
    // 本地数据
    Getfriends() {
      let value = uni.getStorageSync("user");
      if (value) {
        this.user = value;
        this.user.img = this.$user(value.img);
        this.socket.emit("join", value.id);
      } else {
        uni.navigateTo({
          url: "/pages/Signin/Signin",
        });
      }
    },
    // 好友申请
    async HomePageData() {
      let DataArr = await this.$http({
        url: "Home/Page/Data",
        data: {
          user_ID: this.user.id,
          state: "1", // 1别人添加我
        },
      }).then((res) => {
        this.tip = res.data.length;
        this.tip >= 1 && (this.Friendshow = false);
        this.time =
          res.data.length > 0 ? myTime.dateTime(res.data[0].time) : "";
        return res.data;
      });
      for (const item of DataArr) {
        await this.leave(item.id);
      }
    },
    // 添加好友的内容
    leave(Fid) {
      this.$http({
        url: "leave",
        data: {
          Friends_ID: Fid,
        },
      }).then(
        (res) =>
          (this.NewLeave = res.data.value[res.data.value.length - 1].message)
      );
    },
    // 好友列表
    async Friends() {
      let item = await this.$http({
        url: "Home/Page/Data",
        data: {
          user_ID: this.user.id,
          state: "0", // 0已是好友
        },
      });
      item.data.length <= 0
        ? (this.Friendshow = true)
        : (this.Friendshow = false);
      for (const list of item.data) {
        let itemData = await this.InformationTable(list.id, list);
        list.message = itemData.data[0].message;
        list.types = itemData.data[0].types;
        let result = await this.MessageNotRead(list.id, list);
        list.tip = result.data.result;
        list.code = 0; // 好友聊天
        list.img = this.$user(list.img);
        this.FriendsData.push(list);
      }
    },
    // 返回最后一条消息
    async InformationTable(Fid, itemData) {
      let result = await this.$http({
        url: "Information/Table",
        data: {
          user_ID: this.user.id,
          Friends_ID: Fid,
        },
      });
      return result;
    },
    // 消息数
    async MessageNotRead(Fid, item) {
      let result = await this.$http({
        url: "Message/Not/Read",
        data: {
          user_ID: this.user.id,
          Friends_ID: Fid,
        },
      });
      return result;
    },
    // socket 聊天置顶,接收好友消息
    ChatTypeConversion() {
      this.socket.on("ReceiveChat", (msg, Fid) => {
        // 发送类型
        this.$http({
          url: "Message/Not/Read",
          data: {
            user_ID: this.user.id,
            Friends_ID: Fid,
          },
        }).then((res) => {
          // 新增属性
          this.FriendsData[0].tip = res.data.result;
        });
        let MsgType = this.TypeCasting(msg.types, msg.message);
        for (let i = 0; i < this.FriendsData.length; i++) {
          // 判断有没有该好友
          if (this.FriendsData[i].id === Fid) {
            let e = this.FriendsData[i];
            e.time = new Date(); // 更新时间
            e.message = MsgType;
            this.FriendsData.splice(i, 1); // 删除之前的
            this.FriendsData.unshift(e); // 发送的最新消息放到最上面
          }
        }
      });
    },
    // 类型转换
    TypeCasting(types, message) {
      if (types == 0) {
        message = message;
      } else if (types == 1) {
        message = "[图片]";
      } else if (types == 2) {
        message = "[语音]";
      } else if (types == 3) {
        message = "[位置]";
      }
      return message;
    },
    // 1 v 1 和 群聊页面
    ChatPage(data) {
      let { code, id, img, name, group_img, group_name, _id } = data;
      code === 0 && this.GetChatPage(id, name, code, img);
      code === 1 && this.GetChatPage(_id, group_name, code, group_img);
      this.MessageRead(id);
    },
    // 1 对 1 消息已读
    MessageRead(Fid) {
      this.$http({
        url: "Message/Read",
        data: {
          user_ID: this.user.id,
          Friends_ID: Fid,
        },
      });
    },
    onPullDownRefresh() {
      setTimeout(() => {
        this.FriendsData = [];
        this.Friends();
        this.UpdateKey++;
        uni.stopPullDownRefresh();
      }, 1000);
    },
    // 创群
    Group() {
      uni.navigateTo({
        url: "/pages/CreatingGroup/CreatingGroup",
      });
    },
    // 获取群
    GetGroup() {
      this.$http({
        url: "Get/Group/List",
        data: {
          user_ID: this.user.id,
        },
      }).then((res) => {
        for (const item of res.data) {
          item.group_img = this.Pictures + item.group_img;
          item.code = 1;
          this.GroupArr.push(item);
        }
      });
    },
    // 跳转聊天页面
    GetChatPage(id, name, code, img) {
      return uni.navigateTo({
        url: `/pages/ChatPage/ChatPage?id=${id}&name=${name}&code=${code}&img=${img}`,
      });
    },
    // 群聊
    // GetGroupPage(id, name, img) {
    //   return uni.navigateTo({
    //     url: `/pages/GroupPage/GroupPage?id=${id}&name=${name}&img=${img}`,
    //   });
    // },
  },
};
</script>

<style lang="scss">
.AddSearch {
  width: 240rpx;
  line-height: 96rpx;
  display: inline-block;
  background: $uni-color-primary;
  box-shadow: 0 26px 18px -16px rgba(255, 228, 49, 0.4);
  font-size: 28rpx;
  border-radius: 64rpx;
  margin-top: 32rpx;
}

.warp {
  padding-top: var(--status-bar-height);
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 88rpx;
  box-sizing: border-box;
  background: $uni-bg-color;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  padding-left: $uni-spacing-col-base;
  padding-right: $uni-spacing-col-base;
}

.top-bar-left {
  float: left;

  image {
    margin-top: 10rpx;
    width: 68rpx;
    height: 68rpx;
    border-radius: 16rpx;
  }
}

.top-bar-center {
  margin: 88rpx 0;
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: -1;

  image {
    padding-top: 19rpx;
    width: 88rpx;
    height: 42rpx;
  }
}

.top-bar-right {
  float: right;

  .search {
    width: 88rpx;
    height: 88rpx;
    display: inline-block;
  }

  .add {
    width: 88rpx;
    height: 88rpx;
    display: inline-block;
  }

  image {
    padding: 18rpx 0 0 18rpx;
    width: 52rpx;
    height: 52rpx;
  }
}

.mian {
  width: 100%;
  position: absolute;
  top: 88rpx;
}

.friends {
  .friends-list {
    margin-top: 20rpx;
    width: 100%;
    display: flex;
    margin-left: $uni-spacing-col-base;
    left: 0;
    position: relative;

    .friends-list-l {
      position: relative;
      height: 96rpx;

      .tip {
        position: absolute;
        right: -16rpx;
        top: -16rpx;
        min-width: 20rpx;
        line-height: 30rpx;
        border: 2px solid rgba(255, 93, 91, 1);
        background: rgba(255, 93, 91, 1);
        color: white;
        border-radius: 40rpx;
        padding: 0 5rpx;
        text-align: center;
        z-index: 2;
        font-size: 24rpx;
      }

      image {
        border-radius: 10%;
        width: 96rpx;
        height: 96rpx;
      }
    }

    .friends-list-r {
      margin-left: 20rpx;
      width: 100%;

      .top {
        .name {
          font-size: 32rpx;
          color: rgba(39, 40, 50, 1);
          float: left;
        }

        .time {
          font-size: 24rpx;
          float: right;
          color: rgba(39, 40, 50, 0.4);
          padding-right: 40rpx;
        }

        &::after {
          content: "";
          clear: both;
          display: table;
        }
      }

      .content,
      .content2 {
        color: rgba(39, 40, 50, 0.6);
        max-width: 500rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        font-size: 28rpx;
      }

      .content2 {
        font-size: 32rpx;
        box-sizing: border-box;
        padding-top: 8rpx;
      }
    }
  }
}

.group {
  .group-list {
    margin-top: 20rpx;
    width: 100%;
    display: flex;
    margin-left: $uni-spacing-col-base;
    left: 0;
    position: relative;

    .group-list-l {
      position: relative;
      height: 96rpx;

      .tip {
        position: absolute;
        right: -16rpx;
        top: -16rpx;
        min-width: 20rpx;
        line-height: 30rpx;
        border: 2px solid rgba(255, 93, 91, 1);
        background: rgba(255, 93, 91, 1);
        color: white;
        border-radius: 40rpx;
        padding: 0 5rpx;
        text-align: center;
        z-index: 2;
        font-size: 24rpx;
      }

      image {
        border-radius: 10%;
        width: 96rpx;
        height: 96rpx;
      }
    }

    .group-list-r {
      margin-left: 20rpx;
      width: 100%;

      .top {
        .name {
          font-size: 32rpx;
          color: rgba(39, 40, 50, 1);
          float: left;
        }

        .time {
          font-size: 24rpx;
          float: right;
          color: rgba(39, 40, 50, 0.4);
          padding-right: 40rpx;
        }

        &::after {
          content: "";
          clear: both;
          display: table;
        }
      }

      .content,
      .content2 {
        color: rgba(39, 40, 50, 0.6);
        max-width: 500rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        font-size: 28rpx;
      }

      .content2 {
        font-size: 32rpx;
        box-sizing: border-box;
        padding-top: 8rpx;
      }
    }
  }
}
</style>
