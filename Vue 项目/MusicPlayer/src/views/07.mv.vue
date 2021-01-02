<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="url" ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="icon" alt="" />
          </div>
          <span class="name">{{ mVInformations.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mVInformations.name }}</h2>
          <span class="date">发布：{{ mVInformations.publishTime }}</span>
          <span class="number"
            >播放：{{ mVInformations.playCount | formatCount }}次</span
          >
          <p class="desc">
            {{ mVInformations.desc }}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="hotCommentstotal != 0">
        <p class="title">
          精彩评论<span class="number">({{ hotCommentstotal }})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(i, index) in hotComments" :key="index">
            <div class="icon-wrap">
              <img :src="i.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ i.user.nickname }}: </span>
                <span class="comment">{{ i.content }}</span>
              </div>
              <div class="re-content" v-if="i.beReplied.length != 0">
                <span class="name">{{ i.beReplied[0].user.nickname }} </span>
                <span class="comment" v-if="i.beReplied.length != 0">{{
                  i.beReplied[0].content
                }}</span>
              </div>
              <div class="date">2020-02-12 17:26:11</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论<span class="number">({{ ComMentstotal }})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(i, index) in ComMents" :key="index">
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
                <span class="comment" v-if="i.beReplied.length != 0">{{
                  i.beReplied[0].content
                }}</span>
              </div>
              <div class="date">2020-02-12 17:26:11</div>
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
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs" v-for="(i, index) in RelatedMVurl" :key="index">
        <div class="items">
          <div class="item">
            <div class="img-wrap">
              <img :src="i.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ i.playCount }}</div>
              </div>
              <span class="time">{{ i.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ i.name }}</div>
              <div class="singer">{{ i.artistName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  goMV,
  RelatedMV,
  MVInformation,
  SingerInformation,
  MVReview,
} from "../assets/api/mvs";

export default {
  name: "mv",
  data() {
    return {
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 10,
      url: "",
      RelatedMVurl: [],
      mVInformations: [],
      icon: "",
      ComMents: [],
      ComMentstotal: 0,
      hotComments: [],
      hotCommentstotal: 0,
    };
  },
  created() {
    let mvid = this.$route.query.q;
    goMV(mvid).then((res) => {
      this.url = res.data.url;
    });
    RelatedMV(mvid).then((res) => {
      this.RelatedMVurl = res.mvs;
    });
    MVInformation(mvid).then((res) => {
      this.mVInformations = res.data;
      SingerInformation(this.mVInformations.artists[0].id).then((res) => {
        this.icon = res.artist.picUrl;
      });
    });
    MVReview(mvid, 10,this.page).then((res) => {
      this.ComMents = res.comments;
      this.ComMentstotal = res.total;
      this.hotComments = res.hotComments;
      this.hotCommentstotal = res.hotComments.length;
      this.total = res.total
      
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      MVReview(this.$route.query.q, 10,this.page).then((res) => {
      this.ComMents = res.comments;
      this.ComMentstotal = res.total;
      this.hotComments = res.hotComments;
      this.hotCommentstotal = res.hotComments.length;
    });
    },
  },
};
</script>

<style></style>
