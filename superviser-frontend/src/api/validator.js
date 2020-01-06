'using strict'
const settings = require('../settings.json');
const API_PATH = settings.API_PATH;

const { request } = require('./utils.js');

function fetchValidators(token) {
  return request({
      url: API_PATH + '/validators',
      data: undefined,
      token: token
    }, 'get', 'no-cache');
}

export default { fetchValidators }
