import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// import pages
const LoginView = () => import('../views/LoginView');

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0}),
    routes: [
      { path: '/login', component: LoginView }
    ]
  });
}
