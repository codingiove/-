<template>
  <view>
    <!-- 头部 -->
    <common-Head class="fixed">
      <view slot="content">好友请求</view>
    </common-Head>
    <!-- 主体 -->
    <view class="first">
      <view
        class="Friend-Request-wrap"
        v-for="(item, index) in FriendRequest"
        :key="item.id"
      >
        <view class="Friend-Request-list">
          <view class="list-reject" @tap="identical(index, 'Delete/Friend')"
            >拒绝</view
          >
          <view class="list-images">
            <image :src="item.img" />
          </view>
          <view class="list-consent" @tap="identical(index, 'Agree/With/Buddy')"
            >同意</view
          >
        </view>
        <view class="news-wrap">
          <view class="news-name">{{ item.name }}</view>
          <view class="news-time">{{ item.time }}</view>
        </view>
        <view class="Leaving-Amessage"> 留言：{{ item.message }} </view>
      </view>
    </view>
  </view>
</template>

<script>
import commonHead from "../../components/Common/CommonHead";
import Date_Time from "../../resource/js/Date";
export default {
  data() {
    return {
      Id: "", //本人id
      FriendRequest: [],
      Fid: "", // 好友ID
    };
  },
  onLoad(e) {
    this.Id = e.id;
    this.HomePageData();
  },

  methods: {
    // 别人申请加我好友
    HomePageData() {
      this.$http({
        url: "Home/Page/Data",
        data: {
          user_ID: this.Id,
          state: "1", // 0已是好友 , 1别人添加我 , 2我添加别人, 3拒绝或删除好友
        },
      }).then((res) => {
        for (const item of res.data) {
          this.Fid = item.id;
          item.img = this.$user(item.img);
          item.time = Date_Time.dateTime(item.time);
          // 传入每一项
          this.InformationTable(item.id, item);
        }
      });
    },
    // 一对一消息表
    InformationTable(Fid, itemData) {
      this.$http({
        url: "leave",
        data: {
          Friends_ID: Fid,
        },
      }).then((res) => {
        // 给每一项添加一个 message
        itemData.message = res.data.value[res.data.value.length - 1].message;
        this.FriendRequest.push(itemData);
      });
    },
    // 同意拒绝
    identical(index, url) {
      this.$http({
        url,
        data: { user_ID: this.Id, Friends_ID: this.Fid },
      }).then((res) => this.FriendRequest.splice(index, 1));
    },
  },
  components: {
    commonHead,
  },
};
</script>

<style lang="scss">
.fixed {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background: #fff;
  z-index: 6;
}
.Friend-Request-wrap {
  padding-top: var(--status-bar-height);
  margin: 80rpx 20rpx;
  height: 360rpx;
  background: #fff;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.2);
  border-radius: 20rpx;

  .Friend-Request-list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-top: 20rpx;
    .list-reject,
    .list-consent {
      width: 150rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      border-radius: 40rpx;
      color: #f75262;
      background: #ffe7e6;
    }
    .list-images {
      margin-top: -110rpx;
      background: blueviolet;
      border-radius: 100rpx;
      width: 128rpx;
      height: 128rpx;
      image {
        width: 128rpx;
        height: 128rpx;
        border-radius: 100rpx;
      }
    }
    .list-consent {
      color: #000;
      background: rgba(255, 228, 49, 1);
    }
  }
  .news-wrap {
    text-align: center;
    .news-name {
      color: 38rpx;
    }
    .news-time {
      font-size: 32rpx;
      color: rgb(190, 188, 188);
      padding-top: 5rpx;
    }
  }
  .Leaving-Amessage {
    background: #eff2f2;
    border-radius: 20rpx;
    padding: 10rpx;
    margin: 20rpx auto;
    box-sizing: border-box;
    font-size: 30rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    width: 652rpx;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
}
.first {
  padding-top: var(--status-bar-height);
  margin-top: 200rpx;
}
</style>
