/**
 * A static HTML file server module
 */
var url = require('url');
var fs = require('fs');
var path = require('path');
var getContentType = require('./mime').getContentType;


function init(options) {
	var webroot = '.';
	var defaultFile = 'index.html';
	
	console.log('Creating a static file server.');
	options = options || {};
	webroot = options.webroot || webroot;
	defaultFile = options.defaultFile || defaultFile;
	
	/**
	 * Open the given pathname and streams the contents to the given request
	 * object.
	 * 
	 */
	function sendFile(pathname, res, callback) {
		var stream = fs.createReadStream(pathname);
		
		stream.on('error', function (err) {
			console.log("Readable stream error", err);
			callback(500);
		}).on('open', function () {
			console.log("sending ", pathname);
			res.writeHead(200, {'Content-Type': getContentType(pathname)});
		}).on('readable', function () {
			res.write(stream.read(), 'binary');
		}).on('end', function () {
			res.end();
		});
	}
	
	
	/**
	 * 
	 * 
	 * @param req	http Request object
	 * @param res	http Response object
	 * @param callback 
	 */
	function validateRequest(pathname, res, callback) {
		console.log("Received request for ", pathname);
		fs.stat(pathname, function (err, stats) {
			if (err) {
				console.log(err);
				callback(404);
			} else if (stats.isDirectory()) {
				validateRequest(pathname += defaultFile, res, callback);
			} else if (stats.isFile()) {
				sendFile(pathname, res, callback);
			} else {
				console.log("Request is not a file or directory.");
				callback(404);
			}
		});
	}
	
	
	
	return {
		handleRequest: function (req, res, callback) {
			var pathname = webroot + url.parse(req.url).pathname;
			
			validateRequest(pathname, res, callback);
		}
	};
}


module.exports = {
		init: init
};
