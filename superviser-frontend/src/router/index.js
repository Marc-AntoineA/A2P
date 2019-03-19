import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// import pages

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0}),
    routes: []
  });
}
