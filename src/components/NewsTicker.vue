<template>
  <div class="ticker-wrap">
    <marquee-text :repeat="2" :duration="30">
      <div class="item">
        here is some text about the news
      </div>
      <div class="item">
        BREAKING: YOU'LL NEVER BELIEVE THIS
      </div>
      <div class="item">
        here is some text about the news
      </div>
      <div class="item">
        BREAKING: YOU'LL NEVER BELIEVE THIS
      </div>
    </marquee-text>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.ticker-wrap {
  position: absolute;
  bottom: 0;
  width: 100%;
  overflow: clip;
  height: 4rem;
  background-color: rgb(0, 4, 255); 
  padding-left: 100%;
  box-sizing: content-box;

  .marquee-text-wrap {
    position: absolute;
    top: 0;
    left: 0;
  }

  // .ticker {
  //   display: inline-block;
  //   height: 4rem;
  //   line-height: 4rem;  
  //   white-space: nowrap;
  //   padding-right: 100%;
  //   box-sizing: content-box;

  //   // -webkit-animation-iteration-count: infinite; 
  //           animation-iteration-count: infinite;
  //   // -webkit-animation-timing-function: linear;
  //           animation-timing-function: linear;
  // //  -webkit-animation-name: ticker;
  //          animation-name: ticker;
  //   // -webkit-animation-duration: $duration;
  //           animation-duration: 40s;

    .item {
      display: inline-block;
      font: "Helvetica Neue", sans-serif;
      text-transform: uppercase;
      font-weight: bold;
      font-style: italic;

      padding: 0 2rem;
      font-size: 2rem;
      color: white;   

    }

  // }

}

// @keyframes ticker {
//   0% {
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
//     visibility: visible;
//   }

//   100% {
//     -webkit-transform: translate3d(-100%, 0, 0);
//     transform: translate3d(-100%, 0, 0);
//   }
// }

</style>