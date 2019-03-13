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
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((results) => {
        resolve(results.json());
      }).catch((err) => {
        reject(err);
      });
  });
}

exports.getSigninForm = function() {
  return getData(API_PATH + settings.GET_SIGNIN_FORM);
};

exports.getProcess = function(id) {
  return getData(API_PATH + settings.GET_PROCESS + id);
}

function postData(data, url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
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

exports.postSigninForm = function(data) {
  return postData(data, API_PATH + settings.POST_SIGNIN_FORM);
};

exports.postLogin = function(data) {
  return postData(data, API_PATH + settings.POST_LOGIN);
}
