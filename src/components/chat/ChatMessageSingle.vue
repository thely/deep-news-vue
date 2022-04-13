<template>
  <span class="msg-text-inner">
    <template v-for="(word, index) in splitByStockWords(msg)">
      <span v-if="stockWords.includes(word)" class="stock-word" :key="index">{{ word }}</span>
      <span v-else-if="word.length > 0" :key="index">{{ word }}</span>
    </template>
  </span>
</template>

<script>
export default {
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
      // console.log(this.stockWords.join("|"));
      const regex = new RegExp(`(${this.stockWords.join("|")})`);
      // const result = msg.split(/(hello|yes)/);
      const result = msg.split(regex);
      // console.log(result);
      // console.log(this.stockWords);

      return result;
    }
  }
}
</script>

<style>
.stock-word {
  border-bottom: 2px dotted red;
}
</style>