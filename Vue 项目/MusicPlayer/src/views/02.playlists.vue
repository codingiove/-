<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="Boutiqueplaylist.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{ Boutiqueplaylist.name }}
        </div>
        <div class="info">
          {{ Boutiqueplaylist.description }}
        </div>
      </div>
      <img :src="Boutiqueplaylist.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span
          class="item"
          :class="{ active: tag == '全部' }"
          @click="tag = '全部'"
          >全部</span
        >
        <span
          class="item"
          :class="{ active: tag == '欧美' }"
          @click="tag = '欧美'"
          >欧美</span
        >
        <span
          class="item"
          :class="{ active: tag == '华语' }"
          @click="tag = '华语'"
          >华语</span
        >
        <span
          class="item"
          :class="{ active: tag == '流行' }"
          @click="tag = '流行'"
          >流行</span
        >
        <span
          class="item"
          :class="{ active: tag == '说唱' }"
          @click="tag = '说唱'"
          >说唱</span
        >
        <span
          class="item"
          :class="{ active: tag == '摇滚' }"
          @click="tag = '摇滚'"
          >摇滚</span
        >
        <span
          class="item"
          :class="{ active: tag == '民谣' }"
          @click="tag = '民谣'"
          >民谣</span
        >
        <span
          class="item"
          :class="{ active: tag == '电子' }"
          @click="tag = '电子'"
          >电子</span
        >
        <span
          class="item"
          :class="{ active: tag == '轻音乐' }"
          @click="tag = '轻音乐'"
          >轻音乐</span
        >
        <!-- <span class="item" :class="{ active: tag == '影视原声' }"
          >影视原声</span
        > -->
        <span
          class="item"
          :class="{ active: tag == 'ACG' }"
          @click="tag = 'ACG'"
          >ACG</span
        >
        <!-- <span
          class="item"
          :class="{ active: tag == '怀旧' }"
          @click="tag = '怀旧'"
          >怀旧</span
        >
        <span
          class="item"
          :class="{ active: tag == '治愈' }"
          @click="tag = '治愈'"
          >治愈</span
        >
        <span
          class="item"
          :class="{ active: tag == '旅行' }"
          @click="tag = '旅行'"
          >旅行</span
        > -->
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div
            class="item"
            v-for="(item, index) in playlists"
            :key="index"
            @click="toPlayList(item.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount | formatCount }}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器  -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="20"
    >
    </el-pagination>
  </div>
</template>

<script>
import { BoutiqueSongList, Playlists } from "../assets/api/playlists.js";
export default {
  name: "recommend",
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      //精品歌单
      Boutiqueplaylist: [],
      //歌单列表
      playlists: [],
      //当前高亮
      tag: "全部",
    };
  },
  //监听器,观察数据改变
  watch: {
    tag() {
      this.page = 1;
      this.listData();
    },
  },
  created() {
    this.topData();
    this.listData();
  },
  methods: {
    toPlayList(id) {
      this.$router.push(`/playlist?q=${id}`);
    },
    topData() {
      BoutiqueSongList(this.tag).then((res) => {
        this.Boutiqueplaylist = res.playlists[0];
      });
    },
    listData() {
      Playlists(this.tag, this.page).then((res) => {
        this.total = res.total;
        this.playlists = res.playlists;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.listData();
    },
  },
};
</script>

<style></style>
