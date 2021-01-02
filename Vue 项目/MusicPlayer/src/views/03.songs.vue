<template>
  <div
    class="songs-container"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <div class="tab-bar ">
      <span class="item" @click="tag = 0" :class="{ active: tag == 0 }"
        >全部</span
      >
      <span class="item" @click="tag = 7" :class="{ active: tag == 7 }"
        >华语</span
      >
      <span class="item" @click="tag = 96" :class="{ active: tag == 96 }"
        >欧美</span
      >
      <span class="item" @click="tag = 8" :class="{ active: tag == 8 }"
        >日本</span
      >
      <span class="item" @click="tag = 16" :class="{ active: tag == 16 }"
        >韩国</span
      >
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr
          class="el-table__row"
          v-for="(item, index) in latestMusic.slice(0, 24)"
          :key="index"
        >
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <el-image :src="item.album.picUrl" alt="" lazy />
              <span
                class="iconfont icon-play"
                @click="bofanggequ(item.id)"
              ></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span class="iconfont icon-mv"></span>
              </div>
            </div>
          </td>
          <td>{{ item.album.artists[0].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration | formatDuration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { LatestMusic, Sing } from "../assets/api/songs";
export default {
  name: "songs",
  data() {
    return {
      //最新音乐
      latestMusic: [],
      loading: true,
      data: [],
      tag: "0",
    };
  },
  watch: {
    tag() {
      this.MUsuc();
    },
  },
  created() {
    this.MUsuc();
  },
  methods: {
    MUsuc() {
      LatestMusic(this.tag).then((res) => {
        console.log(res);
        this.latestMusic = res.data;
        this.loading = false;
      });
    },

    bofanggequ(id) {
      Sing(id).then((res) => {
        this.$parent.musicUrl = res.data[0].url;
      });
    },
  },
};
</script>

<style></style>
