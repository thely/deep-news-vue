<template>
  <span class="msg-text-inner">
    <template v-for="(word, index) in splitByStockWords(msg)">
      <chat-stock-word v-if="stockWords.includes(word)" :word="word" :currentStock="currentStock" :key="index"/>
      <span v-else-if="word.length > 0" :key="index">{{ word }}</span>
    </template>
  </span>
</template>

<script>
import ChatStockWord from './ChatStockWord.vue';
// import ChatStockPopup from "./ChatStockPopup.vue";

export default {
  components: {
    ChatStockWord
    // ChatStockPopup,
  },
  props: {
    msg: String,
    currentStock: String,
  },
  computed: {
    stockWords() {
      return this.$store.state.market.stockWords;
    }
  },
  methods: {
    splitByStockWords(msg) {
      const regex = new RegExp(`(${this.stockWords.join("|")})`);
      const result = msg.split(regex);
      return result;
    },
  }
}
</script>

<style lang="scss">
.stock-word {
  border-bottom: 2px dotted #69cc61;
  cursor: pointer;
  font-weight: bold;

  &.selected-stock-word {
    background: yellow;
    color: black;
  }
}
</style>