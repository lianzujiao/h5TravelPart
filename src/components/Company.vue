<template>
  <div class="company">
    <van-row class="pad-box agency text-left">
      <van-col span="24" class="banner">
        <img :src="bannerImg" alt />
      </van-col>
      <van-col span="24" class="agen-name">{{name}}</van-col>
      <van-col span="24" class="agen-rate">
        <van-rate v-model="rating" />
      </van-col>
      <van-col class="agen-address" span="24">
        <div class="agen-address-left">
          <img src="../assets/LocationIcon.png" alt srcset />
          <p>{{address}}</p>
        </div>
        <div class="agen-address-phone">
          <a :href="phone"><img src="../assets/phone_red.png" alt srcset /></a>
          
        </div>
      </van-col>
    </van-row>
    <van-row class="pad-box mar-top-10 lines">
      <van-col span="24" class="lines-tit text-left">全部线路</van-col>
      <van-col span="24" class="line-item">
        <van-row class="tra-de-box" v-for="(item,index) in items" :key="index">
          <router-link class="tra-de-a" :to="{path:'travelDetail',query:{id:item.id}}">
            <van-col span="8" class="tra-de-imgBox">
              <img class="tra-de-img" v-lazy="item.imgurl" alt />
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
                  <van-col span="12" class="tra-de-sold text-left">已售{{item.sellCount}}</van-col>
                  <van-col span="12" class="tra-de-price text-right">
                    ￥{{item.adultPrice}}
                    <span>起</span>
                  </van-col>
                </van-row>
              </van-row>
            </van-col>
          </router-link>
          <div class="tra-de-hr"></div>
        </van-row>
      </van-col>
    </van-row>
  </div>
</template>
<script>
import * as api from "../request/api";
export default {
  data() {
    return {
      id: "",
      bannerImg: "",
      name: "",
      address: "",
      rating: 0,
      phone: "",
      openHours: "",
      items: []
    };
  },
  methods: {
    getCompany() {
      api.company({ id: this.$route.query.id }).then(res => {
        if (res.code == 0) {
          this.id = res.data.id;
          this.bannerImg = res.data.imgurl;
          this.name = res.data.name;
          this.address = res.data.address;
          this.rating = res.data.rating;
          this.phone = 'tel:'+res.data.tel;
          document.title=this.name;
          res.data.items.forEach(item => {
           
            this.items.push({
              id: item.id,
              companyId: item.companyId,
              imgurl: item.imgurl,
              title: item.listtitle,
              tags: item.tags.split(","),
              adultPrice: item.adultPrice,
              marketPrice: item.marketPrice,
              sellCount: item.sellCount,
            });
          });
        }
      });
    }
  },
  mounted() {
    this.getCompany();
  }
};
</script>
<style lang="scss">
@import "scss/index.scss";
.company {
  background: $color-background;
  .mar-top-10 {
    margin-top: 10px;
  }
  .agency {
    padding-top: 15px;
    background: white;
    .banner {
      border-radius: 15px;
      overflow: hidden;
      img {
        max-width: 100%;
      }
    }
    .agen-name {
      font-weight: $font-weight-bold;
      line-height: 35px;
      padding-top: 5px;
    }
    .agen-rate {
      padding-bottom: 8px;
      border-bottom: 2px solid $color-background;
      /deep/.van-rate__icon {
        font-size: 18px;
      }
    }
    .agen-address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 45px;
      .agen-address-left {
        display: flex;
        color: $color-text-span;
        font-size: $font-size-14;
        align-items: center;
        img {
          display: block;
          width: 24px;
          height: 25px;
        }
        p {
          margin: 0;
        }
      }
      .agen-address-phone {
        display: flex;
        align-items: center;
        img {
          width: 25px;
        }
      }
    }
  }
  .lines {
    background: white;

    .lines-tit {
      font-weight: $font-weight-bold;
      line-height: 45px;
    }
    .line-item {
      .tra-de-box {
        position: relative;
        padding: 15px 0;
        @media screen and (max-width: 320px) {
          padding: 10px 0;
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
        .tra-de-imgBox {
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
          height: 90px;
          .tra-de-imgBox {
            width: 90px;
            height: 90px;
            .tra-de-img {
              margin: -90px;
            }
          }
          .colum-block {
            height: 90px;
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
          @media screen and(max-width:320px){
            margin:0px;
          }
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
  }
}
</style>