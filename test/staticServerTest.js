/**
 * BDD test cases for static-server module.
 */

require('should');


describe("Test static-server", function () {
	it("should return an object", function () {
		require('../lib/static-server').init().should.be.a('object');
	});
	
	it("should have a handleRequest function", function () {
		require('../lib/static-server').init().should.have.property('handleRequest');
	});
});
