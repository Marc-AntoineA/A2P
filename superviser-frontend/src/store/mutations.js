import Vue from 'vue';

export default {
  SET_PROCESSES: (state, { processes }) => {
    processes.forEach((process) => {
      if (process) Vue.set(state.processes, process._id, process);
    });
  },
  REMOVE_PROCESSES: (state, processesId) => {
    processesId.forEach(processId => {
      Vue.delete(state.processes, processId);
    });
  },
  SET_USER: (state, { user }) => {
    state.user = user;
  },
  REMOVE_USER: (state) => {
    state.user = {};
    state.processes = {};
  },
  REMOVE_QUESTION: (state, { processId, stepIndex, pageIndex, questionIndex}) => {
    Vue.delete(state.processes[processId].steps[stepIndex].pages[pageIndex].questions, questionIndex);
  }
}
