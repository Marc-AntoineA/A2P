'using strict';

const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

exports.getSigninForm = function() {
  return new Promise((resolve, reject) => {
    const url = API_PATH + settings.GET_SIGNIN_FORM;
    fetch(url)
      .then((results) => {
        resolve(results.json());
      }).catch((err) => {
        reject(err);
      });
  });
};

exports.postSigninForm = function(data) {
  return new Promise((resolve, reject) => {
    const url = API_PATH + settings.POST_SIGNIN_FORM;
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
};
