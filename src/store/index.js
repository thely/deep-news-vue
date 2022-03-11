// import { random } from "core-js/core/number";
import Vue from "vue";
import Vuex from "vuex";
import videos from "./videos.js";

Vue.use(Vuex);

const nameList = ["beluga", "transformer", "factorio", "gentleman"];

function randomName() {
  const i = Math.floor(Math.random() * nameList.length);
  return nameList[i];
}

export default new Vuex.Store({
  modules: {
    videos,
  },
  state: () => ({ 
    users: {},
    selfID: "",
    messages: [
      "hey how are you",
      "I'm good hbu",
      "not much, we're just testing stuff after all"
    ],
  }),
  mutations: {
    SOCKET_MESSAGE(state, msg) {
      // console.log(msg); // also has time
      state.messages.push(msg.text);
    },
    SOCKET_ADDUSER(state, obj) {
      if (obj.isSelf) {
        state.selfID = obj.id;
      }

      state.users[obj.id] = { name: randomName() };
    },
    SOCKET_DELETEUSER(state, obj) {
      try {
        delete state.users[obj.id];
      } catch (e) {
        console.log("no such user was found");
      }
      
    }
  },
  getters: {

  }
})