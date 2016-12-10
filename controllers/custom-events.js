'use strict';

const path = require('path');
const fs = require('fs');
const async = require('async');
const curl = require('curlrequest');
const useragent = require('useragent');
const _ = require('lodash/core');

const BulkAction = require('../builders/BulkAction');

const CustomEvent = require('../models/CustomEvent');

const requestHelper = require('../helpers/request');


/**
 * GET /custom-events
 */
exports.customEvents = function(request, response) {
	
	let app = request.app

    if (!app) {
        return response.status(400).send();
    }

    var pageConfig = { 
    	page: request.query.page || 1, 
    	limit: request.query.count || 10,
    	sort: request.query.sorting || {'createdAt': 'desc'}
    };

    var baseQuery = {
    	appId: app.appId
    };

    if(request.query.filter &&
    	_.isObject(request.query.filter)){

    	_.extend(baseQuery, {
    		'eventName': { '$regex': request.query.filter._all, '$options': 'i' } 
    	});

    }
	CustomEvent.paginate(
		baseQuery,
	    pageConfig
	    , function(err, events) {

	        if (!events) {
	            return response.status(401).send();
	        }
	       
			response.send(events);
        
    });

};

/**
 * GET /custom-event/bulk
 */
exports.customEventBulk = function(request, response) {
	
	let app = request.app
	let bulkAction = new BulkAction(request.query);

    if (!app || !bulkAction.action) {
        return response.status(400).send();
    }

    var query = {};

    if(!bulkAction.all) {
    	query = {
			_id: {
				$in: bulkAction.data
			}
		};
    }

	CustomEvent[bulkAction.action](
		query,
		function(err, errors) {

		if (err) {
			return response.status(401).send(err);
		}

		response.send(errors);

	});

};

/**
 * DELETE /custom-event/:id
 */
exports.customEventsDelete = function(request, response) {
	
	let app = request.app

    if (!app) {
        return response.status(400).send();
    }

	CustomEvent.remove({
        appId: app.appId,
        _id: request.params.id
    }, function(err) {
    	if(err){
    		response.status(400).send({
    			msg: err.message,
    			error: err
    		});
    		return;
    	}
    	
        response.send({
            msg: 'Event has been permanently deleted.'
        });
    });

};