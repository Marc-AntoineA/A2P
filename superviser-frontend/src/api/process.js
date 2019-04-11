'using strict';
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

const { request } = require('./utils.js');

export function fetchProcesses(token){
  return request({
      url: API_PATH + settings.GET_ALL_PROCESSES,
      data: undefined,
      token: token
    }, 'get', 'no-cache');
}

export function fetchProcess(token, processId) {
  return request({
    url: API_PATH + settings.GET_ONE_PROCESS + processId,
    data: undefined,
    token: token
  }, 'get', 'no-cache');
}

export function createEmptyProcess(token) {
  return new Promise((resolve, reject) => {
    request({
      url: API_PATH + settings.CREATE_EMPTY_PROCESS,
      data: undefined,
      token: token,
    }, 'post').then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

export function deleteProcessById(token, processId) {
  return new Promise((resolve, reject) => {
    request({
      url: API_PATH + settings.DELETE_PROCESS + processId,
      data: undefined,
      token: token
    }, 'delete').then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

export function updateProcessById(token, processId, process) {
  return new Promise((resolve, reject) => {
    request({
      url: API_PATH + settings.GET_ONE_PROCESS + processId,
      data: process,
      token: token
    }, 'put').then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

export function openProcessById(token, processId, process) {
  return new Promise((resolve, reject) => {
    request({
      url: API_PATH + settings.OPEN_PROCESS + processId,
      data: undefined,
      token: token
    }, 'put').then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}
