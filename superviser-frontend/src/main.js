import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/loadElement';
import { sync } from 'vuex-router-sync';
import { createStore } from './store';
import { createRouter } from './router';
import './plugins/element.js'

// TODO remove
import AapHeader from './components/common/AapHeader.vue';

Vue.use(AapHeader);
Vue.use('ElementUI');

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
