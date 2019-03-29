const request = require("request");
const darkSkyAPI = require("./darkSkyService");

let optionParams = {
    url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
    queryParam: '?access_token=pk.eyJ1IjoicHJhdm5nYXVyIiwiYSI6ImNqdG16eWVjdDBoMTE0NHFnMzBzb2lmdnUifQ.kBQbSHG_2Ny1YQSvIUzfkg',
    limit: "&limit=1"
};

const callMapBoxAPIHelper = function (address, callback) {
    if (address) {
        let lattLongObject;

        let options = {
            url: optionParams.url + address + ".json" + optionParams.queryParam + optionParams.limit,
            json: true
        }
        //calling the geocoding service
        lattLongObject = request(options, (error, response, body) => {
            if (error) {
                errorObject = {
                    message: "network layer issue.",
                    errorObj: error,
                    responseObj: undefined
                }
                callback(errorObject)
            } else if (response && response.statusCode && response.statusCode !== 200) {
                errorObject = {
                    message: "This is some programming level error, probably incorrect request.",
                    errorObj: undefined,
                    responseObj: response
                }
                callback(errorObject)
            } else if (response && response.statusCode && response.statusCode === 200 && body &&
                body.features && body.features.length >= 1) { //successful request
                const returnObject = {
                    latt: body.features[0].center[1],
                    long: body.features[0].center[0]
                };

                callback(undefined, returnObject); //calling the callback in order to call the darksky API.
            } else {
                errorObject = {
                    message: "Please check the passed address, correct it and try again.",
                    errorObj: undefined,
                    responseObj: response
                }
                callback(errorObject);
            }
        });
    }
};


module.exports = callMapBoxAPIHelper;