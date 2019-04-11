export function request({url, data, token}, method, cache) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method,
      body: data ? JSON.stringify(data) : undefined,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      cache: cache ? cache : 'default'
    }).then((results) => {
      if (results.status !== 200 && results.status !== 201 && results.status.status !== 304) {
        results.json()
          .then((response) => reject({code: results.status, error: response.error}))
          .catch((error) => reject({error}));
          return;
      }
      resolve(results.json());
    }).catch((err) => {
      reject({code: 0, error: err});
    });
  });
}
