// import { random } from "core-js/core/number";
import Vue from "vue";
import Vuex from "vuex";
import videos from "./videos.js";
import chat from "./chat.js";
import market from "./market.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    videos,
    chat,
    market
  },
  state: () => ({ 
    freqVal: 20,
    modVal: 20,
    speed: 2000,
    // mouseDown: false,
  }),
  mutations: {
    setSpeed(state, val) {
      state.speed = val;
    },
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