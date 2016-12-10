angular.module('MainApp')
	.controller('DashboardCtrl', function($scope, $rootScope, $location, $window, $auth, $routeParams, App) {

		function init() {

			App
				.getData($routeParams.appId)
				.then(function(r) {
					console.log('r', r);
					if (r && r.data && r.data.apps) {
						$scope.app = r.data.app;
					}
				});

		}

		$scope.profile = $rootScope.currentUser;
		$scope.app = [];

		$scope.remove = function(app) {
			var sure = confirm('Do you want to remove?');
			if (sure) {
				App
					.delete(app.appId)
					.then(function(r) {
						var index = $scope.app.indexOf(app);
						$scope.app.splice(index, 1);
					});
			}
		}

		init();

	});
