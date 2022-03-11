<template>
  <div class="hydra-container">
    <canvas id="hydra-large" class="patch"></canvas>
    <canvas id="hydra-small" class="patch"></canvas>
  </div>
</template>

<script>
import HydraHandle from "../utils/HydraPatch.js";
let hydra;

export default {
  data() {
    return {
      players: []
    }
  },
  computed: {
    videos() {
      return this.$store.getters["videos/getClasses"];
    },
    currentVideo() {
      const index = this.$store.state.videos.playerIndex;
      // console.log("now playing: " + index);
      return index;
    }
  },
  watch: {
    currentVideo(newV) {
      hydra.videoNotify(this.players[newV]);
    }
  },
  mounted() {
    hydra = new HydraHandle();
    // console.log(hydra);
    // console.log(this.videos);

    this.players = document.querySelectorAll(this.videos.join(", "));
    hydra.runAll();
  },
}
</script>

<style>

#hydra-large {
  top: 1em;
  right: 1em;
}

#hydra-small {
  bottom: 1.5em;
  right: 1.5em;
}

.patch {
  position: absolute;
  border: 3px solid white;
  padding: 1em;
}

</style>