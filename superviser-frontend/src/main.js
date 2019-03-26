import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/loadElement';
import { sync } from 'vuex-router-sync';
import { createStore } from './store';
import { createRouter } from './router';
import './plugins/element.js'

Vue.use('ElementUI');

export function createApp() {
  const router = createRouter();
  const store = createStore();
  sync(store, router);
  console.log(store);

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { app, router, store };
}

// TODO. see how entry-client.js works
const { app, router, store } = createApp();
app.$mount('#app');
