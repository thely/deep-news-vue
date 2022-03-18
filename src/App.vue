<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <ChatBox />
    <VideoLoader v-if="vidFilesExist" />
    <Hydra v-if="vidFilesExist" />
    <Xebra />
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
  mounted() {
    this.$store.dispatch("videos/getAllFiles").then(() => {
      console.log("files are get");
      this.vidFilesExist = true;
      // console.log(this.$store.getters['videos/getFilename'](0, 0));
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
