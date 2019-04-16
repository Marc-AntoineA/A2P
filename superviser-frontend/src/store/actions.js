import {
  fetchProcesses,
  fetchProcess,
  createEmptyProcess,
  createCopyProcess,
  deleteProcessById,
  updateProcessById,
  openProcessById
} from '../api/process.js';

import { login } from '../api/login.js';

import {
  fetchApplicantsByProcessId,
  updateStepStatusByApplicantId,
  updateStepMarkByApplicantId
} from '../api/applicant.js';

export default {
  FETCH_PROCESSES: ({ commit, state, dispatch }) => {
    return new Promise((resolve, reject) => {
      fetchProcesses(state.user.token).then((processes) => {
        commit('SET_PROCESSES', { processes });
        resolve(processes);
      }).catch(({code, error}) => {
        if (code == 401) dispatch('LOGOUT');
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
          if (code == 401) dispatch('LOGOUT');
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
          if (code == 401) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  CREATE_PROCESS_COPY: ({ commit, state, dispatch }, processId) => {
    return new Promise((resolve, reject) => {
      createCopyProcess(state.user.token, processId)
      .then((process) => {
        commit('SET_PROCESSES', { processes: [ process ]});
        resolve(process);
      }).catch(({ error, code }) => {
        if (code == 401) dispatch('LOGOUT');
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
          if (code == 401) dispatch('LOGOUT');
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
          if (code == 401) dispatch('LOGOUT');
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
          if (code == 401) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  FETCH_APPLICANTS_BY_PROCESS_ID: ({ commit, state, dispatch }, processId) => {
    return new Promise((resolve, reject) => {
      fetchApplicantsByProcessId(state.user.token, processId)
        .then((applicants) => {
          commit('SET_APPLICANTS', applicants);
          resolve(applicants);
        }).catch(({code, error }) => {
          if (code == 401) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  UPDATE_MARK_STEP: ({ commit, state, dispatch }, { applicantId, stepIndex, mark }) => {
    return new Promise((resolve, reject) => {
      updateStepMarkByApplicantId(state.user.token, applicantId, stepIndex, mark)
      .then(() => {
        commit('SET_STEP_MARK', { applicantId, stepIndex, mark});
        resolve();
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  UPDATE_STATUS_STEP: ({ commit, state, dispatch }, { applicantId, stepIndex, status }) => {
    return new Promise((resolve, reject) => {
      updateStepStatusByApplicantId(state.user.token, applicantId, stepIndex, status)
      .then(() => {
        commit('SET_STEP_STATUS', { applicantId, stepIndex, status});
        resolve();
      }).catch((error) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    })
  }
}
