/**
 * Index file.
 */

var fs = require('fs');
var http = require('http');

var port = 1337;
var options = {
	webroot: '../public',
	defaultFile: 'test.html',
	cache: false,
	cacheFetchFunc: function loadFileIntoCache(pathname, callback) {
		fs.readFile(pathname, function (err, data) {
			if (err) {
				console.log("Error Reading file:", err);
				callback(500);
				return;
			}
			callback(null, data);
		});
	}
};
var staticServer = require('../lib/static-server').init(options);


http.createServer(function (req, res) {
	staticServer.handleRequest(req, res, function (err) {
		console.log("Request error: ", err);
		switch (err) {
		case 404:
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.end("404, File not Found.");
			break;
		case 405:
			res.writeHead(405, {'Content-Type': 'text/plain'});
			res.end("405, Meltod Not Allowed");
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
		console.log("Server listening on", port);	
	}
});
