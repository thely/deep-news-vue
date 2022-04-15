<template>
  <div v-if="effectiveLength > 0" class="msg-reactions">
    <template v-for="(react, rindex) in reactions" >
        <span v-if="react.by.length > 0" :key="rindex">{{ react.emoji.repeat(react.by.length) }}</span>
    </template>
    <span class="react-length">{{ effectiveLength }}</span>
  </div>
</template>

<script>
export default {
  props: {
    reactions: Array,
    effectiveLength: Number,
  },
}
</script>

<style lang="scss">
.msg-reactions {
  position: absolute;
  top: -1em;
  right: 0;
  font-size: 0.9em;
  letter-spacing: -1px;
  background: white;
  padding: 0.1em 0.2em;
  // border: 1px solid grey;
  border-radius: 5px;
  box-shadow: 1px 1px 1px rgba(0,0,0,0.25);

  .react-length {
    font-size: 0.9em;
    padding-left: 5px;
  }
}
</style>