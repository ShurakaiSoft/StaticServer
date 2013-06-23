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
 * Serve up a cached file. As opposed to streaming files.
 * 
 */
function sendCachedFile(pathname, res, callback) {
	fileCache.fetch(pathname, function (err, value) {
		if (err) {
			console.log("cache.fetch returned error:", err);
			callback(500);
			return;
		}
		console.log("sending ", pathname);
		res.writeHead(200, {'Content-Type': getContentType(pathname)});
		res.end(value, 'binary');
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
	configOptions.defaultFile = options.defaultFile || 'index.html';
	configOptions.webroot = options.webroot || '.';
	configOptions.streaming = options.streaming || false;
	configOptions.cacheFetchFunc = options.cacheFetchFunc || null;
	if (!configOptions.streaming) {
		fileCache = cache.init({
			addFunc: configOptions.cacheFetchFunc
		});
	}
	if (options.defaultFile) {
		defaultFile = options.defaultFile;
	}
	return {
		handleRequest: function (req, res, callback) {
			var pathname = '';

			if (req.method !== 'GET') {
				callback(405);
				return;
			}
			pathname = configOptions.webroot + url.parse(req.url).pathname;
			validateRequest(pathname, res, callback);
		}
	};
}


exports.init = init;
