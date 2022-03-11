import Vue from 'vue'

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

import store from "./store";
import App from './App.vue'

Vue.config.productionTip = false;

const socket = io('http://localhost:3000', { cors: ['*'] });
Vue.use(VueSocketIOExt, socket, { store });

new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')
