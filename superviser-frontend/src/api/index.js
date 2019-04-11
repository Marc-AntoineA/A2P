'using strict';
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

function request({url, data, token}, method, cache) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method,
      body: data ? JSON.stringify(data) : undefined,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      cache: cache ? cache : 'default'
    }).then((results) => {
      if (results.status !== 200 && results.status !== 201 && results.status.status !== 304) {
        results.json()
          .then((response) => reject({code: results.status, error: response.error}))
          .catch((error) => reject({error}));
          return;
      }
      resolve(results.json());
    }).catch((err) => {
      reject(err);
    });
  });
}

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

export function login(userCredentials){
  return new Promise((resolve, reject) => {
    request({
      url: API_PATH + settings.LOGIN,
      data: userCredentials,
      token: ''
    }, 'post').then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

// TODO call this function through an action
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
