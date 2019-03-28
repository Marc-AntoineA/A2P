
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

const LOG_REQUESTS = true;

// TODO handling cache?
function fetchData(path) {
  if (LOG_REQUESTS) console.log(`fetching ${path}`);
  return new Promise((resolve, reject) => {
    fetch(path).then((results) => {
        resolve(results.json());
      }).catch((err) => {
        reject(err);
      });
  });
}

// TODO add token
function postData(path, token, data) {
  if (LOG_REQUESTS) console.log(`post ${path}: ${JSON.stringify(data)} with token ${token}`);
  return new Promise((resolve, reject) => {
    fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
      mode: 'cors',
      headers:{
       'Content-Type': 'application/json'
     }
   }).then((response) => {
      resolve(response.json());
    }).catch((err) => {
      reject(err);
    });
  });
}

export function fetchProcesses(){
  return fetchData(API_PATH + settings.GET_ALL_PROCESSES);
}

export function login(userCredentials){
  return new Promise((resolve, reject) => {
    postData(API_PATH + settings.LOGIN, undefined, userCredentials).then((response) => {
      console.log('response', response, ' <-- response');
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
