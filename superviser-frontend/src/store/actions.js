import {
  fetchProcesses,
  fetchProcess,
  createEmptyProcess,
  login,
  deleteProcessById,
  updateProcessById,
  openProcessById
 } from '../api';

export default {
  FETCH_PROCESSES: ({ commit, state, dispatch }) => {
    return new Promise((resolve, reject) => {
      fetchProcesses(state.user.token).then((processes) => {
        commit('SET_PROCESSES', { processes });
        resolve(processes);
      }).catch(({code, error}) => {
        if (Math.floor(code / 100) === 4) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  FETCH_PROCESS: ({ commit, state, dispatch }, processId) => {
    return new Promise((resolve, reject) => {
      fetchProcess(state.user.token, processId)
        .then((process) => {
          commit('SET_PROCESSES', { processes: [process] });
          resolve(process);
        }).catch(({code, error}) => {
          if (Math.floor(code / 100) === 4) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  CREATE_PROCESS: ({ commit, state, dispatch }) => {
    return new Promise((resolve, reject) => {
      createEmptyProcess(state.user.token)
        .then((process) => {
          commit('SET_PROCESSES', { processes: [process]});
          resolve(process);
        }).catch(({error, code }) => {
          if (Math.floor(code / 100) === 4) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  DELETE_PROCESS: ({ commit, state, dispatch }, processId) => {
    return new Promise((resolve, reject) => {
      deleteProcessById(state.user.token, processId)
        .then(() => {
          commit('REMOVE_PROCESSES', [processId]);
          resolve();
        }).catch(({ code, error}) => {
          if (Math.floor(code / 100) === 4) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  LOGIN: ({ commit }, credentials) => {
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
  LOGOUT: ({ commit }) => {
    commit('REMOVE_USER');
    localStorage.removeItem('user');
  },
  PUT_PROCESS: ({ commit, state, dispatch }, processId) => {
    return new Promise((resolve, reject) => {
      updateProcessById(state.user.token, processId, state.processes[processId])
        .then((process) => {
          commit('SET_PROCESSES', { processes: [process]});
          resolve(process);
        }).catch(({code, error}) => {
          if (Math.floor(code / 100) === 4) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  OPEN_PROCESS: ({ commit, state, dispatch }, processId) => {
    return new Promise((resolve, reject) => {
      openProcessById(state.user.token, processId, state.processes[processId])
        .then((process) => {
          commit('SET_PROCESSES', { processes: [process]});
          resolve(process);
        }).catch(({code, error }) => {
          if (Math.floor(code / 100) === 4) dispatch('LOGOUT');
          reject(error);
        });
    });
  }
}
