<template>
  <div class="xebra-connector"></div>
</template>

<script>
const Xebra = require("xebra.js");
let maxConn;

export default {
  mounted() {
    const options = {
      hostname : "127.0.0.1", // localhost
      port : 8086,
    };

    maxConn = new Xebra.State(options);
  },
  methods: {
    sendToMax(obj) {
      maxConn.sendMessageToChannel(obj.field, obj.value);
    }
  }
}
</script>

<style>
.xebra-connector {
  display: none;
}
</style>