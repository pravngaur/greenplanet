/**
 * @author: Praveen Gaur
 * @description:
 * This is the starting point for the Weather application.
 * 
 * 1) Initializes express module, configures it for:
 * a) Static public folder
 * b) Using handlebars
 * 
 * 2) Configure handlebars
 * 3) Defines the routes
 * 4) Starts the server
 * 
 */

// Loading native modules
const path = require("path");

//Loading NPM modules
const express = require("express");
const hbs = require("hbs");

// loading custom modules
const weatherService = require("./util/darkSkyService");
const cordinatesService = require("./util/mapBoxService");

// Initializing express
const app = express();

//port number to deploy the application on heroku or to run locally
const portNumner = process.env.PORT || 3000;

// building the directory paths
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsDirectoryPath = path.join(__dirname, "../templates/views");
const partialsDirectoryPath = path.join(__dirname, "../templates/partials");

//Setting the path of the static public directoory
app.use(express.static(viewsDirectoryPath));

// Setting the handlebar properties
app.set('view engine', 'hbs');
app.set("views", viewsDirectoryPath);

// Configuring handlebars to register the partials
hbs.registerPartials(partialsDirectoryPath);

//defining the home page routes
app.get("/", (req, res) => {
    res.render("index", {
        place: "Bangalore",
        forecast: "Clear weather all day.",
        rain: false
    });
})

/**
 * Route for getting the weather information
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * 
 */
app.get("/weather", (req, res) => {

    const address = req.query.address;
    if (address) {
        cordinatesService(address, (error, response) => {
            if (error) {
                res.send(`Error in map box service:  ${error.message}`);
                if (error.errorObj) {
                    console.log(JSON.stringify(errorObj));
                }
            } else if (response) {

                weatherService(response, (weatherError, weatherResponse, body) => {
                    if (weatherError) {
                        console.log('error in darkSky Service:', weatherError);
                    } else if (weatherResponse && weatherResponse.statusCode && weatherResponse.statusCode === 200 && body) {
                        res.render("weatherReport", {
                            cordinates: {
                                lattitude: response.latt,
                                longitude: response.long,
                                addressName: address
                            },
                            forecast: {
                                summary: (body.currently.summary).toUpperCase(),
                                currentTemperature: body.currently.temperature,
                                rain: body.currently.precipProbability
                            }

                        });
                    }
                }); 
            }
        })
    } else {
        res.send("Please supply address query string..");
    }

});

/**
 * Route for for handling the 404 responses
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * 
 */
app.get("*", (req, res) => {
    res.render("404")
});

/**
 * Starting the server
 * @function
 * @param {number} port - port on which the server will listen for requests
 * @param {callback} middleware - Express middleware
 * 
 */
app.listen(portNumner, () => {
    console.log("######################################");
    console.log(`Server started on port : ${portNumner}`);
    console.log("######################################");
});