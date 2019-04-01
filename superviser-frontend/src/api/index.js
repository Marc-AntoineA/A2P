
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

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
      if (results.status !== 200 && results.status !== 201 && results.status.status !== 304) {
        results.json()
          .then((response) => reject(response.error))
          .catch((error) => reject(error));
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
    }, 'get');
};

export function fetchProcess(token, processId) {
  return request({
    url: API_PATH + settings.GET_ONE_PROCESS + processId,
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
      resolve(response);
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
}
