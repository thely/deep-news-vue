<template>
  <div class="stock-parent">
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
</template>

<script>
export default {
  sockets: {
    stockBaseData(data) {
      console.log(data);
    }
  }
}
</script>

<style>

</style>