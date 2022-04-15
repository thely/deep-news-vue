<template>
  <div class="xebra-connector" :loaders="loaders"></div>
</template>

<script>
const Xebra = require("xebra.js");
let maxConn;

export default {
  props: {
    loaders: Array,
    controls: Object,
  },
  computed: {
    messageCount() {
      return this.$store.state.chat.messageCount;
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
    controls(newV) {
      this.sendToMax("controls", newV);
    },
    messageCount(newV) {
      if (Math.random() > 0.8) {
        this.sendToMax("delayShift", newV);
      }
    }
  },
  methods: {
    sendToMax(key, value) {
      try {
        maxConn.sendMessageToChannel(key, value);
      } catch (e) {
        // console.log("no max connection");
        return;
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