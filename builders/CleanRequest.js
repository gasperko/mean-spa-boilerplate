const request = require('request');

function CleanRequest() {

	const baseRequest = request.defaults({
		timeout: 60
	});

	this.get = baseRequest.get;

	this.put = baseRequest.put;

	this.post = baseRequest.post;

	this.delete = baseRequest.delete;

	this.patch = baseRequest.patch;

	this.head = baseRequest.head;

}


module.exports = CleanRequest;