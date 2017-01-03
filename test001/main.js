var http = require("http");

http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});

	response.end('Hello\n');

	console.log("Client has sent a request");
}).listen(8081);

console.log("Server running at http://localhost:8081/");