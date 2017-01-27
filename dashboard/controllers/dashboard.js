angular.module('DashboardApp')
	.controller('DashboardCtrl', function($scope, $rootScope, $location, $window, $auth, $routeParams, App, Dashboard) {

		function buildSnippet(app) {

			var textToCopy = '';

			textToCopy += "<script>\n";
			textToCopy += "\t(function(j, s, e, l, i, n, f, o) {\n";
			textToCopy += "\t\tj['JselObject'] = i;\n";
			textToCopy += "\t\tj[i] = j[i] || function() {\n";
			textToCopy += "\t\t    (j[i].q = j[i].q || []).push(arguments)\n";
			textToCopy += "\t\t},\n";
			textToCopy += "\t\tj[i].id = '" + app.appId + "',\n";
			textToCopy += "\t\tn = s.createElement(e),\n";
			textToCopy += "\t\tf = s.getElementsByTagName(e)[0];\n";
			textToCopy += "\t\tn.async = 1;\n";
			textToCopy += "\t\tn.src = l;\n";
			textToCopy += "\t\tf.parentNode.insertBefore(n, f)\n";
			textToCopy += "\t})(window, document, 'script', '//jsel.info/static/scripts/jsel.js', 'jsel');\n";
			textToCopy += "</script>\n";


			return textToCopy;

		}

		function init() {

			App
				.getCurrent()
				.then(function(r) {
					if (r && r.data && r.data.app) {
						$scope.app = r.data.app;
						$scope.textToCopy = buildSnippet($scope.app);
					}
				});

			Dashboard
				.stats()
				.then(function(r) {
					console.log('callback 2', r);
					if (r && r.data) {
						$rootScope.stats = r.data;
					}
				});
		}

		$scope.btnCopyText = 'Copy to clipboard';

		$scope.textToCopy = '';

		$scope.app = {};
		$rootScope.stats = {};

		$scope.success = function() {
			console.log('Copied!');
			$scope.btnCopyText = 'Copied!';
		};

		$scope.fail = function(err) {
			console.error('Error!', err);
			$scope.btnCopyText = 'Error!';
		};

		$scope.aceOption = {
			mode: 'html',
			useWrapMode: false,
			showGutter: false,
			theme: 'chrome',
			onLoad: function(_ace) {

				_ace.setReadOnly(true);
				_ace.setShowPrintMargin(false);
				_ace.setHighlightActiveLine(false);
				_ace.setBehavioursEnabled(false);
				_ace.setDisplayIndentGuides(false);
				
			}
		};

		init();

	});