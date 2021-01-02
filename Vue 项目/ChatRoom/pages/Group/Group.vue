<template>
  <view class="Group">
    <view class="Group-top" :animation="animationData">
      <image src="../../static/img/register/jtou.png" class="Group-return" />
      <image src="../../static/img/details/more.png" class="Group-more" />
    </view>
    <image :src="cropFilePath" class="Group-bg" />
    <view class="wrap">
      <!-- 群简介 -->
      <view class="Group-introduce">
        <view class="Group-introduce-top">
          <view class="Group-introduce-name">开心就好了</view>
          <view class="Group-introduce-time">2019/12/23</view>
        </view>
        <view class="Group-introduce-detailed"
          >特别的爱给特别的你，就阿什顿库，大哭高科技啊老哭高科技啊老大。领导咖啡什顿库，大哭高科技啊老哭高科
        </view>
      </view>
      <!-- 群人数 -->
      <view class="Group-Number-wrap">
        <view class="Group-Number-top">
          <view class="Group-Members">群成员</view>
          <view class="Group-Membe-warp">
            <view class="Group-Member-Management">成员管理</view>
            <image
              src="../../static/img/register/jtou.png"
              class="Group-return"
            />
          </view>
        </view>
        <view class="Group-Number">
          <view class="Group-content">
            <image class="Number-img" src="/static/img/timg.jpg" />
            <view class="Number-name">风KOKO</view>
            <view class="delete-bg">
              <view class="Number-delete"></view>
            </view> </view
          ><view class="Group-content">
            <image class="Number-img" src="/static/img/timg.jpg" />
            <view class="Number-name">风KOKO</view>
            <view class="delete-bg">
              <view class="Number-delete"></view>
            </view>
          </view>
          <view class="Group-content">
            <image class="Number-img" src="/static/img/timg.jpg" />
            <view class="Number-name">风KOKO</view>
            <view class="delete-bg">
              <view class="Number-delete"></view>
            </view>
          </view>
          <view class="Group-content">
            <image class="Number-img" src="/static/img/timg.jpg" />
            <view class="Number-name">风KOKO</view>
            <view class="delete-bg">
              <view class="Number-delete"></view>
            </view>
          </view>
          <view class="Group-content">
            <image class="Number-img" src="/static/img/timg.jpg" />
            <view class="Number-name">风KOKO</view>
            <view class="delete-bg">
              <view class="Number-delete"></view>
            </view>
          </view>
          <!-- 邀请 -->
          <view class="Group-invite">
            <view class="invite-add"></view>
          </view>
        </view>
      </view>
      <!-- 群名称  -->
      <view
        class="Group-name-wrap"
        @tap="Add_friends_animation('群名称', '开心就好了')"
      >
        <view class="Group-title">群名称</view>
        <view class="Group-name">开心就好了</view>
        <image src="../../static/img/register/jtou.png" class="Group-return" />
      </view>
      <!-- 群头像 -->
      <view class="Group-head" @tap="upload">
        <view class="Group-head-name">群头像</view>
        <image-cropper
          :src="tempFilePath"
          @confirm="confirm"
          @cancel="cancel"
        ></image-cropper>
        <image :src="cropFilePath" />
        <image src="../../static/img/register/jtou.png" class="Group-return" />
      </view>
      <!-- 群公告 -->
      <view
        class="Group-name-wrap"
        @tap="
          Add_friends_animation(
            '群公告',
            '特别的爱给特别的你，就阿什顿库，大哭高科技啊老哭高科技啊老大。领导咖啡什顿库，大哭高科技啊老哭高科'
          )
        "
      >
        <view class="Group-title">群公告</view>
        <view class="Group-name"
          >特别的爱给特别的你，就阿什顿库，大哭高科技啊老哭高科技啊老大。领导咖啡什顿库，大哭高科技啊老哭高科</view
        >
        <image src="../../static/img/register/jtou.png" class="Group-return" />
      </view>
      <!-- 我的本群昵称 -->
      <view
        class="Group-name-wrap"
        @tap="Add_friends_animation('我的本群昵称', ' KOKO')"
      >
        <view class="Group-title">我的本群昵称</view>
        <view class="Group-name">KOKO</view>
        <image src="../../static/img/register/jtou.png" class="Group-return" />
      </view>
      <!-- 消息免打扰 -->
      <view class="Group-NO-News">
        <view class="NO-News">消息免打扰</view>
        <switch class="switch" color="rgba(255,228,49,1)" />
      </view>
      <!-- 退出 -->
      <view class="Group-quit">退出群聊</view>
    </view>
    <!-- 弹出框 -->
    <view
      class="personal-popover"
      :animation="library"
      :style="{ bottom: -WholePage + 'px' }"
    >
      <view class="popover-top">
        <view class="popover-cancel" @tap="Add_friends_animation">取消</view>
        <view class="popover-create"> {{ ClickTitle }} </view>
        <view class="popover-confirm">确定</view>
      </view>
      <view class="content-block">
        <view class="information-block">
          <textarea v-model="ClickContent" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ImageCropper from "../../components/ling-imgcropper/ling-imgcropper";
export default {
  components: {
    ImageCropper,
  },
  data() {
    return {
      top: 0,
      animationData: {}, // 顶部动画
      library: {}, // 修改动画
      WholePage: 0, // 整个页面的高度
      ClickTitle: "", // 点击的标题
      ClickContent: "", //  内容
      isADD: false, // 动画条件
      tempFilePath: "", // 剪辑
      cropFilePath: "/static/img/timg.jpg", // 剪辑的群头像
    };
  },
  mounted() {
    uni
      .createSelectorQuery()
      .in(this)
      .select(".Group")
      .boundingClientRect((data) => (this.WholePage = data.height))
      .exec();
  },
  methods: {
    // 获取顶部距离
    getTop() {
      uni
        .createSelectorQuery()
        .in(this)
        .select(".wrap")
        .boundingClientRect((data) => {
          this.top = data.top;
        })
        .exec();
    },
    // 顶部动画
    Animation() {
      let animation = uni.createAnimation({
        duration: 300,
        timingFunction: "linear",
      });
      // 0 > 负166 透明  负167 > 负166 白色
      this.top > -166
        ? animation.backgroundColor("transparent").step()
        : animation.backgroundColor("white").step();
      this.animationData = animation.export();
    },
    // 修改动画
    Add_friends_animation(title, name) {
      this.ClickTitle = title;
      this.ClickContent = name;
      this.isADD = !this.isADD;
      let animation = uni.createAnimation({
        duration: 300,
        timingFunction: "ease",
      });
      if (this.isADD) {
        animation.bottom(0).step();
      } else {
        animation.bottom(-this.WholePage).step();
        this.ClickTitle = "";
        this.ClickContent = "";
      }
      this.library = animation.export();
    },
    // 上传图片
    confirm(e) {
      this.tempFilePath = "";
      this.cropFilePath = e.detail.tempFilePath;
      uni.uploadFile({
        url: ``, // http://192.168.0.105:3000/files/upload
        filePath: "",
        name: "file",
        fileType: "image",
        formData: {
          url: "user", // 创建文件夹
          name: "", // 文件名
        }, //传递参数
        fail(e) {
          console.log("this is errormes " + e.message);
        },
      });
    },
    // 取消裁剪
    cancel() {
      this.tempFilePath = "";
    },
    // 头像插件
    upload() {
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          // 存储上传图片
          this.tempFilePath = res.tempFilePaths.shift();
        },
      });
    },
    
  },
  // 滚动周期
  onPageScroll() {
    this.getTop();
    this.Animation();
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 400rpx;
}
.Group-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  position: relative;
  padding: 0 20rpx;
  z-index: 1;
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
  .Group-return {
    transform: rotate(180deg);
    width: 50rpx;
    height: 50rpx;
  }
  .Group-more {
    width: 52rpx;
    height: 12rpx;
  }
}
.Group-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
}
.Group-introduce {
  background: #ffffff;
  position: relative;
  z-index: 1;
  border-radius: 40rpx 40rpx 0 0;
  height: 240rpx;
  // border-bottom: 1px solid #eeeeee;
  .Group-introduce-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40rpx 20rpx 30rpx 20rpx;
    .Group-introduce-name {
      font-size: 48rpx;
    }
    .Group-introduce-time {
      color: #272832;
      font-size: 28rpx;
    }
  }
  .Group-introduce-detailed {
    padding: 0 20rpx;
    box-sizing: border-box;
    font-size: 30rpx;
    color: #272832;
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
.Group-Number-wrap {
  width: 100%;
  background: #ffffff;
  border-top: 1rpx solid #eeeeee;
  padding-bottom: 40rpx;
  color: #272832;
  border-bottom: 1rpx solid #efefef;
  .Group-Number-top {
    padding: 42rpx 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .Group-Members {
    font-size: 48rpx;
  }
  .Group-Membe-warp {
    display: flex;
    align-items: center;
    .Group-Member-Management {
      font-size: 28rpx;
      color: #272832;
    }
  }
  .Group-return {
    width: 28rpx;
    height: 28rpx;
  }
  .Group-Number {
    display: flex;
    flex-wrap: wrap;
    .Group-content {
      text-align: center;
      padding: 0 16rpx 10rpx 16rpx;
      position: relative;
      .Number-img {
        width: 110rpx;
        height: 110rpx;
        border-radius: 20rpx;
      }
      .Number-name {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 30rpx;
      }
      .delete-bg {
        width: 40rpx;
        height: 40rpx;
        background: #ff5d5b;
        border-radius: 50%;
        position: absolute;
        top: -12rpx;
        right: 0;
        .Number-delete {
          background: #fff;
          font-size: 0;
          position: absolute;
          top: 20rpx;
          left: 10rpx;
          width: 20rpx;
          height: 5rpx;
          -webkit-transform: rotate(45deg);
            &:after {
            content: "/";
            display: block;
            width: 20rpx;
            height: 5rpx;
            background: #fff;
            -webkit-transform: rotate(-90deg);
          }
        }
      }
    }
    .Group-invite {
      width: 110rpx;
      height: 110rpx;
      background: $uni-color-primary;
      border-radius: 20rpx;
      position: relative;
      margin-left: 20rpx;
      .invite-add {
        background: #272832;
        font-size: 0;
        position: absolute;
        left: 50%;
        top: 50%;
        width: 40rpx;
        height: 5rpx;
        transform: translate(-50%, -50%);
          &:after {
          content: "/";
          display: block;
          width: 40rpx;
          height: 5rpx;
          background: #272832;
          -webkit-transform: rotate(-90deg);
        }
      }
    }
  }
}
.Group-name-wrap {
  width: 100%;
  height: 112rpx;
  line-height: 70rpx;
  color: rgba(39, 40, 50, 0.6);
  padding: 22rpx 20rpx;
  box-sizing: border-box;
  .Group-title {
    float: left;
    font-size: 40rpx;
    color: #272832;
    margin-right: 30rpx;
  }

  .Group-name {
    float: left;
    width: 400rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Group-return {
    width: 28rpx;
    height: 28rpx;
    float: right;
    margin-top: 22rpx;
  }
}
.Group-NO-News {
  width: 100%;
  height: 112rpx;
  padding: 22rpx 20rpx;
  box-sizing: border-box;
  .NO-News {
    float: left;
  }

  .switch {
    float: right;
  }
}
.Group-quit {
  font-size: 32rpx;
  color: rgba(255, 93, 91, 1);
  text-align: center;
  height: 120rpx;
  line-height: 120rpx;
  position: absolute;
  left: 0;
  right: 0;
}
.personal-popover {
  width: 100%;
  height: 100%;
  background: #fff;
  position: fixed;
  bottom: 0;
  z-index: 2;
  color: rgba(39, 40, 50, 1);
  font-size: 32rpx;
  .popover-top {
    display: flex;
    align-items: center;
    height: 88rpx;
    justify-content: space-between;
    padding: 0 32rpx;
    .popover-create {
      font-size: 40rpx;
    }
    .popover-confirm {
      color: rgba(74, 170, 255, 1);
    }
  }
  .content-block {
    width: 686rpx;
    margin: 34rpx auto;
    .password-block,
    .information-block {
      border-radius: 15rpx;
      background: rgba(243, 244, 246, 1);
      input {
        height: 80rpx;
        padding: 0 15rpx;
      }
    }
    .information-block {
      margin-top: 30rpx;
      height: 300rpx;
      textarea {
        width: 100%;
        padding: 20rpx 20rpx;
        box-sizing: border-box;
      }
    }
  }
}
.Group-head {
  width: 100%;
  height: 112rpx;
  padding: 0 20rpx;
  line-height: 110rpx;
  box-sizing: border-box;
  .Group-head-name {
    float: left;
  }
  image {
    width: 110rpx;
    height: 110rpx;
    border-radius: 30rpx;
    margin-left: 30rpx;
  }
  .Group-return {
    width: 28rpx;
    height: 28rpx;
    float: right;
    margin-top: 44rpx;
  }
}
</style>
