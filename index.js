// Import express and request modules
var express = require('express');
var request = require('request');

// Store our app's ID and Secret. 
var clientId = process.env.SLACK_CLIENT_ID;
var clientSecret = process.env.SLACK_CLIENT_SECRET;

// Store the bot's token and secret.
var botToken = process.env.SLACK_BOT_TOKEN;
var appSecret = process.env.SLACK_SIGNING_SECRET;

// Instantiates Express and assigns our app variable to it
var app = express();


// stuff from slack support
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support parsing of application/json type post data
// end stuff from slack support


// Again, we define a port we want to listen to
const PORT=3000;

// Lets start our server

app.listen(PORT, function () {
	//Callback triggered when server is successfully listening. Hurray!
	console.log("Example app listening on port " + PORT);
});/**/


// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
	res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
	// When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
	if (!req.query.code) {
		res.status(500);
		res.send({"Error": "Looks like we're not getting code."});
		console.log("Looks like we're not getting code.");
	} else {
		// If it's there...

		// We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
		request({
			url: 'https://slack.com/api/oauth.access', //URL to hit
			qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
			method: 'GET', //Specify the method

		}, function (error, response, body) {
			if (error) {
				console.log(error);
			} else {
				res.json(body);

			}
		})
	}
});

// Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
app.post('/command', function(req, res) {
	res.send('Your ngrok tunnel is up and running!');
});

// handle slack challenge parameter
app.post('/slack/events', function(req, res) {
	//console.log(req.body);
	res.send(req.body.challenge);
});



// ======== bot message handling ========

// Import slack bolt for bot listening
const { App } = require('@slack/bolt');

// Instantiates SBapp
const sbapp = new App({
	token: botToken,
	signingSecret: appSecret
});

// more bot message stuff
(async () => {
  // Start your app
  await sbapp.start(process.env.PORT || 3001);

  console.log('⚡️ Bolt app is running!');
})();/**/

// Listens to incoming messages that contain "hello"
sbapp.message('hello', ({ message, say }) => {
	// say() sends a message to the channel where the event was triggered
	say(`Hey there <@${message.user}>!`);
});/**/
