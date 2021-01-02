<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.search }}</h2>
      <span class="sub-title">找到{{ songCount }}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              class="el-table__row"
              v-for="(item, index) in searchData"
              :key="index"
              @click="Playcurrentsong(item.id)"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <span v-if="item.mvid != 0" class="iconfont icon-mv"></span>
                  </div>
                  <span v-if="item.alias.length != 0">{{ item.alias[0] }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration | formatDuration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="(i, index) in playlists" :key="index">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ i.playCount | formatCount }}</span>
              </div>
              <img :src="i.coverImgUrl" alt="" />
              <span class="iconfont icon-play" @click="tggedan(i.id)"></span>
            </div>
            <p class="name">{{ i.name }}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div
            class="item"
            v-for="(i, index) in mvs"
            :key="index"
            @click="tpMV(i.id)"
          >
            <div class="img-wrap">
              <img :src="i.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ i.playCount | formatCount }}</div>
              </div>
              <span class="time">{{ i.duration | formatDuration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ i.name }}</div>
              <div class="singer">{{ i.artistName }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { searchkey } from "../assets/api/result";
import { PlayMusic } from "../assets/api/discovery";
export default {
  name: "result",
  data() {
    return {
      activeIndex: "songs",
      searchData: [],
      playlists: [],
      mvs: [],
      //搜索结果
      songCount: 0,
      type: 1,
    };
  },
  created() {
    this._searchkey();
  },
  methods: {
    Playcurrentsong(id) {
      PlayMusic(id)
        .then((res) => {
          let Playmusic = res.data[0].url;
          this.$parent.musicUrl = Playmusic;
        })
        .catch((err) => console.log(err));
    },
    _searchkey() {
      searchkey(this.$route.query.search, this.type).then((res) => {
        if (this.type === 1) {
          this.searchData = res.result.songs;
          this.songCount = res.result.songCount;
        } else if (this.type === 1000) {
          this.playlists = res.result.playlists;
          this.songCount = res.result.playlistCount;
        } else {
          this.mvs = res.result.mvs;
          this.songCount = res.result.mvCount;
        }
      });
    },
    tggedan(id) {
      this.$router.push("/playlist?q=" + id);
    },
    tpMV(id) {
      this.$router.push(`/mv?q=${id}`);
    },
  },
  watch: {
    activeIndex() {
      switch (this.activeIndex) {
        case "songs":
          this.type = 1;
          break;
        case "lists":
          this.type = 1000;
          break;
        case "mv":
          this.type = 1004;
          break;
        default:
          break;
      }
      this._searchkey(this.type);
    },
  },
};
</script>

<style>
.el-table__row {
  cursor: pointer;
}
</style>
