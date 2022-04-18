<template>
  <div class="chat-writing">
    <chat-ban-warning v-if="warnWord" :word="warnWord"/>
    <form class="chat-form" action="" @submit.prevent="addMessage">
      <input v-model="message" type="text" class="chat-input" @keyup="watchInput" placeholder="What's on your mind?" />
      <button type="submit" class="chat-submit">Share</button>
    </form>
  </div>
</template>

<script>
import ChatBanWarning from './ChatBanWarning.vue';

export default {
  components: { ChatBanWarning },
  data() {
    return {
      message: "",
      warnWord: "",
    }
  },
  computed: {
    selfID() {
      return this.$store.state.chat.selfID;
    },
    bannedWords() {
      return this.$store.state.chat.bannedWords;
    }
  },
  methods: {
    addMessage() {
      if (this.message.length > 0) {
        const ban = this.checkBan(this.message);

        if (ban.length <= 0) {
          this.$socket.client.emit("message", { msg: this.message, id: this.selfID });
          this.message = "";
        } else {
          this.warnWord = ban[0];
        }
      }
    },
    watchInput(e) {
      const ban = this.checkBan(e.target.value);
      if (ban.length > 0) {
        this.warnWord = ban[0];
      } else {
        this.warnWord = "";
      }
    },
    checkBan(message) {
      const ban = this.bannedWords.filter((word) => message.includes(word));
      return ban;
    }
  },
}
</script>

<style lang="scss">
.chat-writing {
  font-family: var(--chat-font);
  padding: 1em;
  position: relative;
}

.chat-form {
  display: grid;
  grid-template-columns: 5fr 1fr;
  grid-column-gap: 1em;

  input, button {
    border-radius: 5px;
    
  }

  input {
    background: white;
    color: black;
    border: 0px solid transparent;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.15) inset;
  }

  button {
    background: #bfdef0;
    color: black;
    border: 3px solid #bfdef0;
    // font-family: monospace;
    font-size: 0.7em;
    // text-transform: uppercase;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
  }
}

</style>