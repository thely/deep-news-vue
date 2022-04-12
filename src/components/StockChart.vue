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
      return this.$store.state.market.funds;
    }
  },
  sockets: {
    stockBaseData(data) {
      console.log(data);

      for (let key of Object.keys(data)) {
        data[key] = data[key].points.map((e) => e.close);
      }

      this.stocks = data;
      
      this.current = Object.keys(data)[0];
      this.buildChart(this.stocks[this.current]);
      this.initialized = true;
    },
    stockUpdateData(data) {
      if (!this.initialized) return;

      console.log("updating data");
      for (let key of Object.keys(data)) {
        data[key] = data[key].points.map((e) => e.close);
      }

      this.stocks = data;
      this.updateChart(this.stocks[this.current]);
    }
  },
  beforeDestroy() {
    if (myChart) {
      myChart.destroy();
    }
  },
  methods: {
    buildChart(data) {
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