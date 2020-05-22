<template>
  <div class="imgBrowser">
    <div class="header text-left">
      <div class="icon-box">
        <van-icon name="arrow-left" @click="backPage()" />
      </div>
      <div class="index-box text-center" v-if="$route.query.from=='detail'">{{CurrentIndex}} /{{imgs.length}}</div>
    </div>
    <div class="img-show" v-if="$route.query.from=='detail'">
      <van-swipe
        @change="onChange"
        ref="swiper"
        :initial-swipe="value"
        :height="200"
        :show-indicators="false"
      >
        <van-swipe-item v-for="(image, index) in imgs" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="img-show" v-if="$route.query.from=='comment'">
      <img :src="commentImg"  >
    </div>
  </div>
</template>
<script>
import * as api from "../request/api";
export default {
  data() {
    return {
      imgs: [],
      value: Number(this.$route.query.index),
      CurrentIndex: 0,
      commentImg:this.$route.query.img,
      isRotate:true,
    };
  },
  methods: {
    backPage() {
      this.$router.go(-1);
    },
    getImgs() {
      api.detail({ id: this.$route.query.id }).then(res => {
        if (res.code == 0) {
          this.imgs = res.data.imgurl.split(",");
          document.title=res.data.listtitle;
        }
      });
    },

    onChange(index) {
      this.CurrentIndex = index + 1;
    },
    
  },
  mounted() {
    if (this.$route.query.from == "detail") {
      this.getImgs();
      this.CurrentIndex = Number(this.$route.query.index) + 1;
    } else {
      document.title="用户评价"
    
    }
  },
   
};
</script>
<style lang="scss">
@import "scss/index.scss";
.imgBrowser {

  .rotateImg{
    transform: rotate(90deg)
  }
  .header {
    line-height: 8vh;
    // background: $color-background;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 15px;
    display: flex;
    .icon-box {
      width: 50px;
    }
    .index-box {
      width: 64%;
    }
    /deep/.van-icon {
      width: 30px;
      line-height: 30px;
      border-radius: 50%;
      background-color: rgba(204, 201, 201, 0.6);
      padding-left: 6px;
      box-sizing: border-box;
    }
  }
  .img-show {
    margin-top: 45px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    img {
      width: 100%;
    }
  }
}
</style>