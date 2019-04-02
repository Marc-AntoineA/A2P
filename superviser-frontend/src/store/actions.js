import {
  fetchProcesses,
  fetchProcess,
  createEmptyProcess,
  login,
  deleteProcessById
 } from '../api';

export default {
  FETCH_PROCESSES: ({ commit, state }) => {
    return new Promise((resolve, reject) => {
      fetchProcesses(state.user.token).then((processes) => {
        commit('SET_PROCESSES', { processes });
        resolve(processes);
      }).catch((err) => reject(err));
    });
  },
  FETCH_PROCESS: ({ commit, state }, processId) => {
    return new Promise((resolve, reject) => {
      fetchProcess(state.user.token, processId)
        .then((process) => {
          commit('SET_PROCESSES', { processes: [process] });
          resolve(process);
        }).catch((err) => {
          reject(err);
        });
    });
  },
  CREATE_PROCESS: ({ commit, state }) => {
    return new Promise((resolve, reject) => {
      createEmptyProcess(state.user.token)
        .then((process) => {
          commit('SET_PROCESSES', { processes: [process]});
          resolve(process);
        }).catch((err) => {
          reject(err);
        });
    });
  },
  DELETE_PROCESS: ({ commit, state }, processId) => {
    return new Promise((resolve, reject) => {
      deleteProcessById(state.user.token, processId)
        .then((result) => {
          commit('REMOVE_PROCESSES', [processId]);
          resolve();
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
