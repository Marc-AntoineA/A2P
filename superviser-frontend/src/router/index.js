import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// import pages
const LoginView = () => import('../views/LoginView.vue');
const WelcomeView = () => import('../views/WelcomeView.vue');
const ProcessesView = () => import('../views/ProcessesView.vue');
const ProcessView = () => import('../views/ProcessView.vue');
const Error404View = () => import('../views/Error404View.vue');

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0}),
    routes: [
      {
        path: '/login',
        component: LoginView,
        meta: { requiresAuth: false }
      },
      {
        path: '/',
        component: WelcomeView,
        meta: { requiresAuth: true }
      },
      {
        path: '/processes',
        component: ProcessesView,
        meta: { requiresAuth: true }
      },
      {
        path: '/process',
        name: 'process-new',
        component: ProcessView,
        meta: { requiresAuth: true }
      },
      {
        path: '/process/:processId',
        name: 'process',
        component: ProcessView,
        meta: { requiresAuth: true }
      },
      {// MUST BE AT THE END
        path: '*',
        component: Error404View,
        meta: { requiresAuth: false }
      }
    ]
  });
}
