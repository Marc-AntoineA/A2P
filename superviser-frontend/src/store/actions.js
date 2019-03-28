import { fetchProcesses, login } from '../api';

console.log(fetchProcesses);

export default {
  FETCH_PROCESSES: ({ commit, state }) => {
    return fetchProcesses().then((processes) => {
      commit('SET_PROCESSES', { processes });
    });
  },
  LOGIN: ({ commit, state }, credentials) => {
    return login(credentials).then((user) => {
      commit('SET_USER', { user });
    });
  }
}
