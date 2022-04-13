<template>
  <div class="stock-parent">
    <select name="stock-select" @change="changeStock">
      <option v-for="(stock, index) in stocks" :key="index">
        {{ index }}
      </option>
    </select>
    <span v-if="stocks != null && current in stocks">{{ current }}: ${{ parseFloat(stocks[current].slice(-1)[0]).toFixed(2) }}</span>
    <span>funds: ${{ funds }}</span>
    <canvas id="myChart" width="400" height="200"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
let myChart;

export default {
  data() {
    return {
      stocks: {},
      current: "",
      initialized: false,
    }
  },
  computed: {
    funds() {
      return parseFloat(this.$store.state.market.funds).toFixed(2);
    },
    stockWords() {
      return this.$store.state.market.stockWords;
    }
  },
  sockets: {
    // stockBaseData(data) {
    //   console.log(data);

    //   data = this.onlyCloseData(data);

    //   this.stocks = data;
      
    //   this.current = Object.keys(data)[0];
    //   this.buildChart(this.stocks[this.current]);
    //   this.initialized = true;
    // },
    stockUpdateData(data) {
      if (Object.keys(data).length <= 0) return;

      data = this.onlyCloseData(data);
      this.$store.commit("market/addExistingStocks", Object.keys(data));
      this.$store.commit("market/updateCloseData", data);
      this.stocks = data;

      if (this.current == "") {
        this.current = Object.keys(data)[0];
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
      console.log(data);
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
      this.current = key;

      this.updateChart(this.stocks[key]);
    },
    onlyCloseData(data) {
      for (let key of Object.keys(data)) {
        data[key] = data[key].points.map((e) => e.close);
      }

      return data;
    }
  }
}
</script>

<style lang="scss">
.stock-parent {
  // width: 400px;
  // height: 200px;

  position: absolute;
  bottom: 0;
  background: white;
  left: 36vw;
  padding: 1em;
}
</style>