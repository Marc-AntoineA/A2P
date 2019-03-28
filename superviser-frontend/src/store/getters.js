export default {
  // TODO
  activeProcesses(state, getters) {
    return state.processes;
  },
  isLoggedIn(state, getters) {
    return state.user !== {};
  }
}
