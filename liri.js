//Note: I have added a command 'movie-this-omdb' which can be used to search omdb for a movie title
//The command 'movie-this' makes calls to TMDb.

//All display code outputs to the both console and to the log.txt file


var command = process.argv[2];
var title = process.argv[3];

var TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET;
var TWITTER_ACCESS_TOKEN_KEY;
var TWITTER_ACCESS_TOKEN_SECRET;



var keys = require("./keys.js");
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require("fs");

// read the api keys from the keys.js file and save them off into variables

var keysList = keys.twitterKeys;
var TMDB_API_KEY = keys.tmdbKey.api_key;


//format query strings - while not necessary for successful queries, documentation specifies this reformat

function reformatTitle(searchTerm) {
  	var term = searchTerm.replace(/ /gi,"+");
  	return term;
}


// make a call to Twitter to retrieve and then display my 20 most recent tweets

function getTweets() {

	fs.appendFile("log.txt", command + "\n");	

	for (var key in keysList){

		switch (key) {
			case 'consumer_key':
				TWITTER_CONSUMER_KEY = keysList[key];
				break;
			case 'consumer_secret':
				TWITTER_CONSUMER_SECRET = keysList[key];
				break;
			case 'access_token_key':
				TWITTER_ACCESS_TOKEN_KEY = keysList[key];
				break;
			case 'access_token_secret':
				TWITTER_ACCESS_TOKEN_SECRET = keysList[key];
				break;
		}// end switch
	}// end for

	
	var client = new Twitter({
	  	consumer_key: TWITTER_CONSUMER_KEY,
	  	consumer_secret: TWITTER_CONSUMER_SECRET,
	  	access_token_key: TWITTER_ACCESS_TOKEN_KEY,
	  	access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
		});

	client.get('statuses/user_timeline', function(error, tweets, response) {
	  	if(error) throw error;
	 	var tweetArr = tweets;
	 	for (i=0;i<tweetArr.length;i++){
	 		console.log(tweetArr[i].created_at);
	 		fs.appendFile("log.txt", tweetArr[i].created_at + "\n");	
	 		console.log(tweetArr[i].text);
	 		fs.appendFile("log.txt", tweetArr[i].text + "\n");
	 		console.log("--------------")
	 		fs.appendFile("log.txt", "--------------\n");
	 	} // end for
	});//end client.get
}//end getTweets


//Make a call to Spotify to search for songs with user specified title. If the user does not specify a title,
// the search defaults to specify The Sign by Ace of Base
function getSpotify(){

	if (!title) {
		title='The Sign Ace of Base';
	}
	title = reformatTitle(title);

	fs.appendFile("log.txt", command + " " + title + "\n");	

	spotify.search({ type: 'track', query: title }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	    var songs = data.tracks.items;

	    for (i=0;i<songs.length;i++){
	    	console.log("Song Name: " + songs[i].name);
	    	fs.appendFile("log.txt", "Song Name: " + songs[i].name + "\n");

	    	for (j=0;j<songs[i].artists.length;j++){
	    		console.log("Artist: " + songs[i].artists[j].name);	
	    		fs.appendFile("log.txt", "Artist: " + songs[i].artists[j].name + "\n");
	    	} // end for j	

	    	console.log("Album Name: " + songs[i].album.name);
	    	fs.appendFile("log.txt", "Album Name: " + songs[i].album.name + "\n");	
	    	console.log("Preview URL: " + songs[i].preview_url);
	    	fs.appendFile("log.txt", "Preview URL: " + songs[i].preview_url+ "\n");	
	    	console.log("------------------");
	    	fs.appendFile("log.txt", "--------------\n");
	    } //end for i	
	});//end spotify.search
}//end getSpotify


// Search omdb and display results. Service recently unreliable - a return code of 503 means the sercvice is
// unavailable

function getOmdb(){

	if (!title) {
		title = 'Mr+Nobody';
	}
	title = reformatTitle(title);

	fs.appendFile("log.txt", command + " " + title + "\n");	

	var options = {
		url: "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&tomatoes=true&r=json",
		headers: {
			'User-Agent': 'request'
		}
	};	
			
	request(options, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	  		var movie = JSON.parse(body);

	  		console.log("===========================================\n");
	    	fs.appendFile("log.txt", "--------------------------------------\n");
	    	console.log("Title: " + movie.Title);
	    	fs.appendFile("log.txt", "Title: " + movie.Title+ "\n");
	    	console.log("Year: " + movie.Year);
	    	fs.appendFile("log.txt", "Year: " + movie.Year+ "\n");
	    	console.log("imdbRating: " + movie.imdbRating);
	    	fs.appendFile("log.txt", "imdbRating: " + movie.imdbRating+ "\n");
	    	console.log("Country: " + movie.Country);
	    	fs.appendFile("log.txt", "Country: " + movie.Country+ "\n");
	    	console.log("Language: " + movie.Language);
	    	fs.appendFile("log.txt", "Language: " + movie.Language+ "\n");
	    	console.log("Plot: " + movie.Plot);
	    	fs.appendFile("log.txt", "Plot: " + movie.Plot+ "\n");
	    	console.log("Actors: " + movie.Actors);
	    	fs.appendFile("log.txt", "Actors: " + movie.Actors+ "\n");
	    	console.log("Tomato Rating: " + movie.tomatoRating);
	    	fs.appendFile("log.txt", "Tomato Rating: " + movie.tomatoRating+ "\n");
	    	console.log("Tomato URL: " + movie.tomatoURL);
	    	fs.appendFile("log.txt", "Tomato URL: " + movie.tomatoURL+ "\n");
	    	console.log("===========================================\n");
	    	fs.appendFile("log.txt", "=======================================\n");

	  	}
	  	else{
	  		console.log("Error Code: " + response.statusCode);
	  	}
	});//end request
}//end getMovie


//search tmdb for user specified movie title. If no title specified, search for the movie title "Mr Nobody"

function getTMDb(){
	if (!title) {
		title = 'Mr+Nobody';
	}
	title = reformatTitle(title);

	fs.appendFile("log.txt", command + " " + title + "\n");	

	var queryUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_API_KEY+ "&query="+title;
		
	request(queryUrl, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	  		var movies = JSON.parse(body);
	  		// console.log(movies);
	  		var movieArr = movies.results;
	  		for (i=0;i<movieArr.length;i++){
	  			var movieId = movieArr[i].id;
	  			var query2URL = "https://api.themoviedb.org/3/movie/"+ movieId + "?api_key=" + TMDB_API_KEY;
	  				request(query2URL, function (err, resp, result) {
						var film = JSON.parse(result);
						if (!err && response.statusCode == 200) {

		  					console.log("===========================================\n");
					    	fs.appendFile("log.txt", "--------------------------------------\n");
					    	console.log("Title: " + film.title);
					    	fs.appendFile("log.txt", "Title: " + film.title + "\n");
					    	console.log("Release Date: " + film.release_date);
					    	fs.appendFile("log.txt", "Release Date: " + film.release_date + "\n");
					    	for (j=0;j<film.production_countries.length;j++){
					    		console.log("Country: " + film.production_countries[j].name);
					    		fs.appendFile("log.txt", "Country: " + film.production_countries[j].name + "\n");
					    	}	
					    	console.log("Language: " + film.original_language);
					    	fs.appendFile("log.txt", "Language: " + film.original_language + "\n");
					    	console.log("Plot: " + film.overview);
					    	fs.appendFile("log.txt", "Plot: " + film.overview + "\n");
					    	console.log("===========================================\n");
					    	fs.appendFile("log.txt", "=======================================\n");
						}//end if
	  					else{
	  						console.log(resp.statusCode);
	  					}
	  				});//end request query2	
	  		}//end for

	  	}
	  	else{
	  		console.log(response.statusCode);
	  	}
	});//end request
}

//code calls functions based on the command that the user has specified


function handleRequest() {
	switch (command) {
		case 'my-tweets':
			getTweets();
			break;
		case 'spotify-this-song':
			getSpotify(); 
			break;
		case 'movie-this-omdb':
			getOmdb();
			break;
		case 'movie-this':
			getTMDb();
			break;
		default:
			console.log("That is not a known command.");	
	}//end switch

}// end handleRequest

// handleFileRequest is executed if the user specifies 'do-what-it-says'. In this case, the code reads a file,
// random.txt and parses out the command and a speicified title (if given)
// After a successful file read, the code executes handleRequest

function handleFileRequest() {
	fs.readFile("random.txt", "utf8",function(err, data){
		if (err){
			return console.log(err);
		}
		var comma = data.indexOf(",");
		if (comma === -1){
			command = data;
		}
		else{
			command = data.slice(0, comma);
			title = data.slice(comma+1, data.length);
		}
		handleRequest();	
	});// end readFile
}

//begin execution here
// if the user has specified 'do-what-it-says', call the function to handle the request by first reading
// the file containing the command and title
// if the user has specified any other command, process the request.

if (command === "do-what-it-says"){
	fs.appendFile("log.txt", command + "\n");	
	handleFileRequest();
}
else {
	handleRequest();
}


