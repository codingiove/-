<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <el-carousel-item v-for="(item, index) in banner" :key="index">
        <img :src="item.pic || item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
      <div class="items">
        <div
          class="item"
          v-for="(item, index) in Recommendedplaylist"
          :key="index"
        >
          <div class="img-wrap" @click="toPlayList(item.id)">
            <div class="desc-wrap">
              <span class="desc">{{ item.copywriter }}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in Latestmusics" :key="index">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play" @click="playmusic(item.id)"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{ item.name }}</div>
            <div class="singer">{{ item.song.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in Mvs" :key="index">
          <div class="img-wrap" @click="toMv(item.id)">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ item.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  GetBanner,
  PlayList,
  LatestMusic,
  PlayMusic,
  BroaDcastMv,
} from "../assets/api/discovery";
export default {
  name: "discovery",
  data() {
    return {
      //轮播图
      banner: [],
      //推荐歌单
      Recommendedplaylist: [],
      //最新音乐
      Latestmusics: [],
      //mv
      Mvs: [],
    };
  },
  //
  created() {
    GetBanner().then((res) => (this.banner = res.banners));
    PlayList().then((res) => (this.Recommendedplaylist = res.result));
    LatestMusic().then((res) => (this.Latestmusics = res.result));
    BroaDcastMv().then((res) => { this.Mvs = res.result });
  },
  methods: {
    playmusic(id) {
      PlayMusic(id).then((res) => {
        this.$parent.musicUrl = res.data[0].url; // 直接拿到父组件里的属性
        // this.$parent.url = res.data[0].url
      });
    },
    toPlayList(id) {
      this.$router.push(`/playlist?q=${id}`);
    },
    toMv(id) {
      this.$router.push(`/mv?q=${id}`);
    },
  },
};
</script>

<style></style>
