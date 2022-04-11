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
    freqVal: 20,
    modVal: 20,
    // mouseDown: false,
  }),
  mutations: {
    updateFreq(state, val) {
      state.freqVal = val;
      // console.log(state.freqVal);
    },
    updateMod(state, val) {
      state.modVal = val;
      // console.log(state.freqVal);
    },
    // triggerMouse(state, val) {
    //   val = val == null ? !state.mouseDown : val;
    //   state.mouseDown = val;
    //   // console.log(state.mouseDown);
    // }
  },
  getters: {
   
  }
});