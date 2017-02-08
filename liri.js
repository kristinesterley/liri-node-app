
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

var keysList = keys.twitterKeys;


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

function getSpotify(){

	if (!title) {
		title='The Sign';
	}

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


//Note: Rotten Tomatoes data not returned in the data from OMDB so could not include in the output
function getMovie(){

	if (!title) {
		title = 'Mr+Nobody';
	}

	fs.appendFile("log.txt", command + " " + title + "\n");	

	var options = {
		url: "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json",
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
	    	console.log("===========================================\n");
	    	fs.appendFile("log.txt", "=======================================\n");

	  	}
	  	else{
	  		console.log(response.statusCode);
	  	}
	});//end request
}//end getMovie


function handleRequest() {
	switch (command) {
		case 'my-tweets':
			getTweets();
			break;
		case 'spotify-this-song':
			getSpotify(); 
			break;
		case 'movie-this':
			getMovie();
			break;
		default:
			console.log("That is not a known command.");	
	}//end switch

}// end handleRequest

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

if (command === "do-what-it-says"){
	fs.appendFile("log.txt", command + "\n");	
	handleFileRequest();
}
else {
	handleRequest();
}


