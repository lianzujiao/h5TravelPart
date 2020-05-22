<template>
  <div class="comment">
    <van-row class="estimate pad-box margin-top-10">
      <van-row class="est-tit text-left">用户评价（{{total}}条）</van-row>
      <hr style="width:38%;margin:5px 0 25px" />
      <van-row v-for="(comment,index) in comments" :key="index">
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
        <van-row
          class="est-text-img text-left"
          type="flex"
          justify="flex-start"
          gutter="10"
          v-if="comment.images"
        >
          <van-col v-for="(item,index) in comment.images" span="6" v-lazy="item.thumb" :key="index">
            <van-image :src="item.thumb" fill="fill" @click="openImg(item.url)">
              <template v-slot:error>加载失败</template>
            </van-image>
          </van-col>
        </van-row>
        <hr />
      </van-row>
      <p style="font-size: 12px;
    margin: 0px;
    color: gray;">{{isLoading}}</p>
    </van-row>
  </div>
</template>
<script>
import * as api from "../request/api";
export default {
  name: "commentlist",
  data() {
    return {
      comments: [],
      total: 1,
      currentPage: 1,
      pageSize: 8,
      isLoading: ""
    };
  },
  methods: {
    getCommentList() {
      api
        .comment({
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          id: this.$route.query.id
        })
        .then(res => {
          if (res.code == 0) {
            this.total = res.total;
            res.rows.forEach(item => {
              this.comments.push({
                userId: item.userId,
                images: item.imgs,
                content: item.content,
                time: item.createTime
              });
            });
          }
          // this.loading = false;
        });
    },
    openImg(img) {
      //   console.log(img);
      this.$router.push({
        path: "/imgBrowser",
        query: { from: "comment", img: img }
      });
    },
    handleScroll(event) {
      //屏幕高度
      let clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      let scrollObj = document.querySelector("#app"); // 滚动区域
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.top;
      let scrollHeight = scrollObj.scrollHeight; //滚动条的总高度
      if (scrollTop + clientHeight == scrollHeight) {
        if (this.comments.length >= Number(this.total)) {
          // console.log(this.comments.length)
          this.isLoading = "没有更多了";
        } else {
          // console.log(this.comments.length)
          this.isLoading = "加载中";
          this.currentPage += 1;
          this.getCommentList();
        }
      }
      // console.log(scrollTop)
    }
  },
  mounted() {
    document.title = "用户评价";
    window.addEventListener("scroll", this.handleScroll, true);
    this.getCommentList();
    // this.onLoad();
  },

  beforeRouteEnter(to, from, next) {
    to.meta.keepAlive = true;
    if (from.path == "/imgBrowser") {
      next(vm => {
        document.body.scrollTop = vm.scrollTop;
      });
    } else {
      to.meta.keepAlive = false;
      next();
    }
  },
  // beforeRouteLeave(to, from, next) {

  //   if (to.path == "/imgBrowser") {
  //     from.meta.keepAlive = true;
  //     // console.log(document.body.scrollTop)
  //     this.scrollTop =
  //       document.documentElement.scrollTop || document.body.scrollTop;
  //   }
  //   else{
  //     from.meta.keepAlive=false;
  //   }
  //   next();
  // },

  activated() {
    // console.log("actived");
  },
  deactivated() {
    // console.log("deactived");
  }
};
</script>
<style lang="scss">
@import "scss/index.scss";
.comment {
  .estimate {
    .est-tit {
      font-weight: $font-weight-bold;
      line-height: 30px;
    }
    hr {
      border: none;
      border-top: 1px solid;
      border-color: $color-separator;
      margin: 0 0 30px;
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
      line-height: 20px;
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
      flex-wrap: wrap;
      img {
        // max-width: 25%;
        // max-height: 25%;
        width: 80px;
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
  /deep/.van-pagination {
    // width: 250px;

    .van-pagination__item {
      color: $color-border;
    }
    .van-pagination__item--active {
      background: $color-border;
      color: white;
    }
  }
}
</style>