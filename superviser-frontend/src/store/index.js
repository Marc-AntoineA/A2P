import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

/*
 * Notation:
 * { [id: number]: Process } means a dict of ProcessES indexed by id
 */

export function createStore() {
  return new Vuex.Store({
    state: {
      processes: {/* [id: number]: Process */},
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    },
    actions,
    mutations,
    getters
  });
}
