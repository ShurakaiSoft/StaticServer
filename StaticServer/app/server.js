/**
 * Create a http server.
 */

var http = require('http');

function start(port, callback) {
	var staticServer = require('./lib/static-server').init({
		webroot: '../public',
		defaultFile: 'test.html'
	});
	
	http.createServer(function (req, res) {
		// call to static server goes here...
		
		
		staticServer.handleRequest(req, res, function (err) {
			console.log("Error handling request: ", err);
			// do stuff with errors.
			switch (err) {
			case 404:
				res.writeHead(404, {"Content-Type": "text/plain"});
				res.end("404, File not Found.");
				break;
			default:
				res.writeHead(500, {"Content-Type": "text/plain"});
				res.end("500, Internal Server Error.");
				break;
			}
		});
		
	}).listen(port);
	callback(null);
}

module.exports = {
	start: start	
};