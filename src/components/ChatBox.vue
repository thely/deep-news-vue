<template>
  <div class="chat-block">
    <ChatNameChange />
    <ChatMessageList :width="controls.freqVal * 40.0"/>
    <ChatMessageInput />
  </div>
</template>

<script>
import ChatNameChange from './chat/ChatNameChange.vue';
import ChatMessageInput from './chat/ChatMessageInput.vue';
import ChatMessageList from './chat/ChatMessageList.vue';

export default {
  components: {
    ChatNameChange,
    ChatMessageInput,
    ChatMessageList
  },
  props: {
    controls: Object,
  },
  mounted() {
    console.log(this.controls);
  }
}
</script>

<style lang="scss">
.chat-block {
  margin: 1em;
  width: 34vw;
  height: calc(100vh - 2em);
  max-height: 100vh;

  // background-color: rgb(194, 190, 199);
  background: black;
  border: 3px solid white;
  color: white;
  font-size: 1.3em;
  // padding: 1em;

  display: grid;
  grid-template-rows: 3em 1fr 4em;
}

</style>