angular.module('DashboardApp')
	.controller('TriggersSaveCtrl', function($scope, $rootScope, $log, $resource, $location, $window, $auth, $routeParams, $uibModalInstance, editModel, UrlHelper, Error, NgTableParams, Trigger, $sce) {

		var self = this;
		var aceMode = 'javascript';

		var baseCallbackDesc = '/*\n';
		baseCallbackDesc += 'global scope:\n';
		baseCallbackDesc += '\t@global {object} request(http request)\n';
		baseCallbackDesc += '\t@global {object} mailer(mail service)\n';
		baseCallbackDesc += '\n';
		baseCallbackDesc += 'callback function scope:\n';
		baseCallbackDesc += '\t@param {any} arg1(first argument of Event)\n';
		baseCallbackDesc += '\t@param {any} arg2(second argument of Event)\n';
		baseCallbackDesc += '\t...\n';
		baseCallbackDesc += '\t@param {any} argN(N argument of Event)\n';
		baseCallbackDesc += '*/\n';
		var baseCallback = baseCallbackDesc;
		baseCallback += 'function callback(arg1, arg2, argN) {\n';
		baseCallback += '\t // handle data\n';
		baseCallback += '}';

		function stripComments(stringIN) {
			var SLASH = '/';
			var BACK_SLASH = '\\';
			var STAR = '*';
			var DOUBLE_QUOTE = '"';
			var SINGLE_QUOTE = "'";
			var NEW_LINE = '\n';
			var CARRIAGE_RETURN = '\r';

			var string = stringIN;
			var length = string.length;
			var position = 0;
			var output = [];

			function getCurrentCharacter() {
				return string.charAt(position);
			}

			function getPreviousCharacter() {
				return string.charAt(position - 1);
			}

			function getNextCharacter() {
				return string.charAt(position + 1);
			}

			function add() {
				output.push(getCurrentCharacter());
			}

			function next() {
				position++;
			}

			function atEnd() {
				return position >= length;
			}

			function isEscaping() {
				if (getPreviousCharacter() == BACK_SLASH) {
					var caret = position - 1;
					var escaped = true;
					while (caret-- > 0) {
						if (string.charAt(caret) != BACK_SLASH) {
							return escaped;
						}
						escaped = !escaped;
					}
					return escaped;
				}
				return false;
			}

			function processSingleQuotedString() {
				if (getCurrentCharacter() == SINGLE_QUOTE) {
					add();
					next();
					while (!atEnd()) {
						if (getCurrentCharacter() == SINGLE_QUOTE && !isEscaping()) {
							return;
						}
						add();
						next();
					}
				}
			}

			function processDoubleQuotedString() {
				if (getCurrentCharacter() == DOUBLE_QUOTE) {
					add();
					next();
					while (!atEnd()) {
						if (getCurrentCharacter() == DOUBLE_QUOTE && !isEscaping()) {
							return;
						}
						add();
						next();
					}
				}
			}

			function processSingleLineComment() {
				if (getCurrentCharacter() == SLASH) {
					if (getNextCharacter() == SLASH) {
						next();
						while (!atEnd()) {
							next();
							if (getCurrentCharacter() == NEW_LINE || getCurrentCharacter() == CARRIAGE_RETURN) {
								return;
							}
						}
					}
				}
			}

			function processMultiLineComment() {
				if (getCurrentCharacter() == SLASH) {
					if (getNextCharacter() == STAR) {
						next();
						next();
						while (!atEnd()) {
							next();
							if (getCurrentCharacter() == STAR) {
								if (getNextCharacter() == SLASH) {
									next();
									next();
									return;
								}
							}
						}
					}
				}
			}

			function processRegularExpression() {
				if (getCurrentCharacter() == SLASH) {
					add();
					next();
					while (!atEnd()) {
						if (getCurrentCharacter() == SLASH && !isEscaping()) {
							return;
						}
						add();
						next();
					}
				}
			}

			while (!atEnd()) {
				processDoubleQuotedString();
				processSingleQuotedString();
				processSingleLineComment();
				processMultiLineComment();
				processRegularExpression();
				if (!atEnd()) {
					add();
					next();
				}
			}
			return output.join('');

		};

		function validateCallbackFuntion() {

			var r = false;

			try {

				var base = 'var window=null,console,document=null,angular=null,top=null,$=null,jQuery=null';

				var code = '(function(){';
				code += base;
				code += ';var $e=';
				code += $scope.trigger.callback;
				code += '; return $e;';
				code += '});';

				var ev = eval(code);
				console.log('ev', ev, ev(), typeof ev, typeof $e);
				console.log('eval', ev, ev());

				r = typeof ev === 'function' && typeof ev() === 'function';

			} catch (e) {

				r = false;
				console.log('error catch', e, e.toString());

			}

			return r;

		}

		function submit($form) {

			// TODO - melhorar tudo isso
			var req;
			$scope.callbackInvalid = false;
			$scope.canSave = true;

			$scope.validateCallbackError = 'Callback must be a <strong>function</strong>.';

			if (!$scope.canSave || !$scope.trigger.callback) {
				$scope.canSave = false;
				return;
			}

			if (!validateCallbackFuntion()) {
				$scope.callbackInvalid = true;
				return;
			}

			if (!!~$scope.trigger.callback.indexOf('console.')) {
				$scope.callbackInvalid = true;
				$scope.validateCallbackError = '<strong>console</strong> is not defined.';
				//$rootScope.$safeApply();
				return;
			}

			// remove comentários do código
			// $scope.trigger.callback = $scope.trigger.callback.replace(baseCallbackDesc, '');
			$scope.trigger.callback = stripComments($scope.trigger.callback);


			if (!$scope.isEdit) {
				req = Trigger.create($scope.trigger);
			} else {
				req = Trigger.update($scope.trigger._id, $scope.trigger);
			}

			req
				.then(function(r) {
					console.log('r', r);
					$scope.trigger = {};
					close();
				})
				.catch(function(response) {
					$scope.messages = {
						error: Array.isArray(response.data) ? response.data : [response.data]
					};
				});

		}

		function close() {
			$uibModalInstance.close();
		}

		function init() {
			console.log('editModel', editModel);
			if (editModel) {
				$scope.isEdit = true;
				$scope.trigger = editModel;
			} else {
				$scope.trigger = {
					enabled: true
				};

				$scope.trigger.callback = baseCallback;
			}
		}

		$scope.aceOption = {
			theme: 'chrome',
			mode: aceMode.toLowerCase(),
			onLoad: function(_ace) {

				_ace.setShowPrintMargin(false);

				_ace.getSession().on("changeAnnotation", function() {

					var annot = _ace.getSession().getAnnotations();

					console.log('annot', annot);

					$scope.canSave = true;
					$scope.callbackInvalid = false;

					angular.forEach(annot, function(a) {
						if (a.type === 'error') {
							$scope.canSave = false;
						}
					});

					$rootScope.$safeApply();

				});

			}
		};

		$scope.validateCallbackError = 'Callback must be a <strong>function</strong>.';
		$scope.canSave = true;
		$scope.submit = submit;
		$scope.close = close;

		init();

	});
