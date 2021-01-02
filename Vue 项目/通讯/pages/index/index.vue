<template>
  <view class="content">
    <view class="title">欢迎进入聊天室</view>
    <view class="head">
      <!-- 存储上传图片 -->
      <image-cropper
        :src="tempFilePath"
        @confirm="confirm"
        @cancel="cancel"
      ></image-cropper>
      <!-- 裁剪后的图片 -->
      <image
        :src="cropFilePath"
        mode="aspectFill"
        class="head-img"
        @tap="upload"
      ></image>
      <image src="../../static/down.png" mode="aspectFit" class="down"></image>
    </view>
    <input
      type="text"
      class="user"
      placeholder="请取一个名字"
      v-model="name"
      placeholder-style="color:#999;font-weight:400;font-size:32rpx"
    />
    <view class="join" @tap="submit">加入</view>
    <!-- 弹出层 -->
  </view>
</template>

<script>
import ImageCropper from "../ling-imgcropper/ling-imgcropper";
export default {
  components: { ImageCropper },
  data() {
    return {
      name: "", // 创建的名字
      tempFilePath: "", // 存储上传图片
      cropFilePath: "../../static/images/m.png", // 裁剪后的图片
    };
  },

  methods: {
    // 裁剪图片
    confirm(e) {
      // this.tempFilePath = "";
      this.cropFilePath = e.detail.tempFilePath;
    },

    // 上传头像
    upload() {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        // 存储上传图片
        success: (res) => (this.tempFilePath = res.tempFilePaths.shift()),
      });
    },
    // 取消裁剪
    cancel() {
      this.tempFilePath = "";
    },
    // 进入聊天室
    submit() {
      if (this.name.length > 0) {
        uni.navigateTo({
          url: `../chatroom/chatroom?name=${this.name}&img=${this.cropFilePath}`,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: rgba(255, 131, 60, 1);
  line-height: 50rpx;
  padding-bottom: 116rpx;
}
.head {
  width: 144rpx;
  height: 144rpx;
  position: relative;
  .head-img {
    width: 144rpx;
    height: 144rpx;
    border-radius: 50%;
  }
  .down {
    position: absolute;
    opacity: 0.6;
    right: -48rpx;
    top: 48rpx;
    width: 48rpx;
    height: 48rpx;
  }
}
.user {
  margin-top: 54rpx;
  padding: 0 24rpx;
  width: 440rpx;
  height: 96rpx;
  background: rgba(242, 242, 242, 1);
  border-radius: 24rpx;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: rgba(25, 29, 35, 1);
}
.join {
  margin-top: 180rpx;
  width: 200rpx;
  height: 200rpx;
  background: rgba(255, 131, 60, 1);
  box-shadow: 0px 36rpx 68rpx -8rpx rgba(255, 131, 60, 0.5);
  border-radius: 50%;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  line-height: 200rpx;
  color: rgba(255, 255, 255, 1);
}
.modify {
  position: fixed;
  left: 0;
  bottom: -800rpx;
  width: 100%;
  height: 800rpx;
  z-index: 1000;
  background: #fff;
  border-radius: 48rpx 48rpx 0px 0px;
}
.modfiy-mian {
  padding: 80rpx 36rpx;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  .us-img {
    flex: auto;
    width: 20%;
    text-align: center;
    image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 18rpx;
    }
    .ddd {
      display: inline-block;
      justify-content: center;
      margin-bottom: 40rpx;
      width: 16rpx;
      height: 16rpx;
      background: rgba(255, 131, 60, 1);
      border-radius: 50%;
    }
  }
}
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
