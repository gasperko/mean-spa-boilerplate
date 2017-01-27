'use strict';

const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('../models/User');

// Controllers
const appController = require('../controllers/app');
const dashboardController = require('../controllers/dashboard');
const errorController = require('../controllers/error');
const eventsController = require('../controllers/custom-events');
const triggersController = require('../controllers/trigger');


function buildUrl(path) {
	return '/:appId/dashboard' + (path || '');
}

function dashboardRoutes(app) {

	// dashboard
	app.get(buildUrl(), dashboardController.ensureAppAuthority, function(req, res) {
		// res.sendFile(path.join(__dirname, '../../sb-admin-angular/app', 'index.html'));
		res.sendFile(path.join(__dirname, '../dashboard', 'index.html'));
	});
	app.get(buildUrl('/stats'), dashboardController.ensureAppAuthority, dashboardController.stats);

	// errors
	app.get(buildUrl('/errors'), dashboardController.ensureAppAuthority, errorController.errors);
	app.get(buildUrl('/error/bulk'), dashboardController.ensureAppAuthority, errorController.errorBulk);
	app.get(buildUrl('/error/stats'), dashboardController.ensureAppAuthority, errorController.errorStats);
	app.delete(buildUrl('/error/:id'), dashboardController.ensureAppAuthority, errorController.errorDelete);
	app.put(buildUrl('/error/:id'), dashboardController.ensureAppAuthority, errorController.errorPut);

	// custom-events
	app.get(buildUrl('/custom-events'), dashboardController.ensureAppAuthority, eventsController.customEvents);
	app.get(buildUrl('/custom-event/bulk'), dashboardController.ensureAppAuthority, eventsController.customEventBulk);	
	app.get(buildUrl('/custom-event/stats'), dashboardController.ensureAppAuthority, eventsController.customEventStats);
	app.delete(buildUrl('/custom-event/:id'), dashboardController.ensureAppAuthority, eventsController.customEventsDelete);
	app.put(buildUrl('/custom-event/:id'), dashboardController.ensureAppAuthority, eventsController.customEventsPut);

	// triggers
	app.get(buildUrl('/triggers'), dashboardController.ensureAppAuthority, triggersController.triggers);
	app.post(buildUrl('/triggers'), dashboardController.ensureAppAuthority, triggersController.triggersPost);
	app.get(buildUrl('/trigger/bulk'), dashboardController.ensureAppAuthority, triggersController.triggerBulk);
	app.get(buildUrl('/trigger/:id'), dashboardController.ensureAppAuthority, triggersController.trigger);
	app.delete(buildUrl('/trigger/:id'), dashboardController.ensureAppAuthority, triggersController.triggerDelete);
	app.put(buildUrl('/trigger/:id'), dashboardController.ensureAppAuthority, triggersController.triggerPut);

}

module.exports = dashboardRoutes;
