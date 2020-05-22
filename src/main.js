// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store/store"
import { Swipe, SwipeItem } from 'vant';
import { Row, Col } from 'vant';
import { Lazyload } from 'vant';
import { Button } from 'vant';
import { Image } from 'vant';
import { Pagination } from 'vant';
import { Stepper } from 'vant';
import { Field } from 'vant';
import { Rate } from 'vant';
import { Icon } from 'vant';
import { List } from 'vant';
import { Cell } from 'vant';

Vue.use(Cell);
Vue.use(List);
import axios from 'axios'
Vue.use(Swipe).use(SwipeItem);
Vue.use(Row).use(Col)
Vue.use(Lazyload);
Vue.use(Button)
Vue.use(Image)
Vue.use(Pagination)
Vue.use(Stepper)
Vue.use(Field)
Vue.use(Rate)
Vue.use(Icon)

Vue.prototype.$axios=axios
Vue.config.productionTip = false
/* eslint-disable no-new */

router.afterEach((to,from,next) => {
  
  if(from.path!=="/imgBrowser"){
    window.scrollTo(0,0); 
  }
  else{
    // console.log(from)
  }
 
});

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
})
