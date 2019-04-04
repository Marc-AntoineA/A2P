'use strict';

export function getProcess(state, identifier) {
  return state.processes[identifier.processId];
}

export function getStep(state, identifier) {
  return getProcess(state, identifier).steps[identifier.stepIndex];
}

export function getPage(state, identifier) {
  return getStep(state, identifier).pages[identifier.pageIndex];
}

export function getQuestion(state, identifier) {
  return getPage(state, identifier).questions[identifier.questionIndex];
}
