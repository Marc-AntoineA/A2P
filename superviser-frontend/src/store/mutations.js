import Vue from 'vue';

export default {
  SET_PROCESSES: (state, { processes }) => {
    console.log('processes :', processes);
    processes.forEach((process) => {
      if (process) Vue.set(state.processes, process._id, process);
    });
  },
  SET_USER: (state, { user }) => {
    if (user) Vue.set(state.user, user);
    console.log('set user', user, state.user);
  },
  REMOVE_USER: (state) => {
    Vue.set(state.user, {});
    Vue.set(state.processes, {});
  }
}
