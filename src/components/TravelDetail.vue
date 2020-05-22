<template>
  <div class="travel-detail">
    <!-- 轮播图 -->
    <section>
      <van-row>
        <van-col span="24">
          <van-swipe @change="onChange" :autoplay="3000" :height="180">
            <van-swipe-item v-for="(item,index) in siwpeImgs" :key="index" v-lazy="item">
              <router-link :to="{path:'/pictures',query:{id:id}}">
                <van-image :src="item" fill="fill" width="100%">
                  <template v-slot:error>加载失败</template>
                </van-image>
              </router-link>
            </van-swipe-item>
            <div class="custom-indicator" slot="indicator">{{ current + 1 }}/{{siwpeImgs.length}}</div>
          </van-swipe>
        </van-col>
      </van-row>
    </section>

    <section class="content">
      <van-row class="pad-box line-mes" type="flex" justify="space-between">
        <van-col span="24" class="text-left line-mes-title">{{lineDetails.title}}</van-col>
        <van-col span="24" class="text-left line-mes-subtitle">{{lineDetails.subtitle}}</van-col>
        <van-col span="24" class="line-mes-tags">
          <van-button
            type="default"
            size="mini"
            v-for="(tag,index) in lineDetails.tags "
            :key="index"
          >{{tag}}</van-button>
        </van-col>
        <van-col span="24" class="lines-mes-sale">
          <van-row type="flex" justify="space-between">
            <van-col span="12" class="lines-mes-sold text-left">已售{{lineDetails.sold}}件</van-col>
            <van-col span="12" class="lines-mes-price text-right">
              ￥{{lineDetails.adultPrice}}
              <span>起/人</span>
            </van-col>
          </van-row>
        </van-col>
      </van-row>
      <van-row class="pad-box agency margin-top-10" type="flex" justify="space-between">
        <van-col span="12" class="text-left agency-tit">
          <router-link
            :to="{path:'/company',query:{id:lineDetails.companyId}}"
          >{{lineDetails.company}}</router-link>
        </van-col>
        <van-col span="12" class="text-right">
          <a :href="lineDetails.phone">
            <img src="../assets/phone_red.png" alt width="20px" />
          </a>
        </van-col>
      </van-row>
      <van-row class="estimate pad-box margin-top-10" v-if="comment.total">
        <van-row class="est-tit text-left">用户评价（{{comment.total||0}}条）</van-row>
        <hr />
        <van-row>
          <van-row type="flex" justify="flex-start">
            <van-col span="4" class="est-avator">
              <img src="../assets/default-avator.png" />
            </van-col>
            <van-col span="20">
              <p class="est-name text-left">用户{{comment.userId}}</p>
              <p class="est-time text-left">{{comment.time}}</p>
            </van-col>
          </van-row>
          <van-row class="est-text text-left" v-if="comment.content!=''">{{comment.content}}</van-row>
          <van-row class="est-text-img text-left">
            <van-col v-for="(item,index) in comment.images" span="6" v-lazy="item" :key="index">
              <van-image :src="item.thumb" fill="fill" @click="openImg(item.url)">
                <template v-slot:error>加载失败</template>
              </van-image>
            </van-col>
          </van-row>
          <van-row class="est-more">
            <van-button
              type="default"
              size="large"
              :to="{path:'commentList',query:{id:$route.query.id}}"
            >
              查看全部评价
              <span class="btn-more"></span>
            </van-button>
          </van-row>
        </van-row>
      </van-row>
    </section>

    <section class="trip">
      <van-row class="pad-box text-left trip-intro">
        <van-col class="trip-tit trip-intro-tit" span="24">行程介绍</van-col>
        <van-col span="24" v-html="lineDetails.content" class="trip-text"></van-col>
      </van-row>
      <van-row class="pad-box text-left trip-fee margin-top-10">
        <van-col span="24" class="fee-tit trip-tit">费用说明</van-col>
        <van-col class="trip-fee-text" v-html="lineDetails.feeDesc"></van-col>
      </van-row>
      <van-row class="pad-box text-left cancel margin-top-10">
        <van-col class="can-tit trip-tit" span="24">预定须知</van-col>
        <van-col span="24" v-html="lineDetails.bookNotice" class="trip-text"></van-col>
      </van-row>
      <van-row class="pad-box text-left cancel margin-top-10">
        <van-col class="can-tit trip-tit" span="24">退订须知</van-col>
        <van-col span="24" v-html="lineDetails.refundNotice" class="trip-text"></van-col>
      </van-row>
    </section>
    <section class="bottom">
      <van-row class="bot-mian">
        <van-col span="12" class="bot-main-left">
          <a :href="lineDetails.phone">
            <img src="../assets/phone_gray.png" alt />
            <p>咨询客服</p>
          </a>
        </van-col>
        <van-col span="12" class="bot-main-right">
          <router-link :to="{path:'/reserve',query:{id:id}}">
            <van-button size="large">立即预定</van-button>
          </router-link>
        </van-col>
      </van-row>
    </section>
  </div>
</template>
<script>
import * as api from "../request/api";
export default {
  data() {
    return {
      id: this.$route.query.id,
      current: 0,
      siwpeImgs: [], //轮播图数据，
      lineDetails: {}, //线路基本信息
      comment: {} //评论
    };
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
    getLineDetail() {
      api.detail({ id: this.$route.query.id }).then(res => {
        if (res.code == 0) {
          // console.log(res)
          this.siwpeImgs = res.data.imgurl.split(",");
          this.lineDetails = {
            company: res.data.companyName,
            companyId: res.data.companyId,
            phone: 'tel:'+ res.data.tel,
            title: res.data.title,
            listTitle:res.data.listtitle,
            subtitle: res.data.subtitle,
            tags: res.data.tags.split(","),
            sold: res.data.sellCount,
            price: res.data.marketPrice,
            adultPrice:res.data.adultPrice,
            childPrice:res.data.childPrice,
            feeDesc: res.data.feeDesc,
            bookNotice: res.data.bookNotice,
            refundNotice: res.data.refundNotice,
            content: res.data.content
          };
          document.title=this.lineDetails.listTitle;
        }
      });
    },
    getComment() {
      api
        .comment({ pageSize: 1, pageNum: 1, id: this.$route.query.id })
        .then(res => {
          if (res.code == 0) {
            // console.log(res)
            res.rows.forEach(item => {
              this.comment = {
                userId: item.userId,
                images: item.imgs,
                content: item.content,
                time: item.createTime,
                total: res.total
              };
            });
          }
        });
    },
    openImg(img) {
      //   console.log(img);
      this.$router.push({ path: "/imgBrowser", query: {from:'comment', img: img } });
    }
  },
  mounted() {
    this.getLineDetail();
    this.getComment();
  }
};
</script>
<style lang="scss">
@import "scss/index.scss";
.travel-detail {
  .margin-top-10 {
    margin-top: 10px;
  }
  p {
    margin: 0;
  }
  .custom-indicator {
    padding: 2px 5px;
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 2%;
    right: 2%;
    font-size: $font-size-12;
    color: white;
  }
  .content {
    background: $color-background;
  }
  .line-mes {
    background: white;
    flex-direction: column;
    // min-height: 150px;
    box-sizing: border-box;
    .line-mes-title {
      color: $color-text;
      font-weight: $font-weight-bold;
      font-size: $font-size-15;
      letter-spacing: 1px;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    .line-mes-subtitle {
      color: $color-text-span;
      font-size: $font-size-14;
      line-height: 19px;
      margin-top: 5px;
    }
    .line-mes-tags {
      display: flex;
      justify-content: flex-start;
      margin: 10px 0;
      button {
        border-color: $color-border;
        color: $color-button-text;
        padding: 0 3px;
        border-radius: 5px;
      }
    }
    .lines-mes-sale {
      .lines-mes-sold {
        color: $color-text-span;
        font-size: $font-size-14;
      }
      .lines-mes-price {
        color: $color-text-price;
        font-size: $font-size-18;
        span {
          color: $color-text-span;
          font-size: $font-size-14;
        }
      }
    }
  }

  .agency {
    background: white;
    .agency-tit {
      color: $color-text;
      font-size: $font-size-16;
      font-weight: $font-weight-bold;
    }
  }

  .estimate {
    background: white;
    .est-tit {
      font-weight: $font-weight-bold;
      line-height: 30px;
    }
    hr {
      border: none;
      border-top: 1px solid;
      border-color: $color-separator;
    }
    .est-avator {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 40px;
        //   background: black;
      }
    }
    .est-name {
      margin: 0;
      line-height: 28px;
      font-size: $font-size-14;
    }
    .est-time {
      margin: 0;
      line-height: 20px;
      font-size: $font-size-12;
      color: $color-separator;
    }
    .est-text {
      margin: 8px 0;
      line-height: 23px;
      font-size: $font-size-14;
    }
    .est-text-img {
      margin: 0px 0 10px;
      img {
        // max-width: 25%;
        // max-height: 25%;
      }
    }
    .est-more {
      button {
        color: $color-text-span;
        font-size: $font-size-14;
        background: $color-background;
        border: none;
        height: 35px;
        line-height: 35px;
        .btn-more {
          display: inline-block;
          border: 5px solid transparent;
          border-left-color: $color-text-span;
          //    border-color: $color-separator;
        }
      }
    }
  }
  .trip {
    background: $color-background;
    padding-top: 10px;
    .trip-intro {
      background: white;
    }
    .trip-tit {
      font-weight: $font-weight-bold;
      line-height: 30px;
      padding-bottom: 10px;
    }
    .trip-text {
      line-height: 24px;
      font-size: $font-size-14;
      text-indent: 28px;
      letter-spacing: 1px;
    }
    .trip-fee-text {
      font-size: $font-size-14;
      line-height: 24px;
      table {
        tbody {
          tr {
            border-bottom: 1px solid black;
            &:nth-child(2n) {
              background: #efefef;
            }
            &:nth-child(2n+1) {
              background: #f1f1f3;
            }
            th {
              width: 50px;
              letter-spacing: 1px;
              line-height: 24px;
            }
            td {
              p {
                margin: 0;
                line-height: 24px;
                letter-spacing: 1px;
                // text-indent: 28px;
              }
            }
          }
        }
      }
    }
    .trip-main {
      letter-spacing: 1px;
      font-size: $font-size-15;
      line-height: 22px;
      color: $color-text-span;
    }
    .trip-fee {
      background: white;
      .fee-tit {
        border-bottom: 1px solid $color-background;
      }
      .fee-content {
        letter-spacing: 1px;
        .fee-secTitle {
          color: $color-text-price;
          line-height: 40px;
        }
        .fee-cont-main {
          font-size: $font-size-15;
          line-height: 22px;
          color: $color-text-span;
        }
      }
    }
    .cancel {
      background: white;
      .can-tit {
        border-bottom: 1px solid $color-background;
      }
      .can-main {
        padding-top: 15px;
      }
    }
  }
  .bottom {
    background: $color-background;
    padding-top: 10px;
    .bot-mian {
      background: white;
      padding: 5px 10px;
      .bot-main-left {
        a {
          display: block;
          img {
            width: 20px;
          }
          p {
            font-size: $font-size-14;
            line-height: 25px;
          }
        }
      }
      .bot-main-right {
        text-align: right;
        a {
          button {
            background: $color-text-price;
            color: white;
          }
          /deep/.van-button--large {
            width: 65%;
            height: 45px;
            line-height: 43px;
            border-radius: 10px;
          }
        }
      }
    }
  }
}
</style>