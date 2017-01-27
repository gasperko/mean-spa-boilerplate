'use strict';

const safeEval = require('safe-eval');

const CleanRequest = require('./CleanRequest');
const CleanMailer = require('./CleanMailer');
const BaseResponse = require('./BaseResponse');

const _context = {
	request: new CleanRequest(),
	mailer: new CleanMailer()
};

function TriggerCallback(data) {

	if (data) {
		this.evalData(data);
	}

}

TriggerCallback.prototype.evalData = function evalData(data) {

	this._method = safeEval(data, _context);

};

TriggerCallback.prototype.process = function process(eventData) {

	let response = new BaseResponse();

	if (this._method && typeof this._method === 'function') {

		try {

			var responseData = this._method.apply(null, eventData);

			return response
				.setData(responseData)
				.valid();

		} catch (e) {

			return response.addError(e.toString());

		}

	} else {
		return response.addError('the callback argument is not a function');
	}

};



module.exports = TriggerCallback;
