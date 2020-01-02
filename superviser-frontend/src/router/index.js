import Vue from 'vue';
import Router from 'vue-router';
import Config from '../../vue.config.js';

Vue.use(Router);

// import pages
const LoginView = () => import('../views/LoginView.vue');
const WelcomeView = () => import('../views/WelcomeView.vue');
const ProcessesView = () => import('../views/ProcessesView.vue');
const ProcessView = () => import('../views/ProcessView.vue');
const ApplicantsView = () => import('../views/ApplicantsView.vue');
const Error404View = () => import('../views/Error404View.vue');
const TemplatesView = () => import('../views/TemplatesView.vue');
const InterviewsView = () => import('../views/InterviewsView.vue');

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0}),
    base: Config.publicPath,
    routes: [
      {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { requiresAuth: false }
      },
      {
        path: '/',
        name: 'welcome',
        component: WelcomeView,
        meta: { requiresAuth: true }
      },
      {
        path: '/processes',
        name: 'processes',
        component: ProcessesView,
        meta: { requiresAuth: true }
      },
      {
        path: '/process/:processId/',
        name: 'process',
        component: ProcessView,
        meta: { requiresAuth: true }
      },
      {
        path:'/applicants',
        name: 'applicants',
        component: ApplicantsView,
        meta: { requiresAuth: true },
      },
      {
        path:'/applicants/:processId',
        name: 'applicantsInitialProcessId',
        component: ApplicantsView,
        meta: { requiresAuth: true },
      },
      {
        path:'/templates',
        name: 'templatesNoSelected',
        component: TemplatesView,
        meta: { requiresAuth: true }
      },
      {
        path:'/templates/:templateName',
        name: 'template',
        component: TemplatesView,
        meta: { requiresAuth: true }
      },
      {
        path: '/interviews',
        name: 'interviews',
        component: InterviewsView,
        meta: { requiresAuth: true }
      },
      {
        path:'/interviews/:processId',
        name: 'interviews-processId',
        component: InterviewsView,
        meta: { requiresAuth: true }
      },
      {
        path: '/*',
        name: 'error404',
        component: Error404View,
        meta: { requiresAuth: false }
      }
    ]
  });
}
