<template>
  <div class="chat-reacts" v-click-outside="hideDisplay">
    <div v-if="showArray" class="react-array">
      <ul>
        <li class="emoji-single" v-for="(em, index) in reacts" :key="index">
          <span 
              @click="emojiClick($event, index)" 
              :class="em.clicked && em.by.includes(user) ? 'clicked' : ''">
                {{ em.emoji }}
          </span>
        </li>
      </ul>
    </div>
    <div class="react-toggle" @click="showArray = !showArray" :class="showArray ? 'react-toggle-active' : ''">
      <!-- <span v-if="!showArray" class="toggle-down">☺</span> -->
      <!-- <span v-else class="toggle-up">☺</span> -->
      <span>☺</span>
    </div>
  </div>
</template>

<script>
import emojis from "@/utils/emoji-list.json";

export default {
  props: {
    messageID: Number,
    user: String,
  },
  data() {
    return {
      showArray: false,
      reacts: [],
    }
  },
  mounted() {
    let tester = [];
    const allCats = Object.keys(emojis);

    for (let i = 0; i < 4; i++) {
      const c = allCats[Math.floor(Math.random() * allCats.length)];
      const index = Math.floor(Math.random() * emojis[c].length);
      const emoji = emojis[c][index];
      tester.push({
        emoji: emoji.emoji,
        category: c,
        index: index,
        clicked: false,
        by: [],
      });

    }

    this.reacts = tester;
  },
  methods: {
    emojiClick(_e, index) {
      this.reacts[index].clicked = !this.reacts[index].clicked;
      // this.$emit("reactClicked", _e, this.reacts[index], this.messageID);

      this.$store.commit("chat/updateMsgReaction", {
        msgID: this.messageID,
        user: this.user,
        react: this.reacts[index], // current emoji only
        enabled: this.reacts[index].clicked
      });
    },
    hideDisplay() {
      this.showArray = false;
    }
  }
}
</script>

<style lang="scss">
.chat-reacts {
  position: relative;

  display: flex;
  align-items: center;

  .react-toggle {
    position: relative;
    border: 1px solid grey;
    color: grey;
    text-align: center;
    border-radius: 20px;
    width: 1.2em;
    height: 1.2em;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:hover {
      background-color: rgb(89, 202, 255);
      color: blue;
    }

    .toggle-up {
      margin-top: -0.25em;
    }

    &.react-toggle-active {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border: 0px solid transparent;
      background: white;
      color: black;
    }
  }

  .react-array {
    position: absolute;
    top: -1em;
    right: 0;
    width: 5em;
    z-index: 100;

    font-size: 1.35em;

    border: 1px solid white;
    border-radius: 10px;
    background-color: white;
    padding: 2px 1px 0;

    ul {
      display: flex;
      justify-content: space-around;
    }

    li {
      cursor: pointer;
      display: inline;
      padding-bottom: 0;

      .clicked {
        background-color: yellow;
      }

      &:hover {
        background-color: yellow;
      }
    }
  }
}

.is-self .chat-reacts {
  display: flex;
  justify-content: right;

  .react-array {
    left: 0;
    right: auto;
  }
}
</style>