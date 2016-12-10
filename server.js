/* jshint node: true, esversion: 6 */

'use strict';

const
	express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	compression = require('compression'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	expressValidator = require('express-validator'),
	dotenv = require('dotenv'),
	mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	moment = require('moment'),
	request = require('request'),
	mongoosePaginate = require('mongoose-paginate'),
	User = require('./models/User');

// Load environment variables from .env file
dotenv.load();

// Routes
const appRoutes = require('./routes/app');
const collectRoutes = require('./routes/collect');
const dashboardRoutes = require('./routes/dashboard');

mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {

	console.log('MongoDB Connection Error. Please make sure that MongoDB is running.', arguments);
	process.exit(1);

});

mongoosePaginate.paginate.options = {
	lean: false,
	limit: 10,
};

const app = express();

app.use(cors());

app.set('port', process.env.PORT || 3030);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {

	req.isAuthenticated = function() {

		var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;

		try {
			return jwt.verify(token, process.env.TOKEN_SECRET);
		} catch (err) {
			return false;
		}

	};

	if (req.isAuthenticated()) {

		var payload = req.isAuthenticated();

		User.findById(payload.sub, function(err, user) {
			req.user = user;
			next();
		});

	} else {
		next();
	}

});

dashboardRoutes(app);
collectRoutes(app);
// app deve sempre ser o último
appRoutes(app);

// Production error handler
if (app.get('env') === 'production') {

	app.use(function(err, req, res, next) {

		console.error(err.stack);
		res.sendStatus(err.status || 500);

	});

}

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
