<template>
  <div class="stock-parent">
    <select name="stock-select" class="stock-select" @change="changeStock" v-show="initialized">
      <option v-for="(stock, index) in stocks" :selected="index == current" :key="index">
        {{ index }}
      </option>
    </select>
    <div v-if="stocks != null && current in stocks" class="stock-header">
      <span class="stock-name">{{ current }}</span>
      <span>${{ parseFloat(stocks[current].slice(-1)[0]).toFixed(2) }}</span>
    </div>
    <canvas id="myChart" width="390" height="200" :class="initialized ? '' : 'canvas-active'"></canvas>
    <span>funds: ${{ funds }}</span>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
let myChart;

export default {
  data() {
    return {
      stocks: {},
      // current: "",
      initialized: false,
    }
  },
  computed: {
    funds() {
      return parseFloat(this.$store.state.market.funds).toFixed(2);
    },
    stockWords() {
      return this.$store.state.market.stockWords;
    },
    current() {
      return this.$store.state.market.selectedStock;
    }
  },
  watch: {
    current(newV) {
      if (!(newV in this.stocks)) return;
      this.$store.commit("market/changeSelectedStock", newV);
      if (!this.initialized) {
        this.buildChart(this.stocks[newV]);
        this.initialized = true;
      } else {
        this.updateChart(this.stocks[newV]);
      }
    }
  },
  sockets: {
    stockUpdateData(data) {
      if (Object.keys(data).length <= 0 || !("stocks" in data) || Object.keys(data.stocks).length <= 0) return;

      const stocks = this.onlyCloseData(data.stocks);
      const shares = this.onlyUserShares(data.stocks);
      this.$store.commit("market/addExistingStocks", Object.keys(stocks));
      this.$store.commit("market/updateCloseData", stocks);
      this.$store.commit("market/updateTotalShares", shares);
      
      this.$store.dispatch("market/summarizeSentiment", { emojis: data.emojis, state: data.state });
      this.stocks = stocks;

      if (this.current == "") {
        this.$store.commit("market/changeSelectedStock", Object.keys(stocks)[0]);
      }

      if (!this.initialized) {
        this.buildChart(this.stocks[this.current]);
        this.initialized = true;
      } else {
        this.updateChart(this.stocks[this.current]);
      }
    }
  },
  beforeDestroy() {
    if (myChart) {
      myChart.destroy();
    }
  },
  methods: {
    buildChart(data) {
      // console.log(data);
      const ctx = this.$el.querySelector("canvas").getContext('2d');
      
      const dataConfig = {
        labels: [...Array(data.length).keys()],
        datasets: [
          {
            label: "Close",
            data: data,
          },
        ]
      }

      // const plugin = {
      //   id: 'custom_canvas_background_color',
      //   beforeDraw: (chart) => {
      //     const ctx = chart.canvas.getContext('2d');
      //     ctx.save();
      //     ctx.globalCompositeOperation = 'destination-over';
      //     ctx.fillStyle = 'lightGreen';
      //     ctx.fillRect(0, 0, chart.width, chart.height);
      //     ctx.restore();
      //   }
      // };
      
      myChart = new Chart(ctx, {
        type: "line",
        data: dataConfig,
        options:{
          scales:{
            x: {
              display: false
            }
          },
          elements: {
            point: {
              radius: 0 // default to disabled in all datasets
            }
          },
          animation: {
            duration: 0 // general animation time
          },
          plugins: {
            tooltip: {
              enabled: false
            },
            legend: {
              display: false,
            }
          }
        },
        // plugins: [plugin]
      })
    },
    updateChart(data) {
      myChart.data.datasets.pop();
      myChart.data.datasets.push({
        data: data
      });

      myChart.update();
    },
    changeStock(e) {
      const key = e.target.value;

      this.$store.commit("market/changeSelectedStock", key);
      this.updateChart(this.stocks[key]);
    },
    onlyCloseData(data) {
      let retval = {};
      for (let key of Object.keys(data)) {
        retval[key] = data[key].points.map((e) => e.close);
      }

      return retval;
    },
    onlyUserShares(data) {
      // console.log(data);
      let retval = {};
      for (let key of Object.keys(data)) {
        retval[key] = data[key].userShares.final;
        // console.log(data[key].userShares);
        // retval[key] = data[key].userShares.map((e) => e.final);
      }

      return retval;
    }
  }
}
</script>

<style lang="scss">
.stock-parent {
  // width: 400px;
  // height: 200px;

  position: absolute;
  bottom: 5rem;
  background: #fffea8;
  left: 33vw;
  padding: 1em;
  z-index: 9999;

  font-family: var(--mono-font);

  canvas {
    display: block;

    &.canvas-active {
      background: #c4c4c4;
    }
  }

  .stock-select {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
  }

  .stock-name {
    font-size: 1.5em;
    text-transform: uppercase;
    margin-right: 0.5em;
  }
}
</style>