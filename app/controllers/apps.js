angular.module('MainApp')
	.controller('AppsCtrl', function($scope, $rootScope, $location, $window, $auth, $cookies, App) {

		function init() {

			App
				.list()
				.then(function(r) {
					console.log('r', r);
					if (r && r.data && r.data.apps) {
						$scope.apps = r.data.apps;
					}
				});

		}

		$scope.profile = $rootScope.currentUser;
		$scope.apps = [];

		$scope.remove = function(app) {
			var sure = confirm('Do you want to remove?');
			if (sure) {
				App
					.delete(app.appId)
					.then(function(r) {
						var index = $scope.apps.indexOf(app);
						$scope.apps.splice(index, 1);
					});
			}
		};

		$scope.goToDashboard = function(app) {
			console.log('$scope.profile', $scope.profile);
			//$location.path('/' + app.appId + '/dashboard');
			// window.location.href = '/' + app.appId + '/dashboard';
			App.goToDashboard(app.appId);
		};

		init();

	});
