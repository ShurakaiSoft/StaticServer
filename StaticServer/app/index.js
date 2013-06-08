/**
 * Index file.
 */


var port = 1337;

require('./server').start(port, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Server listening on ", port);	
	}
});
