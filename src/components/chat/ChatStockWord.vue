<template>
  <span 
    @click="displayPopup($event, word)"
    class="stock-word"
    :class="word == currentStock ? 'selected-stock-word' : ''"
  >
    <span class="word-only">{{ word }}</span>
    <span class="trend-arrow" :class="trend == 1 ? 'trend-up' : trend == -1 ? 'trend-down' : 'trend-neutral'">
      {{ trendArrow }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    word: String,
    currentStock: String,
  },
  computed: {
    trend() {
      return this.$store.getters["market/getStockTrend"](this.word);
    },
    trendArrow() {
      if (this.trend == 1) {
        return "▲";
      } else if (this.trend == -1) {
        return "▼";
      } else {
        return "";
      }
    }
  },
  methods: {
    displayPopup(e, word) {
      // console.log(word, this.currentStock);
      if (word != this.currentStock) {
        // console.log("new word");
        this.$store.commit("market/changeSelectedStock", word);
      } else {
        // console.log("change popup state");
        this.$store.commit("market/changePopupState");
      }
    }
  }
}
</script>

<style lang="scss">
.trend-arrow {
  font-size: 0.7em;

  &.trend-up {
    color: #00ff00;
  }
  &.trend-down {
    color: red;
  }
}
</style>