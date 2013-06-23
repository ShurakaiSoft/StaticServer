# StaticServer

## Objective
Create a node.js web server capable of serving static websites. This is largely
a learning exercise in understanding node.js and how to serve http requests, as
there are a number of excellent open source static http servers already out 
there.

## Overview
`lib/static-server.js` is what this is all about. `lib/mime.js` is a 
dependency that could be replaced with one that's more full featured.

`example` has an example of how to use this module.

`tests` contains `mocha` unit tests in the BDD style. They're not complete. I
haven't gone to the trouble of mocking `requests` and `responses`.

`public` contains a simple static test website. 

## Usage

First require the module.

    var ss = require('static-server');

Which contains a single function `init` which is used to create a static file 
server.

    var staticServer = ss.init(options);
 
`init` takes a single configuration object argument, which can contain a map of
the following options.

    webroot: '../public'
    
Set the servers root directory. Default: `.` which is probably not what you
want, so change it.

    defaultFile: 'home.htm'
    
Set the default file which is appended to directory requests. Default: `index.html`

    cache: true
    
A switch to cache files (in user space) or stream files directly from the file 
system. Note: the OS probably does a better job of caching files than this 
implementation, so streaming is recommended.

    cacheFetchFunc: function loadFileIntoCache(pathname, callback) {
    	// load file... 
    	callback(err, fileData);
    }
    
A function that defines how to get fileData for the cache. It takes two arguments 
`(pathname, callback)`, where `pathname` is the filename relative to webroot.
The callback is passed two arguments `(err, fileData)`, where `fileData` is the contents
of the file that will be cached.


Then call `handleRequest(req, res, callback)`.
The callback is passed a single argument `(err)`, where `err` is an HTTP status
code for the error.


## Developing

The cache is initialised even when it's not being used.

	
## Limitations

This is a learning exercise and therefore has a number of limitations.

* It only handles a subset of website content: `.js`, `.css`, `.html` and 
  `.jpg`. All other files return as `"ContentType": "text/plain"`. 
* There is no webroot security so someone might request `../../../etc/passwd`

There are a number of static file server frameworks around that are much more
flexible. Consider using the following:

* [node-static](https://github.com/cloudhead/node-static)
* [node-paperboy](https://github.com/felixge/node-paperboy)
* [http-server](https://github.com/nodeapps/http-server)

