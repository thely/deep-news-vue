<template>
  <div id="app" @click="clickCounter">
    <ChatBox :controls="controls" />
    <VideoLoader v-if="vidFilesExist" />
    <Hydra v-if="vidFilesExist" :loaders="loaders" :controls="controls" />
    <Xebra :loaders="loaders" :controls="controls" />
    <!-- <Controls /> -->
    <StockChart />
    <NewsTicker />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import Hydra from './components/Hydra.vue';
import VideoLoader from './components/VideoLoader.vue';
import ChatBox from './components/ChatBox.vue';
import Controls from './components/Controls.vue';
import Xebra from './components/Xebra.vue';
import StockChart from './components/StockChart.vue';
import NewsTicker from './components/NewsTicker.vue';

// https://en.wikipedia.org/wiki/Special:RandomInCategory/Category:Member_states_of_the_United_Nations

export default {
  name: 'App',
  components: {
    Hydra,
    VideoLoader,
    ChatBox,
    Controls,
    Xebra,
    StockChart,
    NewsTicker
  },
  data() {
    return {
      vidFilesExist: false,
      clickCount: 0,
    }
  },
  computed: {
    loaders() {
      const players = JSON.parse(JSON.stringify(this.$store.state.videos.loaders));
      return players;
    },
    controls() {
      const controls = {
        speed: parseFloat(this.$store.state.speed),
        netWorth: this.$store.getters["market/getUserNetWorth"],
        otherNetWorth: this.$store.getters["market/getOtherNetWorth"],
        currentStockShares: this.$store.getters["market/getCurrentStockCount"],
        currentStockClose: this.$store.getters["market/getCurrentStockClosePrice"],
        messageLength: this.$store.getters["chat/getLastMessageLength"],
        clickCount: this.clickCount
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
  },
  methods: {
    clickCounter() {
      this.clickCount++;
    }
  }
}
</script>

<style>
:root {
  --mono-font: monospace;
  --chat-font: "Helvetica Neue", sans-serif;
}
* {
  box-sizing: border-box;
  /* font-family: monospace; */
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
  max-width: 100vw;
  overflow: hidden;
}
</style>
