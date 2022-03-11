<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <ChatBox />
    <VideoLoader />
    <Hydra />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Hydra from './components/Hydra.vue'
import VideoLoader from './components/VideoLoader.vue'
import ChatBox from './components/ChatBox.vue'

export default {
  name: 'App',
  components: {
    Hydra,
    VideoLoader,
    ChatBox
  },
  sockets: {
    connect() {
      console.log("connected");
    },
    // message(data) {
    //   this.messages.push(data);
    // }
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
