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
    files: ["vid1.mp4", "vid2.mp4", "vid3.1.mp4", "vid3.2.mp4", "vid3.3.mp4"]
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
      const loader = state.loaders[obj.loader];
      const fileIndex = (loader.players[obj.player] + 1) % state.files.length;

      Vue.set(state.loaders[obj.loader].players, obj.player, fileIndex);
    },

    // Set to random file not currently in either player, ignore playingIndex
    toRandomFile(state, index) {
      const originals = [state.players.map(({ fileIndex }) => { return fileIndex })];
      let fileIndex;

      while (originals.includes(fileIndex)) {
        fileIndex = Math.floor(Math.random() * state.files.length);
      }

      state.players[index].fileIndex = fileIndex;
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
  }
}

export default videos;