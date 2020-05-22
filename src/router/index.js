import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: resolve => require(["components/travel"], resolve),
      meta:{
        keepAlive:false
      }
     
    },
    {
      path: '/travelDetail',
      component: resolve => require(["components/TravelDetail"], resolve),
      meta:{
        keepAlive:false
      }
    },
    {
      path: '/commentList',
      name:'commentlist',
      component: resolve => require(["components/CommentList"], resolve),
      meta:{
        keepAlive:true
      }
     
    },
    {
      path: '/reserve',
      component: resolve => require(["components/Reserve"], resolve),
      meta:{
        keepAlive:false
      }
    },
    {
      path: '/company',
      component: resolve => require(["components/company"], resolve),
      meta:{
        keepAlive:false
      }
    },
    {
      path: '/pictures',
      component: resolve => require(["components/Pictures"], resolve),
      meta:{
        keepAlive:false
      }
    },
    {
      path: '/imgBrowser',
      component: resolve => require(["components/ImgBrowser"], resolve),
      meta:{
        keepAlive:false
      }
    },
  ],
  // scrollBehavior(to, from, savedPosition) {
  //   if (from.path == "/imgBrowser" ||savedPosition ) {
  //     console.log(from)
  //     console.log(savedPosition)
  //     return savedPosition;
  //   } else {
  //     return { x: 0, y: 0 };
  //   }
  // }
})
