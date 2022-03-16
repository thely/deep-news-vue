<template>
  <div class="hydra-container" :data-loaders="loaders">
    <canvas id="hydra-large" class="patch"></canvas>
    <canvas id="hydra-small" class="patch"></canvas>
    <span :data-freq="freqVal"></span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import HydraHandle from "../utils/HydraPatch.js";
let hydra;

export default {
  data() {
    return {
      players: []
    }
  },
  computed: {
    videosLoaded() {
      const loaded = this.$store.state.videos.loadedOnce;
      return loaded;
    },
    loaders() {
      const players = JSON.parse(JSON.stringify(this.$store.state.videos.loaders));
      return players;
    },
    ...mapState({ 
      freqVal: 'freqVal',
    }),  
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
    freqVal(newV) {
      hydra.runAll(parseInt(newV));
    },
    videosLoaded(newV) {
      for (let i = 0; i < newV.length; i++) {
        if (newV[i] == true) {
          this.switchHydraVideo({ loader: i, player: 0 });
          hydra.runOne(i);
        }
      }
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
  bottom: 1.5em;
  right: 1.5em;
}

.patch {
  position: absolute;
  border: 3px solid white;
  padding: 1em;
}

</style>