//SET UP A .ENV FILE
require('dotenv').config();

//ALLOW PAGE TO ACCESS MODULE PACKAGE 'request'
var axios = require("axios");

var request = require("request");

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
//var omdb = (keys.omdb);
//SET UP bandsInTown API KEYS VIA 'keys.js' file

var userInput = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");

//FUNCTION TO TAKE userInput, userQusery as our 'process.argv' and utilize a switch function to switch between seperate functions
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
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

    results = [];


    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }).then(function(spotRes) {
        spotRes.tracks.items.forEach(function(ea) {
            results.push({artist: ea.artists[0].name, song: ea.name, preview: ea.external_urls.spotify, album: ea.album.name});
        })
        console.log(results);
    }).catch(function(error) {
        console.log(error);
        throw error;
    })
};

//FUNCTION using the omdb api and keys.js apiKey. JSON parse the body, and then check for errors, if not - console.log reponse.
function movieThis() {

    var movieName = userQuery;

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    console.log("Searching for " + movieName);

//FILL IN API KEY HERE
    request(queryUrl, function(error, response, body) {

        if (!movieName) {
            movieName = "mr nobody";
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
            return;
        }

        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            console.log
            (
            "Title: " + body.Title, "\n\n",
            "Release Year: " + body.Year, "\n\n",
            "IMDB Rating: " + body.imdbRating, "\n\n",
            "Rotten Tomatoes Rating: " + body.Ratings[2].Value, "\n\n",
            "Country: " + body.Country, "\n\n",
            "Language: " + body.Language, "\n\n",
            "Plot: " + body.Plot, "\n\n",
            "Actors: " + body.Actors, "\n"
            );

            
        } else {
            console.log("Error: " + error);
        }
    })
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

