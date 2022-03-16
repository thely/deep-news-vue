<template>
  <div class="video-container">
    <!-- <template v-for="(loader, index) in loaders"> -->
      <div :class="`loader-parent loader-${index}`" :key="index" v-for="(loader, index) in loaders">
        <video 
          v-for="(player, pindex) in loader.players"
          :key="pindex"
          :data-index="index"
          :data-pindex="pindex"
          :class="`loader-single video-${index}-${pindex}`"
          playsinline 
          muted 
          :src="$store.getters['videos/getFilename'](index, pindex)"
          @playing="videoStarted" 
          @ended="videoEnded"
        >
        </video>
      </div>
    <!-- </template> -->
  </div>
</template>

<script>
export default {
  computed: {
    loaders() {
      return this.$store.state.videos.loaders;
    }
  },
  mounted() {
    const firstPlayers = this.$el.querySelectorAll(".video-0-0, .video-1-0");
    
    firstPlayers.forEach((player) => {
      player.addEventListener("loadeddata", (e) => {
        e.target.play();
        this.$store.commit("videos/updateHasLoadedOnce", player.dataset.index);
      }, { "once": true });
    });
  },
  methods: {
    videoStarted(e) {
      // Video started: tell everyone who's happening
      var currLoader = parseInt(e.target.dataset.index);
      var currPlayer = parseInt(e.target.dataset.pindex);
      this.$store.commit("videos/updateActivePlayer", {
        loader: currLoader,
        player: currPlayer
      });
      
      // Preload setup
      var nextPlayer = Math.abs(currPlayer - 1);
      this.$store.commit("videos/toNextFile", {
        loader: currLoader,
        player: nextPlayer
      });

      // Prevent preloaded video from playing
      const sibling = currPlayer == 0 ? e.target.nextSibling : e.target.previousSibling;
      sibling.pause();
    },
    videoEnded(e) {
      if (e.target.nextSibling != null) {
        e.target.nextSibling.play();
      } else {
        e.target.previousSibling.play();
      }
    },
  }
}
</script>

<style lang="scss">
  .video-container {
    /* display: none; */
    video {
      width: 200px;
    }
  }
</style>