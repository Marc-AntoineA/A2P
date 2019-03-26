
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

export function fetchProcesses(ids){
  console.log("hello bis");
  return fetchData(API_PATH + settings.GET_ALL_PROCESSES);
}
