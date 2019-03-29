export default {
  // TODO
  activeProcesses(state, getters) {
    return state.processes;
  },
  isLoggedIn(state, getters) {
    return !(Object.entries(state.user).length === 0
      && state.user.constructor === Object);
  }
}
