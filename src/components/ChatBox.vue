<template>
  <div class="chat-block">
    <ChatNameChange />
    <div class="chat-messages">
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
    <ChatMessageInput @addMessage="typedMessage"/>
  </div>
</template>

<script>
import ChatNameChange from './chat/ChatNameChange.vue';
import ChatMessageInput from './chat/ChatMessageInput.vue';

export default {
  components: {
    ChatNameChange,
    ChatMessageInput
  },
  // data() {
  //   return {
  //     // messages: [
  //     //   "hey how are you",
  //     //   "I'm good hbu",
  //     //   "not much, we're just testing stuff after all"
  //     // ]
  //   }
  // },
  computed: {
    messages() {
      return this.$store.state.messages;
    }
  },
  methods: {
    typedMessage(e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss">
.chat-block {
  margin: 1em;
  width: 30vw;
  height: calc(100vh - 2em);
  max-height: 100vh;

  // background-color: rgb(194, 190, 199);
  background: black;
  border: 3px solid white;
  color: white;
  font-size: 1.3em;
  padding: 1em;

  display: grid;
  grid-template-rows: 2em 1fr 2em;
}

.chat-messages {
  ul {
    list-style-type: none;
    padding-left: 0;

    li {
      margin-bottom: 1em;
    }
  }
}

// .chat-form {
//   display: grid;
//   grid-template-columns: 3fr 1fr;
//   grid-column-gap: 1em;

//   input {
//     background: black;
//     color: white;
//     border: 3px solid white;
//   }

//   button {
//     background: white;
//     color: black;
//     border: 3px solid white;
//     font-family: monospace;
//     font-size: 1.3em;
//     text-transform: uppercase;
//   }
// }
</style>