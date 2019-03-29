import { fetchProcesses, login } from '../api';

console.log(fetchProcesses);

export default {
  FETCH_PROCESSES: ({ commit, state }) => {
    return fetchProcesses(state.user.token).then((processes) => {
      commit('SET_PROCESSES', { processes });
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
