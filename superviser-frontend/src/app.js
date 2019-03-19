import Vue from 'vue';
import App from './App.vue';
import { sync } from 'vuex-router-sync';
import { createStore } from './store';
import { createRouter } from './router';

export function createApp() {
  const router = createRouter();
  const store = createStore();
  sync(store, router);

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
