angular.module('DashboardApp')
	.controller('DashboardCtrl', function($scope, $rootScope, $location, $window, $auth, $routeParams, App) {

		function buildSnippet(app) {

			$scope.textToCopy = "(function(j, s, e, l, i, n, f, o) {\n";
			$scope.textToCopy += "j['JselObject'] = i;\n";
			$scope.textToCopy += "j[i] = j[i] || function() {\n";
			$scope.textToCopy += "    (j[i].q = j[i].q || []).push(arguments)\n";
			$scope.textToCopy += "},\n";
			$scope.textToCopy += "j[i].id = '" + app.appId +"',\n";
			$scope.textToCopy += "n = s.createElement(e),\n";
			$scope.textToCopy += "f = s.getElementsByTagName(e)[0];\n";
			$scope.textToCopy += "n.async = 1;\n";
			$scope.textToCopy += "n.src = l;\n";
			$scope.textToCopy += "f.parentNode.insertBefore(n, f)\n";
			$scope.textToCopy += "})(window, document, 'script', 'http://jsel.info/static/scripts/jsel.js', 'jsel');";
			
		}

		function init() {

			App
                .getCurrent()
                .then(function(r) {
                    if (r && r.data && r.data.app) {
                        $scope.app = r.data.app;
                        buildSnippet($scope.app);
                    }
                });

		}

		$scope.btnCopyText = 'Copy to clipboard';

		$scope.textToCopy = '';

		$scope.app = {};

		$scope.success = function () {
            console.log('Copied!');
            $scope.btnCopyText = 'Copied!';
        };

        $scope.fail = function (err) {
            console.error('Error!', err);
            $scope.btnCopyText = 'Error!';
        };

		init();

	});
