
const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('../models/User');

// Controllers
const userController = require('../controllers/user');
const contactController = require('../controllers/contact');
const appController = require('../controllers/app');


function appRoutes (app) {

	// app.use(function(req, res, next) {
	// 	req.isAuthenticated = function() {
	// 		var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
	// 		try {
	// 			return jwt.verify(token, process.env.TOKEN_SECRET);
	// 		} catch (err) {
	// 			return false;
	// 		}
	// 	};

	// 	if (req.isAuthenticated()) {
	// 		var payload = req.isAuthenticated();
	// 		User.findById(payload.sub, function(err, user) {
	// 			req.user = user;
	// 			next();
	// 		});
	// 	} else {
	// 		next();
	// 	}
	// });


	// contact
	//app.post('/contact', contactController.contactPost);
	
	// user
	app.put('/account', userController.ensureAuthenticated, userController.accountPut);
	app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
	app.post('/signup', userController.signupPost);
	app.post('/login', userController.loginPost);
	app.post('/forgot', userController.forgotPost);
	app.post('/reset/:token', userController.resetPost);
	app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);

	// app
	app.post('/app', userController.ensureAuthenticated, appController.appPost);
	app.get('/app/list', userController.ensureAuthenticated, appController.appList);
	app.post('/app/edit/:appId', userController.ensureAuthenticated, appController.appEditPost);
	app.get('/app/data/:appId', userController.ensureAuthenticated, appController.appData);
	app.delete('/app/:appId', userController.ensureAuthenticated, appController.appDelete);

	// /
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../app', 'index.html'));
	});

	app.get('*', function(req, res) {
	  res.redirect('/#' + req.originalUrl);
	});

}

module.exports = appRoutes;