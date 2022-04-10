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
            <span class="msg-text-inner">{{ msg.text }}</span>

            <!-- <div v-if="'reactions' in msg && visibleReactions(msg)" class="msg-reactions">
              <template v-for="(react, rindex) in msg.reactions" >
                <span v-if="react.clicked" :key="rindex">{{ react.emoji }}</span>
              </template>
            </div> -->
            <ChatReactionResults :reactions="msg.reactions" :effectiveLength="visibleReactions(msg)" />
          </div>
          
        </div>
        <ChatReacts @reactClicked="addReactions" :messageID="index"/>
      </li>
    </ul>
  </div>
</template>

<script>
import ChatReacts from './ChatReacts.vue';
import ChatReactionResults from './ChatReactionResults.vue';

export default {
  components: {
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
      return this.$store.state.chat.selfID;
    },

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
    addReactions(e, data, index) {
      let m = this.messages[index];
      let contains = false;
      m.reactions = m.reactions.map((react) => {
        if (react.emoji == data.emoji) {
          console.log(data);
          contains = true;
          return data;
        }
        return react;
      });

      if (!contains) {
        m.reactions.push(data);
      }
      this.$socket.client.emit("updateMessage", m);
    },
    widthCalc(newV, oldV) {
      let w;
      if (Math.random() > 0.5) {
        w = Math.max(100, newV);
      } else {
        w = oldV;
      }

      this.actualWidth = w;
      this.skew = w / 100.0;

      console.log(this.actualWidth);
    },
    visibleReactions(m) {
      let len = 0;
      for (let react of m.reactions) {
        if (react.clicked) {
          len++;
        }
      }

      return len;
    }
  }
}
</script>

<style lang="scss">
.chat-messages {
  --mess-list-width: 100%;
  --mess-skew: 0deg;
  overflow-x: scroll;
  padding: 1.5em;
  transform: skewY(var(--mess-skew));
  width: var(--mess-list-width);

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
        color: #aaa;
        font-size: 0.65em;
      }

      .msg-text {
        background-color: blue;
        display: inline-block;
        padding: 0.2em;
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