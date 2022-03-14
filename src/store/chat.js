import Vue from "vue";

const chat = {
  namespaced: true,
  state: () => ({ 
    users: {},
    selfID: "",
    messages: [],
  }),
  mutations: {
    SOCKET_MESSAGE(state, msg) {
      // console.log(msg); // also has time
      const username = state.users[msg.user].name;
      state.messages.push({
        text: msg.text,
        time: msg.time,
        name: username,
        id: msg.user
      });
    },

    SOCKET_ADDUSER(state, obj) {
      let name = "";

      if (obj.isSelf) {
        userInit(state, obj, this);
      }

      Vue.set(state.users, obj.id, { name: name });
    },

    SOCKET_DELETEUSER(state, obj) {
      try {
        delete state.users[obj.id];
      } catch (e) {
        console.log("no such user was found");
        console.log(e);
      }
    },
    
    SOCKET_NAMECHANGE(state, obj) {
      console.log("attempting name change");
        const u = state.users[obj.id];
        u.name = obj.name;
        Vue.set(state.users, obj.id, u);
    }
  },
  getters: {
    getOwnUsername: (state) => {
      try {
        return state.users[state.selfID].name;
      } catch(e) { // needed pre-render
        return "...";
      }
    },
  }
};


const nameList = ["beluga", "transformer", "factorio", "gentleman"];

function randomName() {
  const i = Math.floor(Math.random() * nameList.length);
  return nameList[i];
}

function userInit(state, obj, context) {
  let name;
  state.selfID = obj.id;
  name = randomName();

  for (let u of obj.others) {
    if (u.id != obj.id) {
      Vue.set(state.users, u.id, { name: u.data.username });      
    }
  }

  context._vm.$socket.client.emit('nameChange', { name: name });
}

export default chat;