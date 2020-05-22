<template>
  <div class="reserve">
    <van-row class="pad-box travel-line text-left" type="flex" justify="space-between">
      <van-col span="24" class="line-title">{{line.listTitle}}</van-col>
      <van-col span="24" class="line-span">{{line.title}}</van-col>
      <van-col span="24" class="line-tags">
        <van-button
          type="default"
          size="mini"
          v-for="(item,index) in line.tags"
          :key="index"
        >{{item}}</van-button>
      </van-col>
    </van-row>
    <van-row class="pad-box mar-top select-time" type="felx" justify="space-between">
      <van-col span="24" class="time-tit text-left">选择出行时间</van-col>
      <van-col span="24">
        <div class="scCalendar">
          <div class="months">
            <div
              v-for="(month,index) in months"
              :key="index"
              @click="selectMonth(month)"
              class="month"
              :class="{'mon-active':month.selected}"
            >{{month.text}}月</div>
          </div>
          <div class="calendar_content">
            <ul class="week">
              <li v-for="item in weeks">{{item}}</li>
            </ul>
            <ul class="day">
              <li
                v-for="item in dayList"
                :class="{marginRight0:item.marginRight0,'red-text':item.specialDate,'disabled-text':item.disClick,'is-active':item.isActive}"
                @click="getDayPrice(item,dayList)"
              >
                {{item.text}}
                <br />
                <span v-if="item.text">￥{{item.adultPrice}}</span>
              </li>
            </ul>
          </div>
        </div>
      </van-col>
    </van-row>
    <van-row class="pad-box mar-top personNumber text-left" type="flex" justify="space-between">
      <van-col span="24" class="per-tit">出行人数</van-col>
      <van-col span="24" class="per-adult">
        <div class="per-adult-tit">成人</div>
        <div class="per-adult-price">￥{{selectedPrice.adult}}/人</div>
        <div class="per-adult-number">
          <van-stepper v-model="form.adult" />
        </div>
      </van-col>
      <van-col span="24" class="per-child">
        <div class="per-child-msg">
          <div class="per-child-tit">儿童</div>
          <div class="per-child-price">￥{{selectedPrice.child}}/人</div>
          <div class="per-child-span">身高为1.2～1.5米的,请购买儿童票;超过1.5米的,请购买全价票</div>
        </div>

        <div class="per-child-number">
          <van-stepper v-model="form.child" min="0" />
        </div>
      </van-col>
    </van-row>
    <van-row class="pad-box mar-top person-msg text-left pad-bottom-reset">
      <van-col span="24" class="per-tit">联系人信息</van-col>
      <van-col span="24">
        <van-row class="per-name name-phone">
          <van-col class="per-name-tit name-phone-tit" span="6">联系姓名</van-col>
          <van-col class="per-name-input name-phone-input" span="18">
            <van-field
              v-model="form.contact"
              placeholder="请输入联系人姓名"
              clearable
              ref="inputName"
              :error-message="errorName"
              @blur="varifyName"
            />
          </van-col>
        </van-row>
      </van-col>
      <van-col span="24">
        <van-row class="per-phone name-phone">
          <van-col class="per-phone-tit name-phone-tit" span="6">手机号码</van-col>
          <van-col class="per-phone-input name-phone-input" span="18">
            <van-field
              v-model="form.phone"
              placeholder="请输入手机号码"
              clearable
              ref="inputPhone"
              :error-message="errorPhone"
              @blur="varifyPhone()"
            />
          </van-col>
        </van-row>
      </van-col>
    </van-row>
    <van-row class="pad-box mar-top bill text-left">
      <van-col span="4" class="bill-tit">合计:</van-col>
      <van-col
        span="7"
        class="bill-count"
      >￥{{selectedPrice.adult*form.adult+selectedPrice.child*form.child}}</van-col>
      <van-col span="5" class="bill-tit-service">
        <a :href="this.line.phone">
          <div class="img-block">
            <img src="../assets/phone_gray.png" alt width="20" height="20" />
          </div>
          <p class="text-center">咨询客服</p>
        </a>
      </van-col>
      <van-col span="8" class="bill-submit">
        <van-button size="large" @click="submit()">确定</van-button>
      </van-col>
    </van-row>
  </div>
</template>
<script>
import * as api from "../request/api";
import Calendar from "vue-calendar-component";
export default {
  components: {
    Calendar: Calendar
  },
  data() {
    return {
      line: {},
      id: this.$route.query.id,
      weeks: ["日", "一", "二", "三", "四", "五", "六"],
      // specialDate: [],
      dayList: [],
      currentYear: "",
      currentMonth: "",
      currentDay: "",
      months: [],
      selectTime: {
        year: 0,
        month: 0,
        day: 0
      },
      selectedPrice: {
        adult: "",
        child: ""
      },
      form: {
        adult: 0,
        child: 0,
        contact: "",
        date: "",
        id: 0,
        phone: ""
      },
      showTips: false, //儿童标准提示,
      errorName: "",
      errorPhone: ""
    };
  },
  methods: {
    //获取线路基本情况
    getLine() {
      api.detail({ id: this.id }).then(res => {
        // console.log(res);
        if (res.code == 0) {
          this.line = {
            listTitle: res.data.listtitle,
            title: res.data.title,
            tags: res.data.tags.split(","),
            price: res.data.marketPrice,
            adultPrice: res.data.adultPrice,
            childPrice: res.data.childPrice,
            phone: "tel:" + res.data.tel
          };
          document.title = this.line.listTitle;
        }
        this.setTime();
        this.getSpecialPrice();
      });
    },

    //获取特殊节假日情况
    getSpecialPrice() {
      let specialPrice = [];
      api.special({ id: this.id }).then(res => {
        if (res.code == 0) {
          res.rows.forEach(item => {
            specialPrice.push({
              time: item.date.split("-"),
              adultPrice: item.adultPrice,
              childPrice: item.childPrice
            });
          });

          //找出特殊时日并修改价格
          this.dayList.map(item => {
            let monthStr = item.month;
            let textStr = item.text;
            monthStr =
              item.month.toString().length == 1 ? `0${item.month}` : item.month;
            textStr =
              item.text.toString().length == 1 ? `0${item.text}` : item.text;
            specialPrice.forEach(i => {
              if (
                i.time[0] == item.year &&
                i.time[1] == monthStr &&
                i.time[2] == textStr
              ) {
                item.adultPrice = i.adultPrice;
                item.childPrice = i.childPrice;
                item.specialDate = true;
              }
            });
          });
        }
      });
    },

    //选中某天时
    getDayPrice(item, dayList) {
      if (item.disClick == true) {
        return false;
      }
      dayList.forEach(day => {
        day.isActive = false;
      });
      item.isActive = true;
      this.selectTime.day = item.text;
      this.selectedPrice.adult = item.adultPrice;
      this.selectedPrice.child = item.childPrice;
    },

    //设置时间
    setTime() {
      let date = new Date();
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
      this.selectTime.day = date.getDate();
      this.currentDay = date.getDate();
      this.calDay(this.currentYear, this.currentMonth);
      this.getMonths(this.currentYear, this.currentMonth);
    },

    //计算指定月份的天数
    calDay(year, month) {
      var oDate = new Date();
      //setFullYear(year,month,day) 方法用于设置年份,返回调整过的日期的毫秒表示。
      oDate.setFullYear(year, month - 1, 1);
      oDate.setDate(1); //设置一个月中的第一天
      var oNow = oDate.getDay(); //当前月的第一天是星期几
      var dayNum = 0; //指定月份的天数
      if (
        month == 1 ||
        month == 3 ||
        month == 5 ||
        month == 7 ||
        month == 8 ||
        month == 10 ||
        month == 12
      ) {
        dayNum = 31;
      } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        dayNum = 30;
      } else if (month == 2 && this.isLeaYear(year)) {
        dayNum = 29;
      } else {
        dayNum = 28;
      }
      var SumDayLiNum = 0; //总共的格子数
      var lastNum = (dayNum - (7 - oNow)) % 7; //最后剩余的数
      lastNum = lastNum == 0 ? 0 : 7;
      SumDayLiNum = 7 + parseInt((dayNum - (7 - oNow)) / 7) * 7 + lastNum;
      this.showDayList(dayNum, SumDayLiNum, oNow, year, month);
    },
    //判断是否是闰年
    isLeaYear(year) {
      if (year % 4 == 0 && year % 100 != 0) {
        return true;
      } else {
        if (year % 400 == 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    //显示当前日历内容
    showDayList(dayNum, SumDayLiNum, oNow, year, month) {
      this.dayList = [];
      let rows = parseInt(SumDayLiNum / 7);
      let cols = 7;
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          if (j == cols - 1) {
            this.dayList.push({
              year: year,
              month: month,
              text: "",
              marginRight0: true,
              price: this.line.price,
              adultPrice: this.line.adultPrice,
              childPrice: this.line.childPrice,
              specialDate: false,
              isActive: false
            });
          } else {
            this.dayList.push({
              year: year,
              month: month,
              text: "",
              marginRight0: false,
              price: this.line.price,
              adultPrice: this.line.adultPrice,
              childPrice: this.line.childPrice,
              specialDate: false,
              isActive: false
            });
          }
        }
      }
      for (var z = 1; z <= dayNum; z++) {
        this.dayList[oNow].text = z;
        oNow++;
      }
      this.setDisabledClick();
    },

    //设置不可点击的时间
    setDisabledClick() {
      this.dayList.forEach(item => {
        if (
          Number(item.year) == this.currentYear &&
          Number(item.month) <= this.currentMonth &&
          Number(item.text) < this.currentDay
        ) {
          item.disClick = true;
        } else {
          if (
            Number(item.year) == this.currentYear &&
            Number(item.month) == this.currentMonth &&
            Number(item.text) == this.currentDay
          ) {
            item.isActive = true;
            this.selectedPrice.adult = item.adultPrice;
            this.selectedPrice.child = item.childPrice;
          }
          item.disClick = false;
        }
      });
    },
    //显示月份列表
    getMonths(year, month) {
      for (let i = 0; i < 3; i++) {
        this.months.push({
          year: this.currentYear,
          text: month + i,
          selected: false
        });
        if (this.months[i].text > 12) {
          this.months[i].year += 1;
          this.months[i].text -= 12;
        }
        this.months[0].selected = true;
        this.calDay(this.months[0].year, this.months[0].text);

        // console.log(this.selectTime);
        this.selectTime.year = this.months[0].year;
        this.selectTime.month = this.months[0].text;
      }
    },

    //点击选择不同月份时
    selectMonth(month) {
      // this.getLine()
      this.months.forEach(item => {
        item.selected = false;
      });
      month.selected = true;
      this.calDay(month.year, month.text);
      this.selectTime.year = month.year;
      this.selectTime.month = month.text;
      this.getSpecialPrice();

      //修改月份定位到当月可选的第一天

      for (let i = 0; i < this.dayList.length; i++) {
        if (this.dayList[i].text != "") {
          this.getDayPrice(this.dayList[i], this.dayList);
          break;
        }
      }
    },

    changeShowTips() {
      this.showTips = !this.showTips;
    },

    //验证手机号码
    varifyPhone() {
      if (this.form.phone == "") {
        this.errorPhone = "手机号码不能为空";
      } else if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
        this.errorPhone = "手机号码格式不正确";
      } else {
        this.errorPhone = "";
        return true;
      }
      return false;
    },

    //验证姓名
    varifyName() {
      if (this.form.contact == "") {
        this.errorName = "姓名不能为空";
        return false;
      } else {
        this.errorName = "";
        return true;
      }
    },
    //提交订单
    submit() {
      let month =
        this.selectTime.month.toString().length > 1
          ? this.selectTime.month
          : "0" + this.selectTime.month;
      let day =
        this.selectTime.day.toString().length > 1
          ? this.selectTime.day
          : "0" + this.selectTime.day;
      let date = `${this.selectTime.year}-${month}-${day}`;
      this.form.date = date;
      this.form.id = this.id;
      this.varifyName();
      this.varifyName();
      if (this.varifyPhone() && this.varifyName()) {
        let url = `${process.env.baseUrl}hongda://tourist/submit?adult=${this.form.adult}&child=${this.form.child}&contact=${this.form.contact}&date=${this.form.date}&id=${this.form.id}&phone=${this.form.phone}`;
        window.open(url, "_self");
      }
    }
  },
  mounted() {
    this.getLine();
  }
};
</script>
<style lang="scss">
@import "scss/index.scss";
.reserve {
  background: $color-background;
  .mar-top {
    margin-top: 10px;
  }
  .travel-line {
    flex-direction: column;
    // padding-top: 20px;
    background: white;
    .line-title {
      color: $color-text;
      font-weight: $font-weight-bold;
      font-size: $font-size-16;
      letter-spacing: 2px;
      line-height: 20px;
    }
    .line-span {
      color: $color-text-span;
      font-size: $font-size-15;
      line-height: 20px;
      margin-top: 5px;
      letter-spacing: 2px;
    }
    .line-tags {
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
  }
  .select-time {
    background: white;
    .time-tit {
      color: $color-text;
      font-weight: $font-weight-bold;
      font-size: $font-size-16;
      letter-spacing: 2px;
      line-height: 30px;
      padding: 0 0 10px;
      border-bottom: 1px solid $color-separator;
    }
    .months {
      display: flex;
      line-height: 40px;
      border-bottom: 1px solid $color-separator;
      .mon-active {
        color: $color-border;
        border-bottom: 2px solid $color-border;
      }
      .month {
        width: 22%;
      }
    }

    .scCalendar {
      margin-top: 10px;
      .calendar_header {
        display: flex;
        justify-content: space-around;
        color: white;
        line-height: 50px;
        background: $color-border;
        .prev,
        .next {
          font-size: $font-size-18;
        }
      }
    }
    .calendar_content {
      color: black;
      color: black;

      .week {
        display: flex;
        justify-content: space-between;
        line-height: 32px;
        border-bottom: 1px solid $color-separator;
        color: $color-date-week;
        li {
          width: 14%;
          &:nth-child(1),
          &:nth-last-child(1) {
            color: $color-text-price;
          }
        }
      }
      .day {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        li {
          width: 14%;
          // height:45px;
          padding: 15px 0px 5px;
          &:nth-child(1),
          &:nth-child(7n),
          &:nth-child(7n + 1) {
            color: $color-text-price;
          }
          span {
            font-size: 10px;
            color: $color-text-span;
          }
        }
        .red-text {
          color: $color-text-price;
        }

        .is-active {
          background: $color-border;
          color: white !important;
          span {
            color: white;
          }
        }
        .disabled-text {
          color: $color-gray-small !important;
          background: none;
          span {
            visibility: hidden;
          }
        }
      }
    }

    .scCalendar .calendar_content .week li:nth-of-type(7) {
      margin-right: 0;
    }

    .scCalendar .calendar_content .day .marginRight0 {
      margin-right: 0;
    }
  }

  .personNumber {
    flex-direction: column;
    background: white;
    .per-tit {
      color: $color-text;
      font-size: $font-size-16;
      line-height: 30px;
      padding: 0 0 10px;
      border-bottom: 1px solid $color-separator;
      font-weight: $font-weight-bold;
    }
    .per-adult {
      display: flex;
      line-height: 45px;
      border-bottom: 1px solid $color-separator;
      .per-adult-tit {
        width: 15%;
        font-weight: $font-weight-bold;
      }

      .per-adult-price {
        width: 50%;
        color: $color-text-price;
      }
      .per-adult-number {
        width: 35%;
        display: flex;
        justify-content: flex-end;
      }
    }

    .per-child {
      display: flex;
      // line-height: 40px;
      padding: 10px 0;
      border-bottom: 1px solid $color-separator;
      .per-child-tit {
        font-weight: $font-weight-bold;
      }
      .per-child-msg {
        display: flex;
        flex-wrap: wrap;
        width: 66%;
        .per-child-tit {
          width: 25%;
        }
        .per-child-price {
          color: $color-text-price;
        }
        .per-child-span {
          font-size: $font-size-12;
          line-height: 15px;
          padding-top: 5px;
          color: $color-text-span;
          // display: -webkit-box;
          // overflow: hidden;
          // -webkit-box-orient: vertical;
          // -webkit-line-break: break-all;
          // -webkit-line-clamp: 1;
          // line-clamp: 1;
        }
        .is-all {
          display: block;
          -webkit-line-clamp: none;
        }
      }
      .per-child-number {
        width: 45%;
        display: flex;
        justify-content: flex-end;
      }
    }
    /deep/.van-stepper__input {
      margin: 0;
      background: white;
      width: 25px;
      height: 25px;
      border: 1px solid;
      border-color: $color-button-text transparent $color-button-text
        transparent;
    }
    /deep/.van-stepper__minus,
    .van-stepper__plus {
      color: $color-button-text;
      background: white;
      border: 1px solid $color-button-text;
      border-radius: 0;
      width: 25px;
      height: 25px;
    }
  }
  .person-msg {
    background: white;
    .per-tit {
      color: $color-text;
      font-size: $font-size-16;
      line-height: 30px;
      padding: 0 0 10px;
      border-bottom: 1px solid $color-separator;
      font-weight: $font-weight-bold;
    }
    .name-phone {
      line-height: 45px;
      border-bottom: 1px solid $color-separator;
      .name-phone-tit {
        font-weight: $font-weight-bold;
        min-width: 72px;
      }
      .name-phone-input {
        color: $color-date-week;
        /deep/.van-cell {
          padding: 10px 6px;
        }
      }
    }
    .per-phone {
      border: none;
    }
  }
  .bill {
    background: white;
    margin-top: 35px;
    line-height: 40px;
    .bill-tit {
      color: $color-text;
      font-size: $font-size-16;
      font-weight: $font-weight-bold;
    }
    .bill-count {
      color: $color-text-price;
    }
    .bill-tit-service {
      font-size: $font-size-12;
      .img-block {
        display: flex;
        justify-content: center;
        img {
        }
      }
      p {
        margin: 0;
        line-height: 20px;
        color: $color-text-span;
      }
    }
    .bill-submit {
      button {
        background: $color-text-price;
        color: white;
        height: 40px;
        line-height: 40px;
        border-radius: 10px;
      }
    }
  }
}
</style>