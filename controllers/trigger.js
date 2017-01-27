'use strict';

const path = require('path');
const fs = require('fs');
const async = require('async');
const curl = require('curlrequest');
const useragent = require('useragent');
const _ = require('lodash/core');

const Trigger = require('../models/Trigger');
const BulkAction = require('../builders/BulkAction');
const TriggerCallback = require('../builders/TriggerCallback');
const requestHelper = require('../helpers/request');

/**
 * GET /triggers
 */
exports.triggers = function(request, response) {

	let app = request.app

	if (!app) {
		return response.status(400).send();
	}

	var pageConfig = {
		page: request.query.page || 1,
		limit: request.query.count || 10,
		sort: request.query.sorting || {
			'createdAt': 'desc'
		}
	};

	var baseQuery = {
		appId: app.appId
	};

	if (request.query.filter &&
		_.isObject(request.query.filter)) {

		_.extend(baseQuery, {
			//'data.message': request.query.filter._all
			// 'data.message': { '$in' : [request.query.filter._all]}
			name: {
				'$regex': request.query.filter._all,
				'$options': 'i'
			},
			eventName: {
				'$regex': request.query.filter._all,
				'$options': 'i'
			}
		});

	}
	// Trigger.find
	Trigger.paginate(
		baseQuery,
		pageConfig,
		function(err, triggers) {

			//console.log('triggers', triggers);

			if (err) {
				return response.status(401).send();
			}

			response.send(triggers);


		});

};

/**
 * POST /triggers
 */
exports.triggersPost = function(request, response) {

	let app = request.app

	if (!app) {
		return response.status(400).send();
	}

	let data = request.body;

	let cb;
	//cb = new Function(data.callback);//
	// cb = function(){
	// 	return '1';
	// };
	cb = data.callback;

	data.callback = cb;

	console.log(data.callback, typeof data.callback);

	var trigger = new Trigger({
		name: data.name,
		eventName: data.eventName,
		//callback: data.callback,
		callback: cb,
		appId: app.appId,
		enabled: data.enabled
	});

	trigger.save(function(err) {
		response.send({
			trigger: trigger
		});
	});

};

/**
 * GET /trigger/:id
 */
exports.trigger = function(request, response) {

	let app = request.app

	if (!app) {
		return response.status(400).send();
	}

	Trigger.findOne({
			_id: request.params.id
		},
		function(err, trigger) {

			var f;
			trigger.callback = f = new TriggerCallback(trigger.callback);

			response.send({
				f: f,
				fType: typeof f,
				exec: f.process(),
				trigger: trigger,
				callback: trigger.callback,
				type: typeof trigger.callback,
				//result: typeof trigger.callback === 'function' ? trigger.callback() : 'not a function'
			});

		});
};

/**
 * GET /trigger/bulk
 */
exports.triggerBulk = function(request, response) {

	let app = request.app

	let bulkAction = new BulkAction(request.query);

	console.log('bulkAction', bulkAction);

	if (!app || !bulkAction.action) {
		return response.status(400).send();
	}

	bulkAction.execute(Trigger, response);
};

/**
 * DELETE /trigger/:id
 */
exports.triggerDelete = function(request, response) {

	let app = request.app

	if (!app) {
		return response.status(400).send();
	}

	Trigger.remove({
		appId: app.appId,
		_id: request.params.id
	}, function(err) {
		if (err) {
			response.status(400).send({
				msg: err.message,
				trigger: err
			});
			return;
		}
		response.send({
			msg: 'Trigger has been permanently deleted.'
		});
	});

};


/**
 * PUT /trigger/:id
 */
exports.triggerPut = function(request, response) {

	let app = request.app

	if (!app) {
		return response.status(400).send();
	}

	let updateParams = {
		name: request.body.name,
		eventName: request.body.eventName,
		callback: request.body.callback,
		enabled: !!request.body.enabled
	};

	Trigger.update({
		appId: app.appId,
		_id: request.params.id
	}, {
		'$set': updateParams
	}, function(err) {
		if (err) {
			response.status(400).send({
				msg: err.message,
				error: err
			});
			return;
		}

		response.send();
	});

};
