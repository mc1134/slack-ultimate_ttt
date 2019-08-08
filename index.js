var http = require('http');

const PORT = 3000;

function handleRequest(request, response) {
	response.end('Ngrok is working! - Path Hit: ' + request.url);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
	console.log("Server listening on: http://localhost:%s", PORT);
});
