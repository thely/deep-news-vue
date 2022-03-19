<template>
  <div class="xebra-connector" :loaders="loaders"></div>
</template>

<script>
const Xebra = require("xebra.js");
let maxConn;

export default {
  props: {
    loaders: Array,
  },
  computed: {
    freqVal() {
      return this.$store.state.freqVal;
    },
  },
  mounted() {
    const options = {
      hostname : "127.0.0.1", // localhost
      port : 8086,
      supported_objects: [
        "button"
      ]
    };

    try {
      maxConn = new Xebra.State(options);
    } catch (e) {
      console.log("max not open: couldn't connect");
    }
    
  },
  watch: {
    loaders(newV) {
      let retval = [];

      for (let i = 0; i < newV.length; i++) {
        retval[i] = newV[i].nowPlaying == -1 ? -1 : newV[i].players[newV[i].nowPlaying];
      }

      this.sendToMax("videos", retval);
    },
    freqVal(newV) {
      this.sendToMax("freqVal", newV);
    }
  },
  methods: {
    sendToMax(key, value) {
      try {
        maxConn.sendMessageToChannel(key, value);
      } catch (e) {
        console.log("no max connection");
      } 
    }
  }
}
</script>

<style>
.xebra-connector {
  display: none;
}
</style>