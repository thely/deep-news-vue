import Vue from 'vue'

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

import store from "./store";
import App from "./App.vue";
// import directive from "./utils/click-outside.js";

Vue.config.productionTip = false;

const socket = io('http://localhost:8081', { cors: ['*'] });
Vue.use(VueSocketIOExt, socket, { store });

// Vue.directive('click-outside', directive);

Vue.directive('click-outside', {
  bind: function (element, binding, vnode) {
    element.clickOutsideEvent = function (event) {  //  check that click was outside the el and his children
      if (!(element === event.target || element.contains(event.target))) { // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
        // binding.value(); run the arg
      }
    };
    document.body.addEventListener('click', element.clickOutsideEvent)
  },
  unbind: function (element) {
    document.body.removeEventListener('click', element.clickOutsideEvent)
  }
});

new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')
