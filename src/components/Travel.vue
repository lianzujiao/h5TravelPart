<template>
  <div class="travel">
    <van-row>
      <van-col span="24">
        <van-swipe :autoplay="3000" :height="180">
          <van-swipe-item v-for="(image, index) in SwipImgs" :key="index">
            <a :href="image.route">
              <img :src="image.src" height="180" width="100%" />
            </a>
          </van-swipe-item>
        </van-swipe>
      </van-col>
    </van-row>
    <section>
      <van-row class="pad-box pad-bottom-reset">
        <van-row class="pad-box pad-left-reset">
          <van-col span="8" class="text-left tra-tit">弘达推荐</van-col>
          <van-col span="1" class="tra-tit-sepa">|</van-col>
          <van-col span="8" class="text-left tra-tit-span">精品线路推荐</van-col>
        </van-row>
      </van-row>
    </section>
    <section>
      <van-row class="pad-box tra-de-box" v-for="(item,index) in travelLines" :key="index">
        <router-link class="tra-de-a" :to="{path:'travelDetail',query:{id:item.id}}">
          <van-col span="8" class="tra-de-imgbox">
            <img class="tra-de-img" :src="item.src" />
          </van-col>
          <van-col span="16" class="pad-box pad-top-reset pad-right-reset pad-bottom-reset">
            <van-row type="flex" class="colum-block" justify="space-between">
              <van-col span="24" class="tra-de-title text-left">{{item.title}}</van-col>
              <van-col span="24" class="tra-de-butonTag">
                <van-button
                  type="default"
                  size="mini"
                  v-for="(tag,index) in item.tags "
                  :key="index"
                >{{tag}}</van-button>
              </van-col>
              <van-row type="flex" justify="space-between">
                <van-col span="12" class="tra-de-sold text-left">已售{{item.sold}}</van-col>
                <van-col span="12" class="tra-de-price text-right">
                  ￥{{item.price}}
                  <span>起</span>
                </van-col>
              </van-row>
            </van-row>
          </van-col>
        </router-link>
        <div class="tra-de-hr"></div>
      </van-row>
    </section>
  </div>
</template>
<script>
import * as api from "../request/api";
import Axios from "axios";
export default {
  data() {
    return {
      name: "首页",
      SwipImgs: [
        // {route:'##', src: require("../assets/2.png") },
      ],
      travelLines: [
        // {
        //   src: require("../assets/2.png"),
        //   title: "[三星豪华空调船]漓江竹筏精华一日游",
        //   sold: "123",
        //   tags: ["一日游", "无购物"],
        //   price: "480"
        // }
      ]
    };
  },
  methods: {
    ChangeSwiImage(index) {},

    // @getSwiImage 获取轮播图
    getSwiImage() {
      api.banner({}).then(res => {
        if (res.code == 0) {
          res.rows.forEach(item => {
            this.SwipImgs.push({ route: item.route, src: item.imgurl });
          });
        }
      });
    },
    // @getTravelLines 旅游线路列表
    getTravelLines() {
      api.applist({}).then(res => {
        if (res.code == 0) {
          // console.log(res);
          res.rows.forEach(item => {
            this.travelLines.push({
              src: item.imgurl.split(",")[0],
              title: item.listtitle,
              tags: item.tags.split(","),
              price: item.marketPrice,
              sold: item.sellCount,
              id: item.id
            });
          });
        }
      });
    }
  },
  //   created() {},
  mounted() {
    document.title = "旅游";
    this.getSwiImage();
    this.getTravelLines();
  }
};
</script>
<style lang="scss" >
@import "scss/index.scss";
.travel {
  .van-button--mini {
    
    height: 20px;
    font-size: 11px;
    line-height: 20px;
  }
  .tra-tit {
    color: $color-text;
    font-size: $font-size-16;
    font-weight: $font-weight-bold;
    width: 72px;
  }
  .tra-tit-sepa {
    color: $color-text-span;
  }
  .tra-tit-span {
    color: $color-text-span;
    font-size: $font-size-14;
    padding: 2px 0 0 0;
  }

  .tra-de-box {
    position: relative;
    padding: 15px;
    @media screen and (max-width: 320px) {
      padding: 10px;
    }
    .tra-de-hr {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 1px;
      background: $color-separator;
    }
  }
  .tra-de-a {
    clear: both;
    width: 100%;
    height: 110px;
    display: block;
    z-index: 999;

    .tra-de-imgbox {
      height: 110px;
      width: 110px;
      overflow: hidden;
      border-radius: 10px;
      .tra-de-img {
        margin: -110px;
        max-width: 250px;
      }
    }
    @media screen and (max-width: 320px) {
      height: 101px;
      .tra-de-imgbox {
        width: 100px;
        height: 100px;
        .tra-de-img {
          margin: -100px;
        }
      }
      .colum-block {
        height: 100px;
      }
    }
  }
  .colum-block {
    flex-direction: column;
    height: 110px;
    .tra-de-title {
      color: $color-text;
      font-weight: $font-weight-bold;
      font-size: $font-size-15;
      letter-spacing: 2px;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .tra-de-butonTag {
      margin: 4% 0 0;
      display: flex;
      justify-content: flex-start;
      margin-top: -25px;
      button {
        border-color: $color-border;
        color: $color-button-text;
        padding: 0 3px;
        border-radius: 5px;
      }
    }
    .tra-de-sold {
      color: $color-text-span;
      font-size: $font-size-14;
    }
    .tra-de-price {
      color: $color-text-price;
      font-size: $font-size-18;
      span {
        color: $color-text-span;
        font-size: $font-size-14;
      }
    }
  }
}
</style>