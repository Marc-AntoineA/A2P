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
    if (value === '') return;
    const choices = getQuestion(state, identifier).choices;
    Vue.set(choices, choices.length, value);
  }
}
