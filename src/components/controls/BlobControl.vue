<template>
  <svg 
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    class="blob"
    @mouseup="endClick" @mousemove="moveMouse"
    :style="`--button-border: ${compValue}px`"
    :class="clickedOnce ? '' : 'blob-unvisited'"
  >
    <path 
      fill="#FF0066"
      d="M16.9,-21.1C28.3,-10.6,48.2,-11.3,53.8,-5.6C59.4,0.1,50.7,12.1,40.1,16.3C29.5,20.4,17.1,16.6,8.3,17.3C-0.4,18,-5.4,23.3,-10.9,23.9C-16.4,24.5,-22.4,20.4,-31.4,13.8C-40.5,7.1,-52.7,-2.2,-51.4,-9C-50.1,-15.8,-35.3,-20.2,-24.5,-30.8C-13.7,-41.4,-6.9,-58.2,-2.1,-55.8C2.8,-53.4,5.5,-31.6,16.9,-21.1Z"
      transform="translate(100 100)"
      @mousedown="startClick" 
    />
  </svg>
</template>

<script>
export default {
  data() {
    return {
      isMouseDown: false,
      compValue: 10,
      clickedOnce: false,
    }
  },
  computed: {
    globalMouseDown() {
      return this.$store.state.mouseDown;
    }
  },
  methods: {
    startClick() {
      this.isMouseDown = true;
      this.clickedOnce = true;
    },
    moveMouse(e) {
      if (this.isMouseDown && this.globalMouseDown) {
        const percent = 1 - ((e.clientY - 300) / 300);
        this.compValue = (percent * 30) + 10;
        this.$emit("percent", percent.toFixed(2) * 100);
      }
    },
    endClick() {
      this.isMouseDown = false;
    }
  }
}
</script>

<style lang="scss">
svg.blob {
  --button-border: 10px;

  path {
    stroke: #51529bc2;
    stroke-width: var(--button-border);
    transition: stroke-width 0.05s;
  }

  &.blob-unvisited path {
    animation: glowabit 1s infinite cubic-bezier(.46,.03,.52,.96) alternate;
  }

  @keyframes glowabit {
    from {
      stroke-width: calc(var(--button-border) / 2);
    }

    to {
      stroke-width: calc(var(--button-border) * 1.5);
    }
  }
}
</style>