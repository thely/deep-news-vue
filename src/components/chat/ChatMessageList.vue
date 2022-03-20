<template>
  <div class="chat-messages" :style="`--mess-list-width: ${width}%; --mess-skew: ${skew}deg`">
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
  props: {
    width: Number,
  },
  data() {
    return {
      skew: 0,
    }
  },
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
    width(newV, oldV) {
      let w;
      if (Math.random() > 0.5) {
        w = Math.max(100, newV);
      } else {
        w = oldV;
      }

      this.width = w;
      this.skew = w / 100.0;
    }
  }
}
</script>

<style lang="scss">
.chat-messages {
  --mess-list-width: 100%;
  --mess-skew: 0deg;
  overflow-x: scroll;
  transform: skewY(var(--mess-skew));
  width: var(--mess-list-width);

  ul {
    height: 100%;
    list-style-type: none;
    margin: 0;
    padding-left: 0;

    li {
      word-break: break-word;
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