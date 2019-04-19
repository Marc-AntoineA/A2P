'using strict';
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

const { request } = require('./utils.js');

export function fetchApplicantsByProcessId(token, processId) {
  return request({
    url: API_PATH + settings.GET_APPLICANTS_BY_PROCESS_ID + processId,
    data: undefined,
    token: token
  }, 'get', 'no-cache');
}

export function updateStepStatusByApplicantId(token, applicantId, stepIndex, status) {
  if (status !== 'validated' && status !== 'rejected')
    throw new Error(`status ${status} is undefined`);

  return request({
    url: API_PATH + `/applicants/${applicantId}/${stepIndex}/status/${status}`,
    data: undefined,
    token: token
  }, 'put');
}

export function updateStepMarkByApplicantId(token, applicantId, stepIndex, mark) {
  return request({
    url: API_PATH + `/applicants/${applicantId}/${stepIndex}/mark`,
    data: { mark },
    token: token
  }, 'put');
}

export function updateStatusByApplicantId(token, applicantId, status) {
  return request({
    url: API_PATH + `/applicants/${applicantId}/status/${status}`,
    data: undefined,
    token: token
  }, 'put');
}
