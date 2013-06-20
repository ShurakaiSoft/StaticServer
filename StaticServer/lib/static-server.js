/**
 * A static HTML file server module
 */
var url = require('url');
var fs = require('fs');
var path = require('path');
var getContentType = require('./mime').getContentType;
var cache = require('./cache');

var defaultFile = 'index.html';
var configOptions = {};
var cacheHack = null;
var fileCache = null;



/**
 * A Bridge Pattern for the cache to be able to load the file data it is 
 * caching for us.
 * 
 */
function loadFile(key, callback) {
	fs.readFile(key, function (err, data) {
		if (err) {
			console.log("Error Reading file:", err);
			callback(500);
			return;
		}
		callback(null, data);
	});
}

/**
 * Given a file it will send it.
 * 
 */
function sendFile(pathname, res, data, callback) {
	console.log("sending ", pathname);
	res.writeHead(200, {'Content-Type': getContentType(pathname)});
	res.end(data, 'binary');
}

/**
 * Use the cache to send files and not stream them.
 * 
 */
function sendCachedFile(pathname, res, callback) {
	fileCache.fetch(pathname, function (err, value) {
		sendFile(pathname, res, value, callback);
	});
}


/**
 * Open the given pathname and streams the contents to the given request
 * object. callback is only used for error handling.
 * 
 */
function streamFile(pathname, res, callback) {
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
 * Validate the pathname. If it's a directory, append default filename and call
 * sendFile.
 * 
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
			if (configOptions.streaming) {
				streamFile(pathname, res, callback);
			} else {
				sendCachedFile(pathname, res, callback);
			}
		} else {
			console.log("Request is not a file or directory.");
			callback(404);
		}
	});
}

/**
 * Initialise a StaticFile server with the given options.
 * 
 */
function init(options) {
	console.log('Creating a static file server.');
	options = options || {};
	configOptions.webroot = options.webroot || '.';
	configOptions.streaming = options.streaming || false;
	fileCache = cache.init({
		addFunc: loadFile
	});
	
	if (options.defaultFile) {
		defaultFile = options.defaultFile;
	}
	return {
		handleRequest: function (req, res, callback) {
			var pathname = '';

			if (req.method !== 'GET') {
				res.writeHead(405, {'Content-Type': 'text/plain'});
				res.end("405, Meltod Not Allowed");
				return;
			}
			pathname = configOptions.webroot + url.parse(req.url).pathname;
			validateRequest(pathname, res, callback);
		}
	};
}


exports.init = init;
