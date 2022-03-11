<template>
  <div class="video-container">
    <template v-for="(player, index) in players">
      <video 
        :key="index"
        :data-index="index"
        :class="`video-${index}`"
        playsinline 
        muted 
        :src="$store.getters['videos/getFilename'](index)"
        @playing="videoStarted" 
        @ended="videoEnded">
      </video>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    players() {
      return this.$store.state.videos.players;
    }
  },
  mounted() {
    const firstPlayer = this.$el.firstChild;
    
    firstPlayer.addEventListener("loadeddata", (e) => {
      // console.log("first player loaded first time");
      e.target.play();
    }, { "once": true });
  },
  methods: {
    videoStarted(e) {
      // Video started: tell everyone who's happening
      var currPlayer = e.target.dataset.index;
      this.$store.commit("videos/updateActivePlayer", currPlayer);
      
      // Preload setup
      var nextPlayer = Math.abs(currPlayer - 1);
      this.$store.commit("videos/toNextFile", nextPlayer);

      // Prevent preloaded video from playing
      if (e.target.nextSibling != null) {
        e.target.nextSibling.pause();
      } else {
        e.target.previousSibling.pause();
      }
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

<style>
  .video-container {
    display: none;
  }
</style>