import Vue from "vue";

const chat = {
  namespaced: true,
  state: () => ({ 
    users: {},
    selfID: "",
    messages: [],
    rules: { worm: "wood", butter: "cream" }
  }),
  mutations: {
    SOCKET_MESSAGE(state, msg) {
      const username = state.users[msg.user].name;
      state.messages.push({
        text: msg.text,
        original: msg.text,
        time: msg.time,
        name: username,
        msgID: msg.msgID,
        id: msg.user,
        reactions: [],
      });
    },

    SOCKET_UPDATEMESSAGE(state, msg) {
      // state.messages[msgID]
      let mIndex = state.messages.findIndex(m => m.msgID == msg.msgID);
      console.log("now it's: ");
      console.log(JSON.stringify(msg));
      Vue.set(state.messages, mIndex, msg);
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
    },
    updateMessage(state, obj) {
      console.log(obj);
      Vue.set(state.messages, obj.index, obj.message);
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
  },
  actions: {
    censorship: ({ state, commit }) => {
      for (let i = 0; i < state.messages.length; i++) {
        let m = state.messages[i].text;
        m = alterToRule(m, state.rules);

        if (m != state.messages[i].text) {
          state.messages[i].text = m;

          commit("updateMessage", {
            index: i,
            message: state.messages[i],
          });
        }
      }
    }
  }
};

function alterToRule(m, rules) {
  for (let key of Object.keys(rules)) {
    if (m.includes(key)) {
      m = m.replace(new RegExp(key, 'g'), rules[key]);
    }
  }
  return m;
}


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