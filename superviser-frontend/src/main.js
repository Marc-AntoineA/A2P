import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/loadElement';
import { sync } from 'vuex-router-sync';
import { createStore } from './store';
import { createRouter } from './router';
import './plugins/element.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { dateFormatter } from './filters';

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(ElementUI);

Vue.filter('dateFormatter', dateFormatter);

export function createApp() {
  const router = createRouter();
  const store = createStore();

  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters.isLoggedIn) {
        next();
        return;
      }
      next('/login');
    } else {
      next();
    }
  })

  sync(store, router);

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { app, router, store };
}

const { app } = createApp();
app.$mount('#app');
