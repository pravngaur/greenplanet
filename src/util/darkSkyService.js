const request = require("request");

/**
 * dark sky API call
 */
// options object


  let options = {
    url: 'https://api.darksky.net/forecast/9c329290c4e92948258ce1e2c24133f6/37.8267,-122.4233?lang=en',
    json: true
  };

  const callDarkSkyAPI = function (lattLongObject,callbackHandler) {
    
    if(lattLongObject){
      let urlString = "https://api.darksky.net/forecast/9c329290c4e92948258ce1e2c24133f6/" + lattLongObject.latt + "," +
      lattLongObject.long + "?lang=en";
      options.url = urlString;
      const requestBody = request(options, callbackHandler);
    }
    
  }

module.exports = callDarkSkyAPI;