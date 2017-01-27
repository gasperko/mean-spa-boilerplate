var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var shortId = require('shortid');
var qs = require('querystring');
var App = require('../models/App');

/**
 * POST /app
 */
exports.appPost = function(req, res, next) {
    req.assert('name', 'Name cannot be blank').notEmpty();

    var errors = req.validationErrors();

    var user = req.user;

    if (!user) {
        return res.status(400).send();
    }

    if (errors) {
        return res.status(400).send(errors);
    }

    app = new App({
        name: req.body.name,
        appId: shortId.generate(),
        host: req.body.host,
        _userId: user._id
    });
    app.save(function(err) {
    	if(err){
    		//console.log('err', err);
    		//return;
    		res.status(400).send({
    			msg: err.message,
    			error: err
    		});
    		return;
    	}
        res.send({
            app: app
        });
    });

};


/**
 * GET /app/data/:appId
 */
exports.appData = function(req, res, next) {
	
	var user = req.user;

    if (!user) {
        return res.status(400).send();
    }

	App.findOne({
        appId: req.params.appId,
        _userId: user._id
    }, function(err, app) {
        if (!app) {
            return res.status(401).send({
                msg: 'App no found'
            });
        }
       
        res.send({
            app: app.toJSON()
        });
        
    });

}

/**
 * POST /app/edit/:appId
 */
exports.appEditPost = function(req, res, next) {
	
	var user = req.user;

    if (!user) {
        return res.status(400).send();
    }

	App.findOne({
        appId: req.params.appId,
        _userId: user._id
    }, function(err, app) {
        if (!app) {
            return res.status(401).send({
                msg: 'App no found'
            });
        }
       
       	app.name = req.body.name;
       	app.host = req.body.host;

   		app.save(function(err) {
	    	if(err){
	    		//console.log('err', err);
	    		//return;
	    		res.status(400).send({
	    			msg: err.message,
	    			error: err
	    		});
	    		return;
	    	}
	        res.send({
	            app: app.toJSON()
	        });
	    });
       	
        
    });

}

/**
 * GET /app/list
 */
exports.appList = function(req, res, next) {
	
	var user = req.user;

    if (!user) {
        return res.status(400).send();
    }

	App.find({
        _userId: user._id
    }, function(err, apps) {

    	console.log(err, apps);

        if (!apps) {
            return res.status(401).send({
                msg: 'App no found'
            });
        }

        if(err){
    		res.status(400).send({
    			msg: err.message,
    			error: err
    		});
    		return;
    	}
       
       	 res.send({
            apps: apps
        });
        
    });

}

/**
 * DELETE /app/:appId
 */
exports.appDelete = function(req, res, next) {
	
	var user = req.user;

    if (!user) {
        return res.status(400).send();
    }

	App.remove({
        appId: req.params.appId,
        _userId: user._id
    }, function(err) {
    	if(err){
    		res.status(400).send({
    			msg: err.message,
    			error: err
    		});
    		return;
    	}
        res.send({
            msg: 'Your app has been permanently deleted.'
        });
    });

}
