import Vue from "vue";

const videos = {
  namespaced: true,
  state: () => ({
    urlBase: "./assets",
    loaders: [
      { players: [0, 0], nowPlaying: -1 },
      { players: [2, 2], nowPlaying: -1 }
    ],
    loadedOnce: [false, false],
    files: []
  }),

  // Mutations
  mutations: {
    // Generic player-updater, not used
    updatePlayer(state, obj) {
      state.players[obj.i][obj.field] = obj.value;
    },

    updateActivePlayer(state, obj) {
      state.loaders[obj.loader].nowPlaying = obj.player;
    },

    updateHasLoadedOnce(state, index) {
      state.loadedOnce[index] = true;

      Vue.set(state.loadedOnce, index, true);
    },

    // Set upcoming player to next video, following the playingIndex value
    toNextFile(state, obj) {
      // go one up from your sibling player's file
      const sibling = Math.abs(obj.player - 1);
      const loader = state.loaders[obj.loader];
      const fileIndex = (loader.players[sibling] + 1) % state.files.length;

      Vue.set(state.loaders[obj.loader].players, obj.player, fileIndex);
    },

    // Set to random file not currently in either player, ignore playingIndex
    toRandomFile(state, obj) {
      // condense down to just the files in use
      let originals = state.loaders.map((loader, index) => {
        return loader.players.map((player, pindex) => {
          if (index != obj.loader || pindex != obj.player) {
            return player;
          } else {
            return;
          }
        }).filter(Boolean);
      });

      originals = originals.flat();

      // pick a random new index
      let fileIndex = Math.floor(Math.random() * state.files.length);
      while (originals.includes(fileIndex)) {
        fileIndex = Math.floor(Math.random() * state.files.length);
      }

      Vue.set(state.loaders[obj.loader].players, obj.player, fileIndex);
    },

    loadFileList(state, files) {
      state.files = files;
    }
  },

  getters: {
    getFilename: (state) => (index, pindex) => {
      const url = state.urlBase + "/" + state.files[state.loaders[index].players[pindex]];
      return url;
    },
    getClasses: (state) => {
      const classes = state.players.map(({ className }) => { return className; });
      return classes;
    }
  },
  actions: {
    async getAllFiles ({ commit }) {
      // const urlReq = "http://localhost:8081/videos";
      const urlReq = process.env.VUE_APP_SERVER + "/videos";
      return fetch(urlReq).then(response => response.json()).then(data => {
        const list = data.videos;
        console.log(list);
        commit("loadFileList", list);
      });
    }
  }
}

export default videos;