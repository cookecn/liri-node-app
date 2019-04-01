//SET UP A .ENV FILE
require('dotenv').config();

//ALLOW PAGE TO ACCESS MODULE PACKAGE 'request'
var axios = require("axios");

//ALLOW PAGE TO ACCESS MODULE PACKAGE 'moment'
var moment = require("moment");

//ALLOW PAGE TO ACCESS MODULE PACKAGE 'fs'
var fs = require("fs");

//ALLOW THIS PAGE TO USE 'keys.js' file
var keys = require("./keys.js");

var Spotify = require("node-spotify-api"); 

//SET UP spotify API KEY VIA 'keys.js' file
var spotify = new Spotify(keys.spotify);
//SET UP OMDB API KEYS VIA 'keys.js' file
var omdb = (keys.omdb);
//SET UP bandsInTown API KEYS VIA 'keys.js' file

var userInput = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");

//FUNCTION TO TAKE userInput, userQusery as our 'process.argv' and utilize a switch function to switch between seperate functions
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default: 
            console.log("I-don't-understand");
            break;
    }   
}
userCommand(userInput, userQuery);

//FUNCTION to utilize bandsInTown api, using a queryUrl and apiKey from the keys.js page to search api and get response. 
function concertThis() {
    var artist = userQuery;
    console.log("Searching for... " + artist + "'s next show...");

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {

        //console.log(response.data);
        var jsonBand = response.data;
        var concertDate = moment(jsonBand[0].datetime).format("MM/DD/YYYY hh:00 A");
                 
        console.log("Venue Name: " + jsonBand[0].venue.name, "\n",
        "Venue Location: " + jsonBand[0].venue.city, jsonBand[0].venue.country, "\n",
        "Date of the Event: " + concertDate);
    


    }).catch(function(error) {
        if(error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
}




//FUNCTION to utilize spotify api via node using userQuery
function spotifyThisSong() {
    console.log("Searching for... " + userQuery);

    if (!userQuery) {
        userQuery = "the sign ace of base"
    };

    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }), function (error, data) {
        if (error) {
            return console.log("Error Occured " + error);
        }

        let spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
            console.log("Artist " + data.tracks.items[i].album.artists[0].name, 
            "Song: " + data.tracks.items[i].name,
            "Spotify Link " + data.tracks.items[i].external_urls.spotify, 
            "Album: " + data.tracks.items[i].album.name);
        };
    };
}

//FUNCTION using the omdb api and keys.js apiKey. JSON parse the body, and then check for errors, if not - console.log reponse.
function movieThis() {
    console.log("Searching for " + userQuery);

    if(!userQuery) {
        userQuery = "mr nobody";
    };
//FILL IN API KEY HERE
    axios.get("http://www.omdb.api.com/?t=" + userQuery + "&apikey=" + omdb +"", function(error, response, body) {
        var userMovie = JSON.parse(body);

        var ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) {

        }

        if (!error && response.statusCode === 200) {
            console.log("Title: " + userMovie.Title,  
            "Released: " + userMovie.Year, 
            "IMDB Rating: " + userMovie.imdbRating, 
            "Rotten Tomatoes Rating: " + userMovie.Ratings[1].Value, 
            "Country: " + userMovie.Country, 
            "Language: " + userMovie.Language, 
            "Plot: " + userMovie.Plot,
            "Cast: " + userMovie.Actors);
        } else {
            return console.log("Movie not able to be found");
        };
    });
}

//FUNCTION to take everything from the random.txt page and display it's information in the console. EX: 
function doThis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        } 
        var dataArr = data.split(",");
        userInput = dataArr[0];
        userQuery = dataArr[1];
        userCommand(userInput, userQuery);
    });
}

