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
