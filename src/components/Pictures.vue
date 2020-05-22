<template>
  <div class="pics">
    <div class="layer-first">
      <div class="header">
        <div class="head text-left">
          <div class="hea-back">
            <van-icon name="arrow-left" @click="backPage()" />
          </div>
          <div class="hea-img">{{imgs.length}}张图片</div>
        </div>
      </div>
      <div class="img" v-for="(img,index) in imgs" :key="index">
        <van-image :src="img" alt fit="fill" @click="openImg(index)" />
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "../request/api";
export default {
  data() {
    return {
      id: this.$route.query.id,
      imgs: []
    };
  },
  methods: {
    getImgs() {
      api.detail({ id: this.id }).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.imgs = res.data.imgurl.split(",");
          document.title=res.data.listtitle
        }
      });
    },
    openImg(CurrentIndex) {
      console.log(CurrentIndex);
      this.$router.push({
        path: "/imgBrowser",
        query: { from: "detail", id: this.id, index: CurrentIndex }
      });
    },
    backPage() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.getImgs();
  }
};
</script>
<style lang="scss">
@import "scss/index.scss";
.pics {
  .layer-first {
    display: flex;
    flex-wrap: wrap;
    .img {
      width: 48%;
      padding: 3px;
      /deep/.van-image {
        img {
          max-height: 90px;
        }
      }
    }
    .header {
      width: 100%;
      height: 45px;

      .head {
        position: fixed;
        top: 0;
        left: 0;
        height: 45px;
        display: flex;
        width: 100%;
        background: $color-background;
        z-index: 9;
        .hea-back {
          line-height: 45px;
          width: 43%;
          box-sizing: border-box;
          padding: 0 10px;
        }
        .hea-img {
          line-height: 45px;
          width: 57%;
        }
      }
    }
  }
}
</style>