const videos = {
  namespaced: true,
  state: () => ({
    urlBase: "./assets",
    // players: Array(2).fill({ ...playerBase }),
    players: [
      { fileIndex: 0, playing: false, className: ".video-0" },
      { fileIndex: 0, playing: false, className: ".video-1" }
    ],
    fileIndex: 0,
    playerIndex: 0,
    files: ["vid1.mp4", "vid2.mp4", "vid3.1.mp4", "vid3.2.mp4", "vid3.3.mp4"]
  }),

  // Mutations
  mutations: {
    // Generic player-updater, not used
    updatePlayer(state, obj) {
      state.players[obj.i][obj.field] = obj.value;
    },

    updateActivePlayer(state, index) {
      // console.log("now player: " + index);
      state.playerIndex = index;
    },

    // Set upcoming player to next video, following the playingIndex value
    toNextFile(state, index) {
      const fileIndex = (state.fileIndex + 1) % state.files.length;
      state.players[index].fileIndex = fileIndex;
      state.fileIndex = fileIndex;
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
    getFilename: (state) => (index) => {
      // console.log("inside getFilename: " + index);
      // console.log("my file will be: " + state.players[index].fileIndex);
      return state.urlBase + "/" + state.files[state.players[index].fileIndex];
    },
    getClasses: (state) => {
      const classes = state.players.map(({ className }) => { return className; });
      // console.log(classes);
      return classes;
    }
  }
}

export default videos;