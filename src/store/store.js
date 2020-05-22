import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state={
    imgs:[],
    index:0,
}
const mutations={
    addImgs(state,playLoad){
        console.log(playLoad)
        state.imgs=playLoad.imgs;
        state.index=playLoad.index;
    }
}
const store=new Vuex.Store({
    state,
    mutations
})

export default store;