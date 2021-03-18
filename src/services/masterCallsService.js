
const axios = require('axios');
const { calls } = require('../core/config/configuredCalls.json');
const dbContext = require('../store/dbContext');

function mapResponse(call, arrData) {
  if (!call.mapDictionary) {
    return arrData;
  }
  return arrData.map((item, index) => {
    const obj = {};

    for (const prop in call.mapDictionary) {
      obj[call.mapDictionary[prop]] = item[prop];
    }
    obj.creationDate = Date.now();
    return obj;
  });
}

function manageCallPromise(call, promise) {
  promise.then(function (response) {
    console.log(`${call.method} ${call.uri}`, 'done!');
    const arrData = !response.data ? [] : Array.isArray(response.data) ? response.data : [response.data];
    const mappedData = mapResponse(call, arrData);

    dbContext.Item.insertMany(mappedData).then(function () {
      console.log('Data inserted'); // Success
    });
  }).catch((err) => {
    console.log(`${call.method} ${call.uri}`, 'error!', err);
  });
}

module.exports = {
  async do() {
    for (const call of calls) {
      let promise = null;

      switch (call.method.toUpperCase()) {
        case 'POST': {
          promise = axios.post(call.uri, call.body);
          break;
        }
        default: {
          // GET
          promise = axios.get(call.uri);
        }
      }
      manageCallPromise(call, promise);
    }
  },
};
