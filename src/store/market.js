import Vue from "vue";

const market = {
  namespaced: true,
  state: () => ({
    funds: 1000,
    stockWords: [],
    closePrices: [],
    portfolio: {}
  }),
  mutations: {
    SOCKET_ADDSTOCK(state, data) {
      if (!state.stockWords.includes(data)) {
        state.stockWords.push(data);
        Vue.set(state.portfolio, data, 0);
      }
    },
    addExistingStocks(state, data) {
      for (let key of data) {
        if (!state.stockWords.includes(key)) {
          state.stockWords.push(key);
          Vue.set(state.portfolio, key, 0);
        }
      }
    },
    updateCloseData(state, data) {
      for (let key of Object.keys(data)) {
        const k = state.stockWords.indexOf(key);
        if (k != -1) {
          Vue.set(state.closePrices, k, parseFloat(data[key].slice(-1)[0]));
        } else {
          console.log("this doesn't exist somehow");
        }
      }
    },
    buyStock(state, obj) {
      state.portfolio[obj.stock]++;
      state.funds -= parseFloat(obj.cost);
    },
    sellStock(state, obj) {
      state.portfolio[obj.stock]--;
      state.funds += parseFloat(obj.cost);
    }
  },
  getters: {
    getStockClosePrice: (state) => (key) => {
      const k = state.stockWords.indexOf(key);
      return state.closePrices[k];
    },
    getUserStockCount: (state) => (key) => {
      const k = state.portfolio[key];
      return k;
    }
  }
}

export default market;