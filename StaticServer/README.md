# StaticServer

## Objective
Create a node.js web server capable of serving static websites. This is largely
a learning exercise in understanding node.js and how to serve http requests, as
there are a number of excellent open source static http servers already out 
there.

## Overview
`./app` has an example of how to use this module.

`./lib/static-server.js` the main module which depends on `./lib/mime.js`.

`tests` contains `mocha` unit tests.

`public` contains a simple static test website. 
	
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
