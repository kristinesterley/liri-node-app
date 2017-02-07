
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



function handleRequest() {

	switch (command) {

		case 'my-tweets':
			fs.appendFile("log.txt", command + "\n");	
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
	 			} 
			});
			break;

		case 'spotify-this-song':

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
	    		}	
	    	});
			break;

		case 'movie-this':
			if (!title) {
				title = 'Mr+Nobody';
			}
			fs.appendFile("log.txt", command + " " + title + "\n");		
			var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json";
			console.log(queryURL);
			request(queryURL, function (error, response, body) {
	  			if (!error && response.statusCode == 200) {
	    			console.log(body) 
	  			}
	  			else{
	  				// console.log(body);
	  				console.log(response.statusCode);
	  			}
			});
			break;
		}//end switch

	}// end handleRequest

	function handleFileRequest() {
		fs.readFile("random.txt", "utf8",function(err, data){
			if (err){
				return console.log(err);
			}
			var comma = data.indexOf(",");
			command = data.slice(0, comma);
			title = data.slice(comma+1, data.length);
			handleRequest();
				
		});

	}

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


if (command === "do-what-it-says"){
	fs.appendFile("log.txt", command + "\n");	
	handleFileRequest();
}
else {
	handleRequest();
}


