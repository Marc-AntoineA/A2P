import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// import pages
const LoginView = () => import('../views/LoginView.vue');
const WelcomeView = () => import('../views/WelcomeView.vue');
const CampaignsView = () => import('../views/CampaignsView.vue');

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0}),
    routes: [
      { path: '/login', component: LoginView },
      { path: '/', component: WelcomeView },
      { path: '/campaigns', component: CampaignsView }
    ]
  });
}
