import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// import pages
const LoginView = () => import('../views/LoginView.vue');
const WelcomeView = () => import('../views/WelcomeView.vue');
const ProcessesView = () => import('../views/ProcessesView.vue');
const ProcessView = () => import('../views/ProcessView.vue');
const ApplicantsView = () => import('../views/ApplicantsView.vue');
const Error404View = () => import('../views/Error404View.vue');
const TemplatesView = () => import('../views/TemplatesView.vue');

export function createRouter() {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0}),
    routes: [
      {
        path: '/administration/login',
        name: 'login',
        component: LoginView,
        meta: { requiresAuth: false }
      },
      {
        path: '/administration',
        name: 'welcome',
        component: WelcomeView,
        meta: { requiresAuth: true }
      },
      {
        path: '/administration/processes',
        name: 'processes',
        component: ProcessesView,
        meta: { requiresAuth: true }
      },
      {
        path: '/administration/process/:processId/',
        name: 'process',
        component: ProcessView,
        meta: { requiresAuth: true }
      },
      {
        path:'/administration/applicants',
        name: 'applicants',
        component: ApplicantsView,
        meta: { requiresAuth: true },
      },
      {
        path:'/administration/applicants/:processId',
        name: 'applicantsInitialProcessId',
        component: ApplicantsView,
        meta: { requiresAuth: true },
      },
      {
        path:'/administration/templates',
        name: 'templatesNoSelected',
        component: TemplatesView,
        meta: { requiresAuth: true }
      },
      {
        path:'/administration/templates/:templateName',
        name: 'template',
        component: TemplatesView,
        meta: { requiresAuth: true }
      },
      {
        path: '/administration/*',
        name: 'error404',
        component: Error404View,
        meta: { requiresAuth: false }
      }
    ]
  });
}
