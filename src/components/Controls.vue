<template>
  <div class="controls">
    <!-- <button class="hydra-reset">Set patch again</button> -->
    <!-- <button class="max-ping">Send a blip to Max</button> -->
    <input type="range" id="frequency" name="frequency"
        min="0" max="5" step="0.1" v-model="freqValue" @input="freqMethod">
    <label for="volume">Frequency</label>
    <button @click.prevent="restartPatches">Restart patches</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      freqValue: 1.5,
    }
  },
  methods: {
    freqMethod() {
      this.$store.commit("updateFreq", this.freqValue);
    },
    restartPatches() {
      console.log("test thing");
    }
  }
}
</script>

<style>
.controls {
  position: absolute;
  left: 35vw;
  bottom: 20vh;
  width: 30vw;
}
</style>