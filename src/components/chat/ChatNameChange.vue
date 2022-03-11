<template>
  <div class="chat-name">
    <h4>You are: 
      <span v-show="!changeActive" class="username-display" @click="openField">{{ name }}</span>
      <form v-show="changeActive" class="username-change" action="" @submit.prevent="changeName">
        <input type="text" class="username-text" ref="textInput" v-model="name" />
      </form>
    </h4>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "[[name]]",
      changeActive: false,
    }
  },
  methods: {
    openField() {
      this.name = "";
      this.changeActive = true;
      this.$nextTick(() => this.$refs.textInput.focus())
    },
    changeName() {
      this.changeActive = false;
      this.$socket.client.emit("nameChange", { name: this.name });
    }
  }
}
</script>

<style lang="scss">
.chat-name {
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

  // input {
  //   display: none;
  // }
}
</style>