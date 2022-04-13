<template>
  <span class="msg-text-inner">
    <template v-for="(word, index) in splitByStockWords(msg)">
      <ChatStockPopup v-if="stockWords.includes(word)" :word="word" :key="index"/>
      <span v-else-if="word.length > 0" :key="index">{{ word }}</span>
    </template>
  </span>
</template>

<script>
import ChatStockPopup from "./ChatStockPopup.vue";

export default {
  components: {
    ChatStockPopup,
  },
  props: {
    msg: String,
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
    }
  }
}
</script>

<style>

</style>