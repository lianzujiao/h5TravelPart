<template>
  <div id="app">
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <keep-alive include="commentlist" >
       <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
   
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss" scoped>
@import "scss/index.scss";

#app {
  font-family: "Microsoft YaHei","微软雅黑", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-text;
  overflow-x: hidden;
  
}
</style>
