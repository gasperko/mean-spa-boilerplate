'use strict';

const path = require('path');
const fs = require('fs');
const async = require('async');
const curl = require('curlrequest');

const Error = require('../models/Error');
const CustomEvent = require('../models/CustomEvent');
const App = require('../models/App');
const Trigger = require('../models/Trigger');

const TriggerCallback = require('../builders/TriggerCallback');

const requestHelper = require('../helpers/request');

function _customEventTrigger(trigger, eventData) {

	console.log('eventData', eventData);

	trigger = new TriggerCallback(trigger.callback);

	var response = trigger.process(eventData);

	// parei aqui - TODO
	console.log('_customEventTrigger response', response);

}

exports.ensureValidApp = function(request, response, next) {

	var collectedData = requestHelper.parseBase64(request.body.data || request.params.trace);

	request.collectedData = collectedData;

	App.findOne({
		appId: collectedData.id,
	}, function(err, app) {

		if (!app) {
			return response.status(401).send({
				msg: 'App no found'
			});
		}

		next();

	});

};

exports.customEventHook = function(request, response, next) {

	var collectedData = requestHelper.parseBase64(request.body.data || request.params.trace);

	request.collectedData = collectedData;

	Trigger.find({
		eventName: collectedData.data.eventName,
		appId: collectedData.id,
		enabled: true
	}, function(err, triggers) {

		if (!err) {
			console.log(triggers);
		}

		// var triggers = triggers.map(function(t) {
		// 	return new TriggerCallback(t);
		// })
		var i = 0;
		(triggers || []).forEach(function(t) {
			console.log('i==================', i++);
			_customEventTrigger(t, collectedData.data.data);
		});

		next();

	});

};

// export for tests(TODO)
exports._customEventTrigger = _customEventTrigger;

/**
 * GET /
 */
exports.index = function(request, response) {
	response.send('JS Error Tracker');
};

/**
 * POST /error
 */
exports.error = function(request, response) {
	let errorData = requestHelper.parseBase64(request.body.data);

	var error = new Error({
		data: errorData.error,
		appId: errorData.id
	});

	error.save(function(err) {
		response.send({
			error: error
		});
	});
};

/**
 * GET /error/:trace
 */
exports.errorTrace = function(request, response) {
	//let errorData = requestHelper.parseBase64(request.params.trace);
	let errorData = request.collectedData;

	// var error = new Error({
	// 	data: errorData.data,
	// 	appId: errorData.id,
	// 	_new: true
	// });
	var error = buildError(errorData);

	error.save(function(err) {
		response.writeHead(200, {
			'Content-Type': 'image/gif'
		});

		response.end(fs.readFileSync(path.join(__dirname, '../public/static/images', 'pixel.gif')), 'binary');
	});
};

/**
 * POST /custom
 */
exports.customEvent = function(request, response) {
	//let event = requestHelper.parseBase64(request.body.data);
	let event = request.collectedData;

	var customEvent = new CustomEvent({
		data: event.data.data,
		eventName: event.data.eventName,
		appId: event.id
	});

	customEvent.save(function(err) {
		response.send({
			customEvent: customEvent
		});
	});
};

/**
 * GET /custom/:trace
 */
exports.customEventTrace = function(request, response) {
	//let event = requestHelper.parseBase64(request.params.trace);
	let event = request.collectedData;
	//console.log(event);
	//return;

	// var customEvent = new CustomEvent({
	// 	data: event.data.data,
	// 	eventName: event.data.eventName,
	// 	appId: event.id
	// });

	var customEvent = buildCustomEvent(event);

	customEvent.save(function(err) {
		response.writeHead(200, {
			'Content-Type': 'image/gif'
		});

		response.end(fs.readFileSync(path.join(__dirname, '../public/static/images', 'pixel.gif')), 'binary');
	});
};



//////

function buildError(errorData) {
	return new Error({
		data: errorData.error || errorData.data || {},
		appId: errorData.id,
		_new: true
	});
}

function buildCustomEvent(event) {
	return new CustomEvent({
		data: event.data.data,
		eventName: event.data.eventName,
		appId: event.id,
		_new: true
	});
}
