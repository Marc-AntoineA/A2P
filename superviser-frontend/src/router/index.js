import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// import pages
const LoginView = () => import('../views/LoginView.vue');
const WelcomeView = () => import('../views/WelcomeView.vue');
const ProcessesView = () => import('../views/ProcessesView.vue');
const TmpView = () => import('../views/TemplateView.vue');

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0}),
    routes: [
      { path: '/login', component: LoginView },
      { path: '/', component: WelcomeView },
      { path: '/processes', component: ProcessesView },
      { path: '/tmp', component: TmpView }, // TODO remove
    ]
  });
}
