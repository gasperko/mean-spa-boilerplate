'use strict';

const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('../models/User');

// Controllers
const appController = require('../controllers/app');
const dashboardController = require('../controllers/dashboard');
const errorController = require('../controllers/error');
const eventsController = require('../controllers/custom-events');


function buildUrl(path) {
	return '/:appId/dashboard' + (path || '');
}

function dashboardRoutes(app) {

	// dashboard
	app.get(buildUrl(), dashboardController.ensureAppAuthority, function(req, res) {
		// res.sendFile(path.join(__dirname, '../../sb-admin-angular/app', 'index.html'));
		res.sendFile(path.join(__dirname, '../dashboard', 'index.html'));
	});

	app.get(buildUrl('/errors'), dashboardController.ensureAppAuthority, errorController.errors);
	app.get(buildUrl('/error/bulk'), dashboardController.ensureAppAuthority, errorController.errorBulk);
	app.delete(buildUrl('/error/:id'), dashboardController.ensureAppAuthority, errorController.errorDelete);

	app.get(buildUrl('/custom-events'), dashboardController.ensureAppAuthority, eventsController.customEvents);
	app.get(buildUrl('/custom-event/bulk'), dashboardController.ensureAppAuthority, eventsController.customEventBulk);	
	app.delete(buildUrl('/custom-event/:id'), dashboardController.ensureAppAuthority, eventsController.customEventsDelete);

}

module.exports = dashboardRoutes;
