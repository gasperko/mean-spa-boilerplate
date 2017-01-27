'use strict';

function BaseResponse(data) {

	this.isValid = false;
	this.errors = [];
	this.data = null;

}

BaseResponse.prototype.valid = function valid() {

	this.isValid = true;

	return this;

};

BaseResponse.prototype.setData = function setData(data) {

	this.data = data;

	return this;

};

BaseResponse.prototype.addError = function addError(error) {

	this.isValid = false;
	this.errors.push(error);

	return this;

};


module.exports = BaseResponse;