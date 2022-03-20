<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <ChatBox :controls="controls" />
    <VideoLoader v-if="vidFilesExist" />
    <Hydra v-if="vidFilesExist" :loaders="loaders" :controls="controls" />
    <Xebra :loaders="loaders" :controls="controls" />
    <Controls />
  </div>
</template>

<script>
import Hydra from './components/Hydra.vue';
import VideoLoader from './components/VideoLoader.vue';
import ChatBox from './components/ChatBox.vue';
import Controls from './components/Controls.vue';
import Xebra from './components/Xebra.vue';

export default {
  name: 'App',
  components: {
    Hydra,
    VideoLoader,
    ChatBox,
    Controls,
    Xebra
  },
  data() {
    return {
      vidFilesExist: false,
    }
  },
  computed: {
    loaders() {
      const players = JSON.parse(JSON.stringify(this.$store.state.videos.loaders));
      return players;
    },
    controls() {
      const controls = {
        freqVal: parseFloat(this.$store.state.freqVal),
        modVal: parseFloat(this.$store.state.modVal)
      }
      return controls;
    },
  },
  mounted() {
    this.$store.dispatch("videos/getAllFiles").then(() => {
      this.vidFilesExist = true;
    });
  },
  sockets: {
    connect() {
      console.log("connected");
    },
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  font-family: monospace;
}

body {
  margin: 0;
}

#app {
  background: #0b105e;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
