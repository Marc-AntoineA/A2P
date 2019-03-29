
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

const LOG_REQUESTS = true;

function request({url, data, token}, method) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method,
      body: data ? JSON.stringify(data) : undefined,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((results) => {
      resolve(results.json());
    }).catch((err) => {
      reject(err);
    });
  });
}

export function fetchProcesses(token, userId){
  return request({
    url: API_PATH + settings.GET_ALL_PROCESSES,
    data: undefined,
    token: token
  }, 'get');
};

export function login(userCredentials){
  return new Promise((resolve, reject) => {
    request({
      url: API_PATH + settings.LOGIN,
      data: userCredentials,
      token: ''
    }, 'post').then((response) => {
      if (response.error !== undefined) {
        reject(response.error);
      } else {
        resolve(response);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}
