'use strict';

const path = require('path');
const fs = require('fs');
const async = require('async');
const curl = require('curlrequest');
const useragent = require('useragent');
const _ = require('lodash/core');

const Error = require('../models/Error');
const CustomEvent = require('../models/CustomEvent');
const App = require('../models/App');

const BulkAction = require('../builders/BulkAction');

const requestHelper = require('../helpers/request');


/**
 * GET /errors
 */
exports.errors = function(request, response) {
	
	let app = request.app

    if (!app) {
        return response.status(400).send();
    }

    var pageConfig = { 
    	page: request.query.page || 1, 
    	limit: request.query.count || 10,
    	sort: request.query.sorting || {'data.date': 'desc'}
    };

    var baseQuery = {
    	appId: app.appId
    };

    if(request.query.filter &&
    	_.isObject(request.query.filter)){

    	_.extend(baseQuery, {
    		//'data.message': request.query.filter._all
    		// 'data.message': { '$in' : [request.query.filter._all]}
    		'data.message': { '$regex': request.query.filter._all, '$options': 'i' } 
    	});

    }
    // Error.find
	Error.paginate(
		baseQuery,
	    pageConfig
	    , function(err, errors) {

	    	console.log(err, errors);

	        if (!errors) {
	            return response.status(401).send();
	        }
	       
	   //      errors = errors.docs.map(function(e){
				// var data = e.data;
				// // data.browser = useragent.parse(data.userAgent);
				// // console.log('data.browser', data.browser);
				// data = e.toJSON();
	   //      	return data;
	   //      });

	        // response.send({
	        //     errors: errors
	        // });

			response.send(errors);

        
    });

};

/**
 * GET /error/bulk
 */
exports.errorBulk = function(request, response) {
	
	let app = request.app

	let bulkAction = new BulkAction(request.query);

	console.log('bulkAction', bulkAction);

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

	Error[bulkAction.action](
		query,
		function(err, errors) {

		if (err) {
			return response.status(401).send(err);
		}

		response.send(errors);

	});

};

/**
 * DELETE /errors/:id
 */
exports.errorDelete = function(request, response) {
	
	let app = request.app

    if (!app) {
        return response.status(400).send();
    }

	Error.remove({
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
            msg: 'Error has been permanently deleted.'
        });
    });

};