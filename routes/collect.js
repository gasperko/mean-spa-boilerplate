'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const subdomain = require('express-subdomain');
const User = require('../models/User');

const controller = require('../controllers/collect');


function collectRoutes(app) {

	const collectRouter = express.Router();

	collectRouter.get('/', controller.index);

	collectRouter.post('/error', controller.ensureValidApp, controller.error);

	collectRouter.get('/error/:trace', controller.ensureValidApp, controller.errorTrace);

	collectRouter.post('/custom', controller.ensureValidApp, controller.customEventHook, controller.customEvent);

	collectRouter.get('/custom/:trace', controller.ensureValidApp, controller.customEventHook, controller.customEventTrace);

	app.use(subdomain('collect', collectRouter));

}

module.exports = collectRoutes;