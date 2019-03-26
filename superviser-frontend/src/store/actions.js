import { fetchProcesses } from '../api';

console.log(fetchProcesses);

export default {
  FETCH_PROCESSES: ({ commit, state}) => {
    console.log("hello");
    return fetchProcesses().then((processes) => commit('SET_PROCESSES', { processes }));
  }
}
