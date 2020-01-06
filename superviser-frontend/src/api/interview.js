'using strict';
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

const { request } = require('./utils.js');

function fetchInterviewsByProcessId(token, processId) {
  return request({
    url: API_PATH + '/interviews/' + processId,
    data: undefined,
    token: token
  }, 'get', 'no-cache');
}

function addInterviewSlot(token, interview) {
  return request({
    url: API_PATH + '/interviews/create',
    data: interview,
    token: token
  }, 'post', 'no-cache');
}

function deleteInterview(token, interviewId) {
  return request({
    url: API_PATH + '/interviews/delete/' + interviewId,
    data: undefined,
    token: token
  }, 'delete', 'no-cache');
}

function deleteInterviews(token, processId, beginStr, endStr) {
  return request({
    url: API_PATH + `/interviews/delete/${processId}/${beginStr}/${endStr}`,
    data: undefined,
    token: token
  }, 'delete', 'no-cache');
}

function updateInterview(token, interview) {
  return request({
    url: `${API_PATH}/interviews/update/`,
    data: interview,
    token: token
  }, 'put', 'no-cache');
}

export default { fetchInterviewsByProcessId, addInterviewSlot, deleteInterview, deleteInterviews, updateInterview };
