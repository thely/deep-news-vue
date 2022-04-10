<template>
  <div class="chat-name">
    <h4>You are: 
      <span v-show="!changeActive" class="username-display" @click="openField">{{ name }}</span>
      <form v-show="changeActive" class="username-change" action="" @submit.prevent="changeName">
        <input type="text" class="username-text" ref="textInput" v-model="tempName" />
      </form>
    </h4>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tempName: "",
      changeActive: false,
    }
  },
  computed: {
    name() {
      const n = this.$store.getters["chat/getOwnUsername"];
      // console.log("our name?");
      // console.log(n);
      return n;
    }
  },
  methods: {
    openField() {
      this.tempName = "";
      this.changeActive = true;
      this.$nextTick(() => this.$refs.textInput.focus())
    },
    changeName() {
      this.changeActive = false;
      if (this.tempName != "") {
        this.$socket.client.emit("nameChange", { name: this.tempName });
      } else {
        console.log("needs actual letters!");
      }
    }
  }
}
</script>

<style lang="scss">
.chat-name {
  padding: 1em;
  
  h4 {
    font-weight: normal;
    margin: 0;
    text-align: center;
  }

  form {
    display: inline;
  }

  span {
    font-weight: bold;
    padding: 3px;
    color: black;
    background-color: white;
  }

  span:hover {
    background-color: yellow;
    cursor: pointer;
  }
}
</style>