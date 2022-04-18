<template>
  <div class="ticker-wrap">
    <marquee-text v-if="stockWords.length <= 0" :repeat="10" :duration="30" :key="changeCount">
      <div class="item" >... standby ...</div>
    </marquee-text>
    <marquee-text v-else :repeat="stockWords.length == 1 ? 10 : stockWords.length > 3 ? 2 : 4" :duration="30" :key="changeCount">
      <template v-for="(thing, index) in stockList">
        <div class="item" :key="index" v-html="thing"></div>
      </template>
    </marquee-text>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeCount: 0,
    }
  },
  computed: {
    stockWords() {
      return this.$store.state.market.stockWords;
    },
    stockList() {
      let l = [];
      let index = 0;
      for (let word of this.stockWords) {
        l.push(`${word}: $${this.closePrice(word)}`);
        
        if (this.$store.state.chat.messages.length > index && this.lastMessage(index)) {
          l.push(`${this.bigWords(index)}: <span class="news-title">"${this.lastMessage(index)}"</span>`);
        }

        index++;
      }
      return l;
    }
  },
  watch: {
    stockWords() {
      this.changeCount++;
    }
  },
  methods: {
    closePrice(word) {
      return this.$store.getters['market/getStockClosePrice'](word);
    },
    lastMessage(index) {
      const msg = this.$store.getters['chat/getLastMessage'](index);
      // console.log(msg);
      return msg;
    },
    bigWords(index) {
      const l = ["breaking", "developing story", "now", "live on scene", "today", "breaking news"];
      return l[index % l.length];
    }
  }
}
</script>

<style lang="scss">
.ticker-wrap {
  position: absolute;
  bottom: 0;
  width: 100%;
  overflow: clip;
  height: 4rem;
  background-color: rgb(0, 4, 255); 
  padding-left: 100%;
  box-sizing: content-box;

  .marquee-text-wrap {
    position: absolute;
    top: 23%;
    left: 0;
  }

  // .ticker {
  //   display: inline-block;
  //   height: 4rem;
  //   line-height: 4rem;  
  //   white-space: nowrap;
  //   padding-right: 100%;
  //   box-sizing: content-box;

  //   // -webkit-animation-iteration-count: infinite; 
  //           animation-iteration-count: infinite;
  //   // -webkit-animation-timing-function: linear;
  //           animation-timing-function: linear;
  // //  -webkit-animation-name: ticker;
  //          animation-name: ticker;
  //   // -webkit-animation-duration: $duration;
  //           animation-duration: 40s;

    .item {
      display: inline-block;
      font-family: "Helvetica Neue", sans-serif;
      text-transform: uppercase;
      font-weight: bold;
      // font-style: italic;

      padding: 0 2rem;
      font-size: 1.7rem;
      color: white;

      .news-title {
        text-transform: none;
      }

    }

  // }

}

// @keyframes ticker {
//   0% {
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
//     visibility: visible;
//   }

//   100% {
//     -webkit-transform: translate3d(-100%, 0, 0);
//     transform: translate3d(-100%, 0, 0);
//   }
// }

</style>