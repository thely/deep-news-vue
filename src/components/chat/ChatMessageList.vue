<template>
  <div class="chat-messages">
    <ul ref="msgParent">
      <li v-for="(msg, index) in messages" :key="index">
        <span class="msg-name-mini">{{ msg.name }}</span>
        <span class="msg-text">{{ msg.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    messages() {
      return this.$store.state.chat.messages;
    }
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.$refs.msgParent.lastChild.scrollIntoView({ 
          block: "end", behavior: "smooth" 
        });
      });
    },
  }
}
</script>

<style lang="scss">
.chat-messages {
  overflow: scroll;

  ul {
    list-style-type: none;
    padding-left: 0;

    li {
      padding-bottom: 1em;

      .msg-name-mini {
        display: block;
        color: #aaa;
        font-size: 0.8em;
      }
    }
  }
}

</style>