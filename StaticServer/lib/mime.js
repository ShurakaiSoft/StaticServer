/**
 * mime type dictionary.
 */
var path = require('path');

mimeDictionary = {
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.html': 'text/html',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg'
};

function getContentType(filename) {
	return mimeDictionary[path.extname(filename)] || 'text/plain';
}

// Public API
exports.getContentType = getContentType;
