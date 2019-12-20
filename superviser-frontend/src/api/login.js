'using strict';
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

const { request } = require('./utils.js');

function login(userCredentials){
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

export default { login };
