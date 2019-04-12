export default {
  isLoggedIn(state) {
    return !(Object.entries(state.user).length === 0
      && state.user.constructor === Object);
  }
}
