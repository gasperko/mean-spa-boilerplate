'use strict';

const path = require('path');
const fs = require('fs');
const async = require('async');
const curl = require('curlrequest');

const Error = require('../models/Error');
const CustomEvent = require('../models/CustomEvent');
const App = require('../models/App');

const requestHelper = require('../helpers/request');

exports.ensureValidApp = function(request, response, next) {
	let collectedData = requestHelper.parseBase64(request.body.data || request.params.trace);

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
}

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

	var error = new Error({
		data: errorData.data,
		appId: errorData.id
	});

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

	var customEvent = new CustomEvent({
		data: event.data.data,
		eventName: event.data.eventName,
		appId: event.id
	});

	customEvent.save(function(err) {
		response.writeHead(200, {
			'Content-Type': 'image/gif'
		});

		response.end(fs.readFileSync(path.join(__dirname, '../public/static/images', 'pixel.gif')), 'binary');
	});
};
