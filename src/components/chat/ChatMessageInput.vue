<template>
  <div class="chat-writing">
    <form class="chat-form" action="" @submit.prevent="addMessage">
      <input v-model="message" type="text" class="chat-input" placeholder="What's on your mind?" />
      <button type="submit" class="chat-submit">Share</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
    }
  },
  computed: {
    selfID() {
      return this.$store.state.chat.selfID;
    }
  },
  methods: {
    addMessage() {
      this.$socket.client.emit("message", { msg: this.message, id: this.selfID });
      this.message = "";
    }
  },
}
</script>

<style lang="scss">
.chat-writing {
  font-family: var(--chat-font);
  padding: 1em;
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