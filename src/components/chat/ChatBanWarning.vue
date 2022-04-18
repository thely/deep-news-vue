<template>
  <div class="ban-warning">
    <p>{{ word }} was delisted. Please choose a different word.</p>
  </div>
</template>

<script>
export default {
  props: {
    word: String
  },
}
</script>

<style lang="scss">
.ban-warning {
  background: #f29595;
  border-radius: 10px;
  padding: 0.2em 0.3em;
  position: absolute;
  bottom: 2.4em;
  max-width: 88%;

  p {
    font-size: 0.6em;
    margin: 0;
  }
}
</style>