'using strict';
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

const { request } = require('./utils.js');

function fetchApplicantsByProcessId(token, processId) {
  return request({
    url: API_PATH + settings.GET_APPLICANTS_BY_PROCESS_ID + processId,
    data: undefined,
    token: token
  }, 'get', 'no-cache');
}

function updateStepStatusByApplicantId(token, applicantId, stepIndex, status, template) {
  if (status !== 'validated' && status !== 'rejected')
    throw new Error(`status ${status} is undefined`);

  return request({
    url: API_PATH + `/applicants/${applicantId}/${stepIndex}/status/${status}`,
    data: template,
    token: token
  }, 'put');
}

function updateStepMarkByApplicantId(token, applicantId, stepIndex, mark) {
  return request({
    url: API_PATH + `/applicants/${applicantId}/${stepIndex}/mark`,
    data: { mark },
    token: token
  }, 'put');
}

function updateStatusByApplicantId(token, applicantId, status) {
  return request({
    url: API_PATH + `/applicants/${applicantId}/status/${status}`,
    data: undefined,
    token: token
  }, 'put');
}

function deleteApplicantById(token, applicantId) {
  return request({
    url: API_PATH + `/delete/applicant/${applicantId}`,
    data: undefined,
    token: token
  }, 'delete');
}

function downloadProcessAnswers(token, processId) {
  return request({
    url: API_PATH + `/applicants/${processId}/download`,
    data: undefined,
    token: token,
    type: 'blob'
  }, 'get');
}

function getEmailTemplate(token, templateId) {
  return request({
    url: API_PATH + `/emails/${templateId}`,
    data: undefined,
    token: token
  }, 'get');
}

function saveEmailTemplate(token, templateId, template) {
  return request({
    url: API_PATH + `/emails/${templateId}`,
    data: { template },
    token: token
  }, 'put');
}

function getLasts10Applicants(token) {
  return request({
    url: API_PATH + '/list/applicants/lasts',
    data: undefined,
    token: token
  }, 'get');
}

function getPendingApplicants(token) {
  return request({
    url: API_PATH + '/list/applicants/pending',
    data: undefined,
    token: token
  }, 'get');
}

function updateArchivedByApplicantId(token, applicantId, value) {
  return request({
    url: API_PATH + `/applicants/${applicantId}/archived/${value}`,
    data: undefined,
    token: token
  }, 'put');
}

export default {
  fetchApplicantsByProcessId, updateStepStatusByApplicantId, updateStepMarkByApplicantId,
  updateStatusByApplicantId, deleteApplicantById, downloadProcessAnswers, getEmailTemplate,
  saveEmailTemplate, getLasts10Applicants, getPendingApplicants, updateArchivedByApplicantId
};
