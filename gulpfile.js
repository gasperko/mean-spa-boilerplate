/* jshint node: true, esversion: 6 */

'use strict';

const
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	argv = require('yargs').argv,
	concat = require('gulp-concat'),
	ngAnnotate = require('gulp-ng-annotate'),
	templateCache = require('gulp-angular-templatecache'),
	autoprefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	imagemin = require('gulp-imagemin'),
	csso = require('gulp-csso'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	plumber = require('gulp-plumber'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync'),
	spawn = require('child_process').spawn,
	gulpUtil = require('gulp-util');

gulp.task('server', () => {

	if (node) {
		node.kill();
	}

	node = spawn('node', ['server.js'], {
		stdio: 'inherit'
	});

	node.on('close', (code) => {

		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		}

	});

});

gulp.task('nodemon', (cb) => {

	let bunyan,
		started = false;

	return nodemon({
		script: 'server.js',
		ext: 'js json',
		ignore: [
			'var/',
			'node_modules/',
			'public/',
			'app/',
			'gulpfile.js',
		],
		watch: [
			// 'server.js',
			'*.js',
			'app/*',
			'controllers/*',
			'models/*',
		],
		stdout: false,
		readable: false,
	}).on('start', () => {

		// to avoid nodemon being started multiple times
		if (!started) {

			cb();
			started = true;

		}

	});

});

gulp.task('sass', () => {

	return gulp.src('public/app/css/main.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulpif(argv.production, csso()))
		.pipe(gulp.dest('public/app/css'));

});

gulp.task('dashboardSass', () => {

	return gulp.src('public/dashboard/css/main.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulpif(argv.production, csso()))
		.pipe(gulp.dest('public/dashboard/css'));

});

gulp.task('angular', () => {

	return gulp.src([
			'app/app.js',
			'app/controllers/*.js',
			'app/services/*.js'
		])
		.pipe(concat('application.js'))
		.pipe(ngAnnotate())
		.pipe(gulpif(argv.production, uglify()))
		.pipe(gulp.dest('public/app/js'));

});

gulp.task('dashboardAngular', () => {

	return gulp.src([
			'dashboard/mainAppLink.js',
			'dashboard/app.js',
			'dashboard/controllers/*.js',
			'dashboard/services/*.js',
			'dashboard/filters/*.js'
		])
		.pipe(concat('application.js'))
		.pipe(ngAnnotate())
		.pipe(gulpif(argv.production, uglify()))
		.pipe(gulp.dest('public/dashboard/js'));

});

gulp.task('staticScripts', () => {

	return gulp.src('static/assets/**/*.js')
		.pipe(uglify().on('error', gulpUtil.log))
		.pipe(gulp.dest('public/static'));

});

gulp.task('staticImages', () => {

	return gulp.src('static/assets/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('public/static/images'));

});

gulp.task('images', () => {

	return gulp.src('public/app/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('public/app/images'));

});

gulp.task('dashboardImages', () => {

	return gulp.src('public/dashboard/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('public/dashboard/images'));

});

gulp.task('templates', () => {

	return gulp.src('app/partials/**/*.html')
		.pipe(templateCache({
			root: 'partials',
			module: 'MainApp'
		}))
		.pipe(gulpif(argv.production, uglify()))
		.pipe(gulp.dest('public/app/js'));

});

gulp.task('dashboardTemplates', () => {

	return gulp.src('dashboard/partials/**/*.html')
		.pipe(templateCache({
			root: 'partials',
			module: 'DashboardApp'
		}))
		.pipe(gulpif(argv.production, uglify()))
		.pipe(gulp.dest('public/dashboard/js'));

});

gulp.task('vendor', () => {

	return gulp.src('app/vendor/*.js')
		.pipe(gulpif(argv.production, uglify()))
		.pipe(gulp.dest('public/app/js/lib'));

});

gulp.task('dashboardVendor', () => {

	return gulp.src('dashboard/vendor/*.js')
		.pipe(gulpif(argv.production, uglify()))
		.pipe(gulp.dest('public/dashboard/js/lib'));

});

gulp.task('watch', () => {

	gulp.watch('public/app/css/**/*.scss', ['sass']);
	gulp.watch('public/dashboard/css/**/*.scss', ['dashboardSass']);

	gulp.watch('app/partials/**/*.html', ['templates']);
	gulp.watch('dashboard/partials/**/*.html', ['dashboardTemplates']);

	gulp.watch('app/**/*.js', ['angular']);
	gulp.watch('dashboard/**/*.js', ['dashboardAngular']);

	gulp.watch('static/assets/**/*.js', ['staticScripts']);

});

gulp.task('browser-sync', ['nodemon'], () => {

	browserSync.init(null, {
		proxy: 'http://localhost:3030',
		files: ['public/**/*.*'],
		browser: 'chrome',
		port: 7000,
		task: ['nodemon'],
	});

});

gulp.task('statics', ['staticScripts', 'staticImages']);
gulp.task('dashboard', ['dashboardAngular', 'dashboardSass', 'dashboardAngular', 'dashboardVendor', 'dashboardImages', 'dashboardTemplates']);

gulp.task('build', ['sass', 'angular', 'vendor', 'templates', 'images', 'statics', 'dashboard']);
gulp.task('default', ['build', 'nodemon', 'watch', 'browser-sync']);
