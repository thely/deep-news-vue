<template>
  <div class="channel-mark">
    <h1 class="channel-name">{{ channel }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    channel: String,
  }
}
</script>

<style lang="scss">
.channel-mark {
  background: blue;
  color: white;
  font-family: var(--mono-font);
  /* font-style: italic; */

  position: absolute;
  top: -0.4rem;
  left: 0.5rem;

  width: 4rem;
  height: 2.5rem;
  font-size: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .channel-name {
    font-size: 1rem;
    margin: 0;
  }
}
</style>