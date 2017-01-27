(function(document, window, debug, undefined) {

	'use strict';

	var jsel;
	var globalErrors;
	var customEvents;
	var noop;
	var settingsDefault;
	var _uniqueIdCounter;

	_uniqueIdCounter = 1;

	noop = function() {};

	settingsDefault = {
		sendType: 'img',
		errorHandler: noop
	};

	globalErrors = {
		_customHandler: function(error) {

			var errorHandler = jsel.settings.errorHandler;

			if (errorHandler) {

				if (typeof errorHandler === 'function') {

					log('error handler function', errorHandler(error));
					error.jselCustomData = errorHandler(error);

				} else {

					log('error handler other', errorHandler());
					error.jselCustomData = errorHandler;

				}

			}

			return error;

		},
		_onError: function(error) {

			log('event listener error', error);

			error = globalErrors._customHandler(error);

			globalErrors._dispatch(error);

		},
		_dispatch: function(data) {

			var url = _buildUrl('error');

			return _dispatch(url, new Error(data));

		},
		register: function() {

			window.addEventListener('error', this._onError, false);

		}
	};

	customEvents = {
		_resolvePreRegistered: function() {

			var self = this;

			if (jsel &&
				jsel.q &&
				Array.isArray(jsel.q) &&
				jsel.q.length
			) {

				jsel.q.forEach(function(event) {
					self.handle(event);
				});

			}

		},
		_dispatch: function(eventName, data) {

			var url = _buildUrl('custom');
			var msg = new DispatcherMessage();

			msg.eventName = eventName;
			msg.data = data;

			_dispatch(url, msg, true);

		},
		handle: function(bag) {

			var command;
			var args;

			if (bag && typeof bag === 'string') {

				command = bag;
				args = Array.prototype.slice.call(arguments, 1);

				customEvents._dispatch(command, args);

				return true;

			} else if (bag && typeof bag === 'object' && bag.length) {

				return this.handle.apply(this, bag);

			} else {

				console.error('Invalid parameter, the first parameter of the jsel method must be a string.');

				return;

			}

		},
		register: function() {

			this._resolvePreRegistered();
			window[window.JselObject] = this.handle;

		}
	};

	// ** Classes
	function DispatcherMessage(data) {

		this.data = data;
		this.id = jsel.id;

	}

	function Error(error) {

		this.date = new Date();
		this.message = error.message;
		this.url = error.source;
		this.line = error.lineno;
		this.column = error.colno;
		this.fileName = error.filename;
		this.locationObject = window.location;
		this.userAgent = window.navigator.userAgent;
		this.platform = window.navigator.platform;
		this.language = window.navigator.language;
		this.cookieEnabled = window.navigator.cookieEnabled;
		this.cookie = document.cookie;

		// this.errorObject = JSON.stringify(error.error),
		// this.errorStack = error.error.stack,

		if (error.jselCustomData) {
			this.customData = error.jselCustomData;
		}

	}
	// **

	function log() {

		if (debug) {
			console.log.apply(console, arguments);
		}

	}

	function _polyfills() {

		// addEventListener
		(function(root) {

			if (!root.addEventListener) {
				(function(WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
					WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function(type, listener) {
						var target = this;

						registry.unshift([target, type, listener, function(event) {
							event.currentTarget = target;
							event.preventDefault = function() {
								event.returnValue = false;
							};
							event.stopPropagation = function() {
								event.cancelBubble = true;
							};
							event.target = event.srcElement || target;

							listener.call(target, event);
						}]);

						this.attachEvent('on' + type, registry[0][3]);
					};

					WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function(type, listener) {
						for (var index = 0, register; register = registry[index]; ++index) {
							if (register[0] === this && register[1] === type && register[2] === listener) {
								return this.detachEvent('on' + type, registry.splice(index, 1)[0][3]);
							}
						}
					};

					WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function(eventObject) {
						return this.fireEvent('on' + eventObject.type, eventObject);
					};
				})(Window.prototype, HTMLDocument.prototype, Element.prototype, 'addEventListener', 'removeEventListener', 'dispatchEvent', []);
			}

		}(window));

		// btoa
		(function(root) {

			if (!root.btoa) {

				var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
					b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

				root.btoa = function(string) {

					string = String(string);

					var bitmap,
						a,
						b,
						c,
						result = '',
						i = 0,
						rest = string.length % 3; // To determine the final padding

					for (; i < string.length;) {

						if (
							(a = string.charCodeAt(i++)) > 255 ||
							(b = string.charCodeAt(i++)) > 255 ||
							(c = string.charCodeAt(i++)) > 255
						) {

							throw new TypeError('Failed to execute "btoa" on "Window": The string to be encoded contains characters outside of the Latin1 range.');

						}

						bitmap = (a << 16) | (b << 8) | c;

						result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) + b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);

					}

					return rest ? result.slice(0, rest - 3) + '==='.substring(rest) : result;

				};

			}

		}(window));

		// Array.forEach
		(function(root) {

			if (!Array.prototype.forEach) {

				Array.prototype.forEach = function(callback, thisArg) {

					var T,
						k;

					if (this === null) {
						throw new TypeError('this is null or not defined');
					}

					var O = Object(this),
						len = O.length >>> 0;

					if (typeof callback !== 'function') {
						throw new TypeError(callback + ' is not a function');
					}

					if (arguments.length > 1) {
						T = thisArg;
					}

					k = 0;

					while (k < len) {

						var kValue;

						if (k in O) {

							kValue = O[k];

							callback.call(T, kValue, k, O);
						}

						k++;

					}

				};

			}

		}(window));

		// Array.isArray()
		(function(root) {

			if (!Array.isArray) {

				Array.isArray = function(arg) {
					return Object.prototype.toString.call(arg) === '[object Array]';
				};

			}

		}(window));

	}

	function _uniqueId() {

		var d = new Date(),
			m = d.getMilliseconds() + "",
			u = ++d + m + (++_uniqueIdCounter === 10000 ? (_uniqueIdCounter = 1) : _uniqueIdCounter);

		return u;

	}

	function _encode(object) {
		return window.btoa(JSON.stringify(object));
	}

	function _buildUrl(url) {

		//var base = 'https://collect.jsel.info/';
		var base = 'http://collect.jsel.info/';

		if (debug) {
			base = 'http://collect.jseldev.com:3030/';
		}

		return base + url;

	}

	function _applySettings() {

		jsel.settings = jsel.settings || settingsDefault;

	}

	function _dispatch(url, data, timestamp, mustNotRetry) {

		data = new DispatcherMessage(data);

		if (jsel.settings.sendType && jsel.settings.sendType === 'ajax') {

			var xhr = new XMLHttpRequest();

			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send('data=' + _encode(data));

		} else {

			var sufix = !timestamp ? '' : '?_' + _uniqueId();
			var image = new Image();

			if (!mustNotRetry) {
				image.onerror = function() {
					_dispatch(url, data, timestamp, true);
				};
			}

			image.src = url + '/' + _encode(data) + sufix;

		}

	}

	function __construct(jselObject) {

		jsel = jselObject;

		if (jsel._loaded) {
			return;
		} else {
			jsel._loaded = true;
		}

		_polyfills();

		_applySettings();

		// Global Errors
		globalErrors.register();

		// Custom Events
		customEvents.register();

	}

	if (window.JselObject && typeof window.JselObject === 'string' && window[window.JselObject]) {

		if (window[window.JselObject].id && typeof window[window.JselObject].id === 'string') {

			__construct(window[window.JselObject]);

		} else {

			console.warn('Missing JSEL app ID.');

		}

	} else {

		console.error('JSEL object(JselObject) is not defined.');

	}

}(document, window, false));
