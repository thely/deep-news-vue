// import { random } from "core-js/core/number";
import Vue from "vue";
import Vuex from "vuex";
import videos from "./videos.js";
import chat from "./chat.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    videos,
    chat,
  },
  state: () => ({ 
    freqVal: 1.5,
  }),
  mutations: {
    updateFreq(state, val) {
      state.freqVal = val;
      console.log(state.freqVal);
    }
  },
  getters: {
   
  }
});