<template>
  <view>
    <common-head>
      <view slot="content" class="personal-word">
        {{ group_name }}
      </view>
      <image class="group_img" slot="unknown" :src="group_img" />
    </common-head>
    
  </view>
</template>

<script>
import CommonHead from "../../components/Common/CommonHead";
export default {
  components: { CommonHead },
  data() {
    return {
      group_ID: "", // 群 ID
      group_name: "", // 群名
      group_img: "", // 群头像
    };
  },
  onLoad(e) {
    this.group_ID = e.id;
    this.group_name = e.name;
    this.group_img = e.img;
    this.ClusterMember();
  },
  methods: {
    // 群成员
    ClusterMember() {
      this.$http({
        url: "Cluster/Member",
        data: {
          group_ID: this.group_ID,
        },
      }).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.personal-word{
  margin-left: 73rpx
}
.group_img{
  width: 68rpx;
  height: 68rpx;
  border-radius: 8rpx;
  vertical-align: middle;
}
</style>
