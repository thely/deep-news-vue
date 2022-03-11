<template>
  <div class="chat-writing">
    <form class="chat-form" action="" @submit.prevent="addMessage">
      <input v-model="message" type="text" class="chat-input" placeholder="Write something..." />
      <button type="submit" class="chat-submit">Enter</button>
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
  methods: {
    addMessage() {
      this.$socket.client.emit("message", { msg: this.message });
      this.message = "";
    }
  },
}
</script>

<style lang="scss">

.chat-form {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-column-gap: 1em;

  input {
    background: black;
    color: white;
    border: 3px solid white;
  }

  button {
    background: white;
    color: black;
    border: 3px solid white;
    font-family: monospace;
    font-size: 1.3em;
    text-transform: uppercase;
  }
}

</style>