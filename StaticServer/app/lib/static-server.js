/**
 * A static HTML file server module
 */
var url = require('url');
var fs = require('fs');
var path = require('path');


function init(options) {
	var webroot = '.';
	var defaultFile = 'index.html';
	
	console.log('Creating a static file server.');
	options = options || {};
	webroot = options.webroot || webroot;
	defaultFile = options.defaultFile || defaultFile;
	

	function getContentType(filename) {
		switch (path.extname(filename)) {
		case '.js':
			return 'application/javascript';
		case '.html':
			return 'text/html';
		case '.css':
			return 'text/css';
		case '.jpg':
		case '.jpeg':
			return 'image/jpeg';
		default:
			return 'text/plain';
		}
	}
	
	return {
		handleRequest: function (req, res, callback) {
			var pathname = webroot + url.parse(req.url).pathname;
			console.log("Received request for ", pathname);
			fs.stat(pathname, function (err, stats) {
				if (err) {
					console.log(err);
					callback(500);
				} else {
					if (stats.isDirectory()) {
						pathname += defaultFile;
					}
					if (stats.isFile() || stats.isDirectory()) {
						fs.readFile(pathname, function (err, data) {
							var contentType = getContentType(pathname);
							res.writeHead(200, {"Content-Type": contentType});
							if (contentType === 'image/jpeg') {
								console.log("sending binary file ", pathname);
								res.end(data, 'binary');
							} else {
								console.log("sending text file ", pathname);
								res.end(data);
							}
						});
					} else {
						console.log("Error: ", pathname, " doesn't exist!");
						callback(404);
					}
				}
			});
		}
	};
}


module.exports = {
		init: init
};
