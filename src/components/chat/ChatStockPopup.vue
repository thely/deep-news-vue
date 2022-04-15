<template>
  <div class="stock-word-parent" v-click-outside="hideDisplay">
    <span @click="displayPopup" class="stock-word" :class="word == currentStock ? 'selected-stock-word' : ''">
      {{ word }}
    </span>

    <div v-if="showSellers" class="popup-parent">
      <h4>Buy stock</h4>
      <ul class="seller-list">
        <li v-for="(seller, index) in sellers" :key="index">
          <span>${{ seller }}</span>
          <button @click="buyStock($event, seller, index)" :disabled="seller > funds">Buy</button>
        </li>
      </ul>
      <h4>Sell stock</h4>
      <p v-if="shares <= 0">You have no "{{ word }}" shares.</p>
      <div v-else>
        <span>{{ shares }} shares in "{{ word }}":</span>
        <ul class="buyer-list seller-list">
          <li v-for="(buyer, index) in buyers" :key="index">
            <span>${{ buyer }}</span>
            <button @click="sellStock($event, buyer)">Sell</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    word: String,
  },
  data() {
    return {
      showSellers: false,
      sellPrice: 0,
    }
  },
  computed: {
    closePrice() {
      const price = this.$store.getters['market/getStockClosePrice'](this.word);
      console.log(price);
      return price;
    },
    sellers() {
      // const numSellers = Math.ceil(Math.random() * 5);
      const numSellers = 3;
      let sellers = [];
      for (let i = 0; i < numSellers; i++) {
        let direction = Math.random() > 0.7 ? 1 : -1;
        let volatility = (Math.random() * 2 * direction);
        sellers.push(parseFloat(this.closePrice + volatility).toFixed(2));
      }

      return sellers;
    },
    buyers() {
      const buyCount = Math.ceil(this.shares / 3);
      let buyers = [];
      for (let i = 0; i < buyCount; i++) {
        let direction = Math.random() > 0.5 ? 1 : -1;
        let volatility = (Math.random() * 2 * direction);
        buyers.push(parseFloat(this.closePrice + volatility).toFixed(2));
      }

      return buyers;
    },
    shares() {
      return this.$store.getters['market/getUserStockCount'](this.word);
    },
    funds() {
      return this.$store.state.market.funds;
    },
    currentStock() {
      return this.$store.state.market.selectedStock;
    }
  },
  methods: {
    displayPopup() {
      this.showSellers = !this.showSellers;
      this.$store.commit("market/changeSelectedStock", this.word);
    },
    buyStock(e, seller) {
      this.$store.commit("market/buyStock", {
        stock: this.word,
        cost: seller
      });

      this.$socket.client.emit("buyStock", this.word);
    },
    sellStock(e, buyer) {
      this.$store.commit("market/sellStock", {
        stock: this.word,
        cost: buyer
      });

      this.$socket.client.emit("sellStock", this.word);
    },
    hideDisplay() {
      this.showSellers = false;
    }
  }
}
</script>

<style lang="scss">
.stock-word-parent {
  display: inline-block;

  .stock-word {
    border-bottom: 2px dotted red;
    cursor: pointer;

    &.selected-stock-word {
      background: yellow;
      color: black;
    }
  }

  .popup-parent {
    background: white;
    color: black;
    font-size: 0.7em;
    max-width: 160px;
    padding: 0.75em;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;

    h4 {
      font-size: 1.1em;
      // margin: 0;
      margin: 0.25em 0;
    }
  }

  .seller-list {
    li {
      padding-bottom: 0;
      background: white;
      color: black;
      padding: 0.5em 0;

      button {
        font-size: 0.9em;
      }
    }
  }
}
</style>