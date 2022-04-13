// import Vue from "vue";

const market = {
  namespaced: true,
  state: () => ({
    funds: 100,
    stockWords: [],
    closePrices: [],
    portfolio: {}
  }),
  mutations: {
    SOCKET_ADDSTOCK(state, data) {
      state.stockWords.push(data);
      console.log(data);
    },
    updateCloseData(state, data) {
      for (let key of Object.keys(data)) {
        const k = state.stockWords.indexOf(key);
        if (k != -1) {
          state.closePrices[k] = parseFloat(data[key].slice(-1)[0]);
        } else {
          console.log("this doesn't exist somehow");
        }
      }
    },
  },
  getters: {
    getStockClosePrice: (state) => (key) => {
      const k = state.stockWords.indexOf(key);
      return state.closePrices[k];
    }
  }
}

export default market;