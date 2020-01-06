'using strict';

const routes = require('./routes.json');
const API_PATH = require('../settings.json').API_PATH;

exports.saveLogin = (id, token) => {
  localStorage.setItem('id', id);
  localStorage.setItem('token', token);
};

exports.logout = () => {
  let wasConnected = this.getLogin().id !== undefined && this.getLogin().token !== undefined;
  localStorage.removeItem('id');
  localStorage.removeItem('token');
  return wasConnected;
}
//getItem() method allows you to access the data stored in the browser's localStorage object. It accepts only one parameter which is the key and returns the value as a string.
exports.getLogin = () => {
  return {
    id: localStorage.getItem('id'),
    token: localStorage.getItem('token')
  };
};

function getData(url, token) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      if (Math.floor(response.status / 100)  !== 2) {
        response.json()
        .then((error) => reject(error.error))
        .catch((error) => reject(error));
       } else {
         resolve(response.json());
       }
     }).catch((error) => {
        reject(error);
      });
  });
}

exports.getStepForm = function(user, index, token) {
  return getData(API_PATH + '/' + user.id + '/' + index, user.token);
};

exports.getSigninForm = function() {
  return getData(API_PATH + routes.GET_SIGNIN_FORM);
};

exports.getProcess = function(user) {
  return getData(API_PATH + routes.GET_PROCESS + user.id, user.token);
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
     if (Math.floor(response.status / 100)  !== 2) {
       response.json()
       .then((error) => reject(error.error))
       .catch((error) => reject(error));
      } else {
        resolve(response.json());
      }
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
  return postData(data, API_PATH + routes.POST_SIGNIN_FORM);
};

exports.putStepForm = function(user, index, data, confirm) {
  const url = `${API_PATH}/${user.id}/${index}/${confirm ? 'confirm' : 'save'}`;
  return putData(data, url, user.token);
};

exports.postLogin = function(data) {
  return postData(data, API_PATH + routes.POST_LOGIN);
};
//This  return function must be putdata function not postdata function
exports.postForgotPassword = function(data) {
  return postData( data, API_PATH + routes.POST_FORGOT_PASSWORD);
};

exports.getOpenedProcesses = function() {
  return getData(API_PATH + routes.GET_OPENED_PROCESSES);
}
