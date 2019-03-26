import Vue from 'vue';

export default {
  SET_PROCESSES: (state, { processes }) => {
    console.log(state.processes);
    processes.forEach((process) => {
      if (process) Vue.set(state.processes, process._id, process);
    })
  }
}
