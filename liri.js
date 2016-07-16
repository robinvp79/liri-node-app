var twitterKey = require('./keys.js');
var twitterKeys = twitterKey.twitterKeys;
var Twitter = require('twitter');
var client = new Twitter({
	consumer_key: twitterKeys.consumer_key,
	consumer_secret: twitterKeys.consumer_secret,
	access_token_key: twitterKeys.access_token_key,
	access_token_secret: twitterKeys.access_token_secret
});
var request = require('request');
var spotify = require('spotify');
var fs = require('fs');
var comand = process.argv[2];
var argument = process.argv.slice(3).join(' ');

function showTweets() {
	var params = {count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
  		if (!error) {
  			var dataLog="";
  			dataLog="Your last "+tweets.length+" tweets are (newest to oldest) : "+"\n";
  			for (var i = 0; i < tweets.length; i++) {
  				var j=i+1;
  				var tweetDate=tweets[i].created_at;
  				var dateEST=new Date(tweetDate);
  				dataLog+=j+").- "+dateEST+"\n";
    			dataLog+="     "+tweets[i].text+"\n";
    		}
    		console.log(dataLog);
    		addComand(dataLog);
  		}
	});
}

function showSongInfo(argument){
	if (argument==='' || argument===null){
		argument="The Sign Ace of Base";
	}
	spotify.search({ type: 'track', query: "'"+argument+"'" }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	    var songResult=data.tracks.items[0];
	    var artistsResult=songResult.artists;
	    var albumResult=songResult.album;
	    var dataLog="";
	    dataLog="The Artist(s): "+artistsResult[0].name+"\n"+
	    		"The songs name: "+songResult.name+"\n"+
	    		"A preview link of the song from spotify: "+songResult.preview_url+"\n"+
	    		"The album that the song is from: "+albumResult.name+"\n";
	    console.log(dataLog);
	    addComand(dataLog);
	});
}

function showMovieInfo(argument) {
	if (argument==='' || argument===null){
		argument="Mr. Nobody";
		console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
		console.log("It's on Netflix");
	}
	var queryUrl = 'http://www.omdbapi.com/?t=' + argument +'&tomatoes=true&r=json';
	request(queryUrl,function (error,response,body){
		if(!error && response.statusCode ===200){
			var movieObject = JSON.parse(body);
			var dataLog="";
			dataLog="Title of the movie: "+movieObject["Title"]+"\n"+
					"Year the movie came out: "+movieObject["Year"]+"\n"+
					"IMDB Rating of the movie: "+movieObject["Rated"]+"\n"+
					"Country where the movie was produced: "+movieObject["Country"]+"\n"+
					"Language of the movie: "+movieObject["Language"]+"\n"+
					"Plot of the movie: "+movieObject["Plot"]+"\n"+
					"Actors in the movie: "+movieObject["Actors"]+"\n"+
					"Rotten Tomatoes Rating: "+movieObject["tomatoRating"]+"\n"+
					"Rotten Tomatoes URL: "+movieObject["tomatoURL"]+"\n";
			console.log(dataLog);
			addComand(dataLog);
		}
	});
}

function runWhatItSays() {
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){
			return console.error(err);
		}
		var randomArray = data.split(',');
		comand = randomArray[0];
		argument = randomArray[1];
		runComand();
	});
}

function addComand(dataLog) {
	if(argument){
		fs.appendFile('log.txt',comand+","+argument+";\n"+dataLog+"\n",function(err){
			if (err) {
				console.log(err);
			}
		});
	} else {
		fs.appendFile('log.txt',comand+";\n"+dataLog+"\n",function(err){
			if (err) {
				console.log(err);
			}
		});
	}	
}

function runComand(){
	if (comand==="my-tweets"){
		showTweets();
	} else if (comand==="spotify-this-song"){
		showSongInfo(argument);
	} else if (comand==="movie-this"){
		showMovieInfo(argument);
	} else if (comand==="do-what-it-says"){
		var dataLog="";
		addComand(dataLog);
		runWhatItSays();
	}
}

runComand();