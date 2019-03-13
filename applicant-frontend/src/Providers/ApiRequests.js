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

function getData(url) {
  console.log(url);
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((results) => {
        resolve(results.json());
      }).catch((err) => {
        reject(err);
      });
  });
}

exports.getStepForm = function(user, index) {
  return getData(API_PATH + '/' + user.id + '/' + index);
};

exports.getSigninForm = function() {
  return getData(API_PATH + settings.GET_SIGNIN_FORM);
};

exports.getProcess = function(id) {
  return getData(API_PATH + settings.GET_PROCESS + id);
};

function sendData(method, data, url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method,
      body: JSON.stringify(data),
      mode: 'cors',
      headers:{
       'Content-Type': 'application/json'
     }
   }).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    });
  });
}

function postData(data, url) {
  return sendData('post', data, url);
}

function putData(data, url) {
  return sendData('put', data, url);
}

exports.postSigninForm = function(data) {
  return postData(data, API_PATH + settings.POST_SIGNIN_FORM);
};

exports.putStepForm = function(user, index, data) {
  return putData(data, API_PATH + '/' + user.id + '/' + index);
};

exports.postLogin = function(data) {
  return postData(data, API_PATH + settings.POST_LOGIN);
};
