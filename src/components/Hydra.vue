<template>
  <div class="hydra-container" :data-loaders="loaders">
    <canvas id="hydra-large" class="patch"></canvas>
    <canvas id="hydra-small" class="patch"></canvas>
    <span :data-freq="controls"></span>
  </div>
</template>

<script>
import HydraHandle from "../utils/HydraPatch.js";
let hydra;

export default {
  props: {
    loaders: Array,
    controls: Object,
  },
  data() {
    return {
      players: [],
    }
  },
  computed: {
    videosLoaded() {
      const loaded = this.$store.state.videos.loadedOnce;
      return loaded;
    },
    currentStock() {
      return this.$store.state.market.selectedStock;
    }
  },
  watch: {
    loaders(newV, oldV) {
      for (let i = 0; i < newV.length; i++) {
        for (let key of Object.keys(newV[i])) {
          if (newV[i][key].toString() != oldV[i][key].toString()) {
            this.switchHydraVideo({ loader: i, player: newV[i].nowPlaying });
          }
        }
      }
    },
    videosLoaded(newV) {
      for (let i = 0; i < newV.length; i++) {
        if (newV[i] == true) {
          this.switchHydraVideo({ loader: i, player: 0 });
          hydra.runOne(i, this.controls);
        }
      }
    },
    controls(newV) {
      hydra.runAll(newV);
    },
    currentStock() {
      hydra.switchOne();
      hydra.runAll(this.controls);
    }
  },
  mounted() {
    hydra = new HydraHandle();

    this.players = [...document.querySelectorAll(".loader-single")];
  },
  methods: {
    getPlayer(index, pindex) {
      const player = this.players.filter((p) => p.dataset.index == index && p.dataset.pindex == pindex)[0];
      return player;
    },
    switchHydraVideo(newV) {
      const player = this.getPlayer(newV.loader, newV.player);
      hydra.videoNotify(player, newV.loader);
    }
  }
}
</script>

<style>

#hydra-large {
  top: 1em;
  right: 1em;
}

#hydra-small {
  bottom: 5rem;
  right: 1.5em;
}

.patch {
  position: absolute;
  border: 3px solid white;
  padding: 1em;
}

</style>