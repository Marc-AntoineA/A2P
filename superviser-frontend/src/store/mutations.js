import Vue from 'vue';

import { getProcess, getStep, getPage, getQuestion } from './utils.js';

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
  REMOVE_QUESTION: (state, identifier) => {
    Vue.delete(getPage(state, identifier).questions, identifier.questionIndex);
  },
  MOVE_QUESTION: (state, {identifier, up}) => {
    if (up !== 1 && up !== -1)
      throw new Error(`Error in MOVE_QUESTION: up should be +/-1, ${up} found`);

    const questions = getPage(state, identifier).questions;
    const startLocation = identifier.questionIndex;
    const finalLocation = identifier.questionIndex - up;
    if (finalLocation >= questions.length || finalLocation < 0) return;

    const tmp = questions[startLocation];
    Vue.set(questions, startLocation, questions[finalLocation]);
    Vue.set(questions, finalLocation, tmp);
  },
  ADD_QUESTION: (state, identifier) => {
    const questions = getPage(state, identifier).questions;
    Vue.set(questions, questions.length, {
      label: 'New question',
      choices: [],
      mandatory: false,
      type: "text"
    });
  },
  REMOVE_CHOICE: (state, identifier) => {
    const question = getQuestion(state, identifier);
    Vue.delete(question.choices, identifier.choiceIndex);
  },
  ADD_CHOICE: (state, { identifier, value }) => {
    const choices = getQuestion(state, identifier).choices;
    Vue.set(choices, choices.length, value);
  },
  ADD_STEP: (state, identifier) => {
    const steps = getProcess(state, identifier).steps;
    Vue.set(steps, steps.length, {
      label: 'New step',
      status: 'todo',
      pages: []
    });
  },
  MOVE_STEP: (state, { identifier, up }) => {
    if (up !== 1 && up !== -1)
      throw new Error(`Error in MOVE_STEP: up should be +/-1, ${up} found`);

    const steps = getProcess(state, identifier).steps;
    const startLocation = identifier.stepIndex;
    const finalLocation = identifier.stepIndex - up;
    if (finalLocation >= steps.length || finalLocation < 0) return;

    const tmp = steps[startLocation];
    Vue.set(steps, startLocation, steps[finalLocation]);
    Vue.set(steps, finalLocation, tmp);
  },
  REMOVE_STEP: (state, identifier) => {
    const steps = getProcess(state, identifier).steps;
    Vue.delete(steps, identifier.stepIndex);
  },
  ADD_PAGE: (state, identifier) => {
    const pages = getStep(state, identifier).pages;
    Vue.set(pages, pages.length, {
      label: 'New page',
      caption: 'description',
      questions: []
    });
  },
  MOVE_PAGE: (state, { identifier, up }) => {
    if (up !== 1 && up !== -1)
      throw new Error(`Error in MOVE_PAGE: up should be +/-1, ${up} found`);

    const pages = getStep(state, identifier).pages;
    const startLocation = identifier.pageIndex;
    const finalLocation = identifier.pageIndex - up;
    if (finalLocation >= pages.length || finalLocation < 0) return;

    const tmp = pages[startLocation];
    Vue.set(pages, startLocation, pages[finalLocation]);
    Vue.set(pages, finalLocation, tmp);
  },
  REMOVE_PAGE: (state, identifier) => {
    const pages = getStep(state, identifier).pages;
    Vue.delete(pages, identifier.pageIndex);
  },
  SET_APPLICANTS_BY_PROCESS_ID: (state, { processId, applicants }) => {
    Vue.set(state.applicantsByProcessId, processId, {});
    applicants.forEach((applicant) => {
      if (applicant) Vue.set(state.applicantsByProcessId[processId], applicant._id, applicant);
    });
  },
  SET_STEP_MARK: (state, { applicantId, stepIndex, mark }) => {
    Vue.set(state.applicants[applicantId].process.steps[stepIndex], 'mark', mark);
  },
  SET_STEP_STATUS: (state, { applicantId, stepIndex, status }) => {
    Vue.set(state.applicants[applicantId].process.steps[stepIndex], 'status', status);
  }
}
