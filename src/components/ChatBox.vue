<template>
  <div class="chat-block">
    <ChannelMarker :channel="'MSGS'" />
    <ChatNameChange />
    <ChatMessageList :width="controls.freqVal"/>
    <ChatMessageInput />
  </div>
</template>

<script>
import ChatNameChange from './chat/ChatNameChange.vue';
import ChatMessageInput from './chat/ChatMessageInput.vue';
import ChatMessageList from './chat/ChatMessageList.vue';
import ChannelMarker from './ChannelMarker.vue';

export default {
  components: {
    ChatNameChange,
    ChatMessageInput,
    ChatMessageList,
    ChannelMarker
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
  margin-bottom: 4rem;
  width: 34vw;
  height: calc(100vh - 6em);
  max-height: 100vh;
  position: relative;

  // background-color: rgb(194, 190, 199);
  background: #b9a6a6;
  border: 3px solid white;
  border-radius: 15px;
  color: black;
  font-size: 1.3em;
  // padding: 1em;

  display: grid;
  grid-template-rows: 3em 1fr 3.2em;

  font-family: "Helvetica Neue", sans-serif !important;
}

</style>