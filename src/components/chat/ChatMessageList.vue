<template>
  <div
      class="chat-messages" 
      :style="`--mess-list-width: ${actualWidth}%; --mess-skew: ${skew}deg`
  ">
    <ul ref="msgParent">
      <li v-for="(msg, index) in messages" :key="index" :class="msg.id == selfID ? 'is-self' : 'is-other'">
        <div class="msg-inner">
          <span class="msg-name-mini">{{ msg.name }}</span>
          <div class="msg-text">
            <ChatMessageSingle :msg="msg.text" />
            <!-- <span class="msg-text-inner">{{ splitByStockWords(msg.text) }}</span> -->
            <ChatReactionResults :reactions="msg.reactions" :effectiveLength="visibleReactions(msg)" :user="selfID" />
          </div>
          
        </div>
        <ChatReacts :messageID="index" :user="selfID" />
      </li>
    </ul>
  </div>
</template>

<script>
import ChatMessageSingle from './ChatMessageSingle.vue';
import ChatReacts from './ChatReacts.vue';
import ChatReactionResults from './ChatReactionResults.vue';

export default {
  components: {
    ChatMessageSingle,
    ChatReacts,
    ChatReactionResults
  },
  props: {
    width: Number,
  },
  data() {
    return {
      skew: 0,
      actualWidth: 0,
    }
  },
  computed: {
    messages() {
      return this.$store.state.chat.messages;
    },
    selfID() {
      const u = this.$store.state.chat.selfID;
      console.log(u);
      return u;
    },
    // stockWords() {
    //   return this.$store.state.market.stockWords;
    // }
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
      this.widthCalc(newV, oldV);
    }
  },
  mounted() {
    this.widthCalc(100, 100);
  },
  methods: {
    widthCalc(newV, oldV) {
      let w;
      if (Math.random() > 0.5) {
        w = Math.max(100.0, 100 + (newV / 2.0));
      } else {
        w = Math.max(100, oldV);
      }

      this.actualWidth = w;
      // this.skew = w / 100.0;
      this.skew = 0;
    },
    visibleReactions(m) {
      let len = 0;
      for (let react of m.reactions) {
        if (react.by.length > 0) {
          len += react.by.length;
        }
      }

      return len;
    },
    // splitByStockWords(msg) {
    //   const result = msg.split(/(hello|yes)/);
    //   console.log(result);

    //   return result;
    // }
  }
}
</script>

<style lang="scss">
.chat-messages {
  --mess-list-width: 100%;
  --mess-skew: 0deg;

  font-family: var(--chat-font);
  overflow-x: scroll;
  padding: 1.5em;
  transform: skewY(var(--mess-skew));
  // width: var(--mess-list-width);
  width: 100%;

  ul {
    height: 100%;
    list-style-type: none;
    margin: 0;
    padding-left: 0;

    li {
      word-break: break-word;
      padding-bottom: 1.5em;

      display: grid;
      grid-template-columns: 1fr 4em;
      grid-column-gap: 1em;

      .msg-name-mini {
        display: block;
        color: rgb(69, 69, 69);
        font-size: 0.65em;
      }

      .msg-text {
        background-color: #bfdef0;
        border-radius: 5px;
        box-shadow: 1px 1px 1px rgba(0,0,0,0.15);
        color: black;
        display: inline-block;
        font-size: 0.8em;
        padding: 0.4em;
        position: relative;
        width: 100%;
      }
    }
  }

  .is-self {
    grid-template-columns: 4em 1fr;

    .msg-text {
      grid-column: 2;
    }
    .chat-reacts {
      grid-column: 1;
      grid-row: 1;
    }
  }
}

</style>