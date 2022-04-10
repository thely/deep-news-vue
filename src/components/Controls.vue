<template>
  <div class="controls">
    <input type="range" min="0" max="5" step="0.1" v-model="freqValue" @input="freqMethod">
    <label for="volume">Frequency</label>

    <input type="range" min="0.001" max="0.005" step="0.001" v-model="modVal" @input="modMethod">
    <label for="volume">Modulation</label>

    <button @click.prevent="censor">Censor something</button>
    <!-- <BlobControl @percent="blobPercent" /> -->
  </div>
</template>

<script>
// import BlobControl from "./controls/BlobControl.vue";

export default {
  components: {
    // BlobControl,
  },
  data() {
    return {
      freqValue: 1.5,
      modVal: 0.003,
    }
  },
  methods: {
    freqMethod() {
      this.$store.commit("updateFreq", this.freqValue);
    },
    modMethod() {
      this.$store.commit("updateMod", this.modVal);
    },
    censor() {
      this.$store.dispatch("chat/censorship");
      this.$emit("pressCensor", true);
    },
    blobPercent(e) {
      this.$store.commit("updateFreq", e / 20.0);
      // console.log(e);
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