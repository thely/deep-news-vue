// import Vue from "vue";

const market = {
  namespaced: true,
  state: () => ({
    funds: 100,
    stockWords: [],
    portfolio: {}
  }),
  mutations: {
    updateTotal(state, data) {
      data.category
    }
  }
}

export default market;