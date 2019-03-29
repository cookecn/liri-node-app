require("dotenv").config();

var keys = require("./keys.js");

var spotify = new spotify(keys.spotify);

/*
concert-this;
spotify-this-song;
movie-this;
do-what-it-says;
*/

/* FOr Bands in Town 

("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")

*/