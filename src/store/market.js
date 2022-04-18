import Vue from "vue";

const market = {
  namespaced: true,
  state: () => ({
    funds: 1000,
    stockWords: [],
    closePrices: [],
    prevClosePrices: [],
    totalShares: [],
    portfolio: {},
    selectedStock: "",
    openPopup: false,
  }),
  mutations: {
    SOCKET_ADDSTOCK(state, data) {
      if (!state.stockWords.includes(data)) {
        state.stockWords.push(data);
        state.selectedStock = data;
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
          Vue.set(state.prevClosePrices, k, state.closePrices[k]);
          Vue.set(state.closePrices, k, parseFloat(data[key].slice(-1)[0]));
        } else {
          console.log("this doesn't exist somehow");
        }
      }
    },
    updateTotalShares(state, data) {
      for (let key of Object.keys(data)) {
        const k = state.stockWords.indexOf(key);
        if (k != -1) {
          Vue.set(state.totalShares, k, parseInt(data[key]));
        } else {
          console.log("this doesn't exist somehow");
        }
      }
    },
    changeSelectedStock(state, word) {
      if (state.stockWords.includes(word)) {
        state.selectedStock = word;
      } else if (word == null) {
        state.selectedStock = state.stockWords[0];
      } else {
        console.log("stock should not be selectable");
      }
    },
    removeStock(state, word) {
      const k = state.stockWords.indexOf(word);
      if (k != 1) {
        Vue.delete(state.stockWords, k);
        Vue.delete(state.totalShares, k);
        Vue.delete(state.closePrices, k);
        Vue.delete(state.prevClosePrices, k);
        Vue.delete(state.portfolio, word);

        state.selectedStock = state.stockWords.length > 0 ? state.stockWords[0] : "";
        state.changePopupState = false;
      }
    },
    buyStock(state, obj) {
      state.portfolio[obj.stock]++;
      state.funds -= parseFloat(obj.cost);
    },
    sellStock(state, obj) {
      state.portfolio[obj.stock]--;
      state.funds += parseFloat(obj.cost);
    },
    changePopupState(state, s) {
      state.openPopup = s != null ? s : !state.openPopup;
    }
  },
  getters: {
    getStockClosePrice: (state) => (key) => {
      const k = state.stockWords.indexOf(key);
      return parseFloat(state.closePrices[k]).toFixed(2);
    },
    getStockTrend: (state) => (key) => {
      const k = state.stockWords.indexOf(key);
      if (state.closePrices[k] > state.prevClosePrices[k]) {
        return 1;
      } else if (state.closePrices[k] < state.prevClosePrices[k]) {
        return -1;
      } else {
        return 0;
      }
    },
    getCurrentStockClosePrice: (state, getters) => {
      const c = getters.getStockClosePrice(state.selectedStock);
      return c != null ? c : 0;
    },
    getStockTotalShares: (state) => (key) => {
      const k = state.stockWords.indexOf(key);
      return state.totalShares[k];
    },
    getUserStockCount: (state) => (key) => {
      const k = state.portfolio[key];
      return k;
    },
    getCurrentStockCount: (state, getters) => {
      const c = getters.getUserStockCount(state.selectedStock);
      return c != null ? c : 0;
    },
    getUserNetWorth: (state, getters) => {
      if (Object.keys(state.portfolio).length <= 0) return 0;
      let worth = 0;

      for (let stock of Object.keys(state.portfolio)) {
        const prix = getters.getStockClosePrice(stock);
        worth += prix * state.portfolio[stock];
      }

      return worth;
    },
    getOtherNetWorth: (state, getters) => {
      let otherWorth = 0;
      for (let stock of state.stockWords) {
        const index = state.stockWords.indexOf(stock);
        const remainder = state.totalShares[index] - state.portfolio[stock];
        const prix = getters.getStockClosePrice(stock);
        
        otherWorth += prix * remainder;
      }

      return otherWorth;
    }
  },
  actions: {
    summarizeSentiment({ commit }, obj) {
      commit("setSpeed", obj.state.speed, { root: true });
      // rootState.controls.
    },
    analyseForStockRemoval({ state, commit }, msgs) {
      let toRemove = [];
      for (let word of state.stockWords) {
        const ret = msgs.filter((m) => m.toLowerCase().includes(word));
        if (ret.length <= 0) {
          toRemove.push(word);
        }
      }

      if (toRemove.length < 0) return;

      toRemove.forEach((word) => {
        commit("removeStock", word);
        this._vm.$socket.client.emit("removeStock", word);
      });
      
      commit("chat/banWords", toRemove, { root: true });
    }
  }
}

export default market;