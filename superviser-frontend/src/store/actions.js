'using strict';

import processApi from '../api/process.js';
import applicantApi from '../api/applicant.js';
import interviewApi from '../api/interview.js';
import loginApi from '../api/login.js';
import validatorApi from '../api/validator.js';

import moment from 'moment';

export default {
  FETCH_PROCESSES: ({ commit, state, dispatch }) => {
    return new Promise((resolve, reject) => {
      processApi.fetchProcesses(state.user.token).then((processes) => {
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
      processApi.fetchProcess(state.user.token, processId)
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
      processApi.createEmptyProcess(state.user.token)
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
      processApi.createCopyProcess(state.user.token, processId)
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
      processApi.deleteProcessById(state.user.token, processId)
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
      loginApi.login(credentials).then((user) => {
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
      processApi.updateProcessById(state.user.token, processId, state.processes[processId])
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
      processApi.openProcessById(state.user.token, processId, state.processes[processId])
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
      applicantApi.fetchApplicantsByProcessId(state.user.token, processId)
        .then((applicants) => {
          commit('SET_APPLICANTS_BY_PROCESS_ID', { processId, applicants });
          resolve(applicants);
        }).catch(({ code, error }) => {
          if (code == 401) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  UPDATE_MARK_STEP: ({ commit, state, dispatch }, { processId, applicantId, stepIndex, mark }) => {
    return new Promise((resolve, reject) => {
      applicantApi.updateStepMarkByApplicantId(state.user.token, applicantId, stepIndex, mark)
      .then(() => {
        commit('SET_STEP_MARK', { processId, applicantId, stepIndex, mark});
        resolve();
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  UPDATE_STATUS_STEP: ({ commit, state, dispatch }, { processId, applicantId, stepIndex, status, template }) => {
    return new Promise((resolve, reject) => {
      applicantApi.updateStepStatusByApplicantId(state.user.token, applicantId, stepIndex, status, template)
      .then(() => {
        commit('SET_STEP_STATUS', { processId, applicantId, stepIndex, status });
        resolve();
      }).catch(({ code, error }) => {
        if (code === 401) dispatch('LOGOUT');
        reject(error);
      });
    })
  },
  UPDATE_STATUS_APLICANT: ({ commit, state, dispatch }, { processId, applicantId, status }) => {
    return new Promise((resolve, reject) => {
      applicantApi.updateStatusByApplicantId(state.user.token, applicantId, status)
      .then(() => {
        commit('SET_APPLICANT_STATUS', { processId, applicantId, status });
        resolve();
      }).catch(({ code, error }) => {
        if (code === 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  DELETE_APPLICANT_BY_ID: ({ commit, state, dispatch }, { applicantId, processId }) => {
    return new Promise((resolve, reject) => {
      applicantApi.deleteApplicantById(state.user.token, applicantId)
        .then(() => {
          commit('REMOVE_APPLICANT', { processId, applicantId });
          resolve();
        }).catch(({ code, error}) => {
          if (code == 401) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  DOWNLOAD_EXCEL_ANSWERS: ({ state, dispatch }, processId) => {
    return new Promise((resolve, reject) => {
      processApi.downloadProcessAnswers(state.user.token, processId)
        .then((response) => {
          resolve(response);
        }).catch(({ code, error }) => {
          if (code == 401) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  GET_EMAIL_TEMPLATE: ({ state, dispatch }, templateId) => {
    return new Promise((resolve, reject) => {
      applicantApi.getEmailTemplate(state.user.token, templateId)
        .then((response) => {
          resolve(response);
        }).catch(({ code, error }) => {
          if (code == 401) dispatch('LOGOUT');
          reject(error);
        });
    });
  },
  SAVE_EMAIL_TEMPLATE: ({ state, dispatch }, { templateId, template }) => {
    return new Promise((resolve, reject) => {
      applicantApi.saveEmailTemplate(state.user.token, templateId, template)
      .then((response) => {
        resolve(response);
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  GET_LASTS_10_APPLICANTS: ({ commit, state, dispatch }) => {
    return new Promise((resolve, reject) => {
      applicantApi.getLasts10Applicants(state.user.token)
      .then((applicants) => {
        commit('SET_APPLICANTS', applicants);
        resolve(applicants);
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  GET_PENDING_APPLICANTS: ({ commit, state, dispatch }) => {
    return new Promise((resolve, reject) => {
      applicantApi.getPendingApplicants(state.user.token)
      .then((applicants) => {
        commit('SET_APPLICANTS', applicants);
        resolve(applicants);
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  SWITCH_ARCHIVE_APPLICANT_BY_ID: ({ commit, state, dispatch }, { applicantId, processId }) => {
    return new Promise((resolve, reject) => {
      applicantApi.updateArchivedByApplicantId(state.user.token, applicantId, state.applicantsByProcessId[processId][applicantId].archived ? 'unarchive' : 'archive')
      .then(({ message, applicant} ) => {
        commit('SET_APPLICANT_BY_PROCESS_ID_AND_APPLICANT_ID', { processId, applicant });
        resolve(message);
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  FETCH_INTERVIEWS_BY_PROCESS_ID: ({ commit, state, dispatch }, processId) => {
    return new Promise((resolve, reject) => {
      interviewApi.fetchInterviewsByProcessId(state.user.token, processId)
      .then((interviews) => {
        commit('SET_INTERVIEWS_BY_PROCESS_ID', { processId, interviews });
        resolve(interviews);
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  ADD_INTERVIEW_SLOT: ({ commit, state, dispatch }, itw) => {
    return new Promise((resolve, reject) => {
      interviewApi.addInterviewSlot(state.user.token, itw)
      .then((interview) => {
        commit('SET_INTERVIEWS_BY_PROCESS_ID', { processId: interview.processId, interviews: [interview] });
        resolve([interview]);
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  REMOVE_INTERVIEWS_BY_DAY: ({ commit, state, dispatch }, { processId, dateStr }) => {
    return new Promise((resolve, reject) => {
      const begin = moment(dateStr + "T00:00:00");
      const end = moment(dateStr + "T23:59:59");
      interviewApi.deleteInterviews(state.user.token, processId, begin.format('YYYY-MM-DDTHH:mm:ss') + 'Z', end.format('YYYY-MM-DDTHH:mm:ss') + 'Z')
      .then(() => {
        commit('REMOVE_INTERVIEWS', { processId, begin, end });
        resolve();
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  REMOVE_INTERVIEW: ({ commit, state, dispatch }, itw) => {
    return new Promise((resolve, reject) => {
      interviewApi.deleteInterview(state.user.token, itw._id)
      .then(() => {
        commit('REMOVE_INTERVIEW', itw);
        resolve();
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  UPDATE_INTERVIEW_SLOT: ({ commit, state, dispatch }, itw) => {
    return new Promise((resolve, reject) => {
      interviewApi.updateInterview(state.user.token, itw)
      .then((interview) => {
        commit('SET_INTERVIEWS_BY_PROCESS_ID', { processId: interview.processId, interviews: [interview] });
        resolve([interview]);
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  },
  GET_ALL_VALIDATORS: ({ commit, state, dispatch }) => {
    return new Promise((resolve, reject) => {
      validatorApi.fetchValidators(state.user.token)
      .then((validators) => {
        commit('SET_VALIDATORS', validators);
        resolve();
      }).catch(({ code, error }) => {
        if (code == 401) dispatch('LOGOUT');
        reject(error);
      });
    });
  }
}
