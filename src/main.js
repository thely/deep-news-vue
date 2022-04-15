import Vue from 'vue'

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import MarqueeText from 'vue-marquee-text-component';

import store from "./store";
import App from "./App.vue";

Vue.config.productionTip = false;

let url = 'http://localhost:8081';
url = process.env.VUE_APP_SERVER;

const socket = io(url, { cors: ['*'] });
Vue.use(VueSocketIOExt, socket, { store });
Vue.component('marquee-text', MarqueeText);

Vue.directive('click-outside', {
  bind: function (element, binding, vnode) {
    element.clickOutsideEvent = function (event) {  //  check that click was outside the el and his children
      if (!(element === event.target || element.contains(event.target))) { // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
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
