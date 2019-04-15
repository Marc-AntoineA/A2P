'using strict';

const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

exports.saveLogin = (id, token) => {
  localStorage.setItem('id', id);
  localStorage.setItem('token', token);
};

exports.getLogin = () => {
  return {
    id: localStorage.getItem('id'),
    token: localStorage.getItem('token')
  };
};

function getData(url, token) {
  console.log(url);
  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((results) => {
        resolve(results.json());
      }).catch((err) => {
        reject(err);
      });
  });
}

exports.getStepForm = function(user, index, token) {
  return getData(API_PATH + '/' + user.id + '/' + index, user.token);
};

exports.getSigninForm = function() {
  return getData(API_PATH + settings.GET_SIGNIN_FORM);
};

exports.getProcess = function(user) {
  return getData(API_PATH + settings.GET_PROCESS + user.id, user.token);
};

function sendData(method, data, url, token) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method,
      body: JSON.stringify(data),
      mode: 'cors',
      headers:{
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + token
     }
   }).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

function postData(data, url, token) {
  return sendData('post', data, url, token);
}

function putData(data, url, token) {
  return sendData('put', data, url, token);
}

exports.postSigninForm = function(data) {
  return postData(data, API_PATH + settings.POST_SIGNIN_FORM);
};

exports.putStepForm = function(user, index, data, confirm) {
  console.log('put step form', confirm);
  const url = `${API_PATH}/${user.id}/${index}/${confirm ? 'confirm' : 'save'}`;
  return putData(data, url, user.token);
};

exports.postLogin = function(data) {
  return postData(data, API_PATH + settings.POST_LOGIN);
};

exports.getOpenedProcesses = function() {
  return getData(API_PATH + settings.GET_OPENED_PROCESSES);
}
