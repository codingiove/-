<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <!-- v-for="(i,index) in playlist" :key="index" -->
      <div class="info-wrap">
        <p class="title">{{ playlist.name }}</p>
        <div class="author-wrap">
          <img class="avatar" :src="playlist.creator.avatarUrl" alt="" />
          <span class="name">{{ playlist.creator.nickname }}</span>
          <span class="time">{{ playlist.createTime }}创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item, index) in playlist.tags" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">
            {{ playlist.description }}
          </span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <tr class="el-table__row" v-for="(i, index) in tracks" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="img-wrap" @click="playMusics(i.id)">
                  <img :src="i.al.picUrl" alt="" />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ i.name }}</span>
                    <span class="iconfont icon-mv"></span>
                  </div>
                  <!-- <span>电视剧加油练习生插曲</span> -->
                </div>
              </td>
              <td>{{ i.ar[0].name }}</td>
              <td>{{ i.name }}</td>
              <td>{{ i.dt | formatDuration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="评论(66)" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">
            精彩评论<span class="number">{{ Numberofreviews }}</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(i, index) in Songreviews" :key="index">
              <div class="icon-wrap">
                <img :src="i.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ i.user.nickname }} </span>
                  <span class="comment">{{ i.content }}</span>
                </div>
                <div class="re-content" v-if="i.beReplied.length != 0">
                  <span class="name">{{ i.beReplied[0].user.nickname }} </span>
                  <span class="comment">{{ i.beReplied[0].content }}</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">
            最新评论<span class="number">({{ total }})</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(i, index) in comments" :key="index">
              <div class="icon-wrap">
                <img :src="i.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ i.user.nickname }} </span>
                  <span class="comment">{{ i.content }}</span>
                </div>
                <div class="re-content" v-if="i.beReplied.length != 0">
                  <span class="name">{{ i.beReplied[0].user.nickname }} </span>
                  <span class="comment">{{ i.beReplied[0].content }}</span>
                </div>
                <div class="date">{{i.time}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="5"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  PlaylistDetailsPage,
  Songreviews,
  LatestEvaluation,
} from "../assets/api/playlist";
import { PlayMusic } from "../assets/api/discovery";
export default {
  name: "playlist",
  data() {
    return {
      activeIndex: "1",
      // 总条数
      total: 0,
      // 页码
      page: 1,
      playlist: {},
      tracks: [],
      Songreviews: [],
      Numberofreviews: 0,
      comments: [],
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this._LatestEvaluation();
    },
    _LatestEvaluation() {
      LatestEvaluation(this.$route.query.q, 10, this.page).then((res) => {
        this.comments = res.comments;
        this.total = res.total;
      });
    },
    playMusics(id) {
      PlayMusic(id).then((res) => {
        this.$parent.musicUrl = res.data[0].url;
      });
    },
  },
  created() {
    PlaylistDetailsPage(this.$route.query.q, this.page).then((res) => {
      this.playlist = res.playlist;
      this.tracks = res.playlist.tracks;
    });
    Songreviews(this.$route.query.q, 2).then((res) => {
      this.Numberofreviews = res.total;
      this.Songreviews = res.hotComments;
    });
    this._LatestEvaluation();
  },
};
</script>

<style></style>
