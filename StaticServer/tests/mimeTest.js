/**
 * Test cases for mime.js
 * 
 */
require('should');

var getContentType = require('../lib/mime').getContentType;

describe("Test mime.js", function () {
	
	describe("getContentType()", function () {
		it("should load correctly", function () {
			getContentType.should.be.a('function');
		});
		it("should return 'text/html' for a html file", function () {
			getContentType('index.html').should.be.a('string').and.equal('text/html');
		});
		it("should return 'text/css' for a css file", function () {
			getContentType('base.css').should.be.a('string').and.equal('text/css');
		});
		it("should return 'application/javascript' for a js file", function () {
			getContentType('app.js').should.be.a('string').and.equal('application/javascript');
		});
		it("should return 'image/jpeg' for a jpg image file", function () {
			getContentType('image.jpg').should.be.a('string').and.equal('image/jpeg');
			getContentType('image.jpeg').should.be.a('string').and.equal('image/jpeg');
		});
		it("should return 'text/plain' for unknown files", function () {
			getContentType('readme.md').should.be.a('string').and.equal('text/plain');
		});
	});
	
});

