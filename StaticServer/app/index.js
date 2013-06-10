/**
 * Index file.
 */

var port = 1337;

var staticServer = require('../lib/static-server').init({
	webroot: '../public',
	defaultFile: 'test.html'
});
	
require('http').createServer(function (req, res) {
		
	staticServer.handleRequest(req, res, function (err) {
		console.log("Request error: ", err);
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
}).listen(port, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Server listening on ", port);	
	}
});
