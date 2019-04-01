import { fetchProcesses, fetchProcess, login } from '../api';

export default {
  FETCH_PROCESSES: ({ commit, state }) => {
    return new Promise((resolve, reject) => {
      console.log('state into fetch_processes', state.user.token);
      fetchProcesses(state.user.token).then((processes) => {
        commit('SET_PROCESSES', { processes });
        console.log("resolve fetch processes");
        resolve(processes);
      }).catch((err) => reject(err));
    });
  },
  FETCH_PROCESS: ({ commit, state }, processId) => {
    return new Promise((resolve, reject) => {
      fetchProcess(state.user.token, processId).then((process) => {
        commit('SET_PROCESSES', { processes: [process] });
        resolve(process);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  LOGIN: ({ commit, state }, credentials) => {
    return new Promise((resolve, reject) => {
      login(credentials).then((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        commit('SET_USER', { user });
        resolve(user);
      }).catch((err) => {
        localStorage.removeItem('user');
        reject(err);
      });
    });
  },
  LOGOUT: ({ commit, state }) => {
    commit('REMOVE_USER');
    localStorage.removeItem('user');
  }
}
