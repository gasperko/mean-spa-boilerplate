angular.module('MainApp')
	.config(function($routeProvider, $locationProvider, $authProvider) {
		$locationProvider.html5Mode(true);

		$routeProvider
			.when('/:appId/dashboard', {
				templateUrl: 'partials/dashboard/home.html',
				controller: 'DashboardCtrl',
				resolve: {
					loginRequired: loginRequired
				}
			});


		function skipIfAuthenticated($location, $auth) {
			if ($auth.isAuthenticated()) {
				$location.path('/');
			}
		}

		function loginRequired($location, $auth) {
			if (!$auth.isAuthenticated()) {
				$location.path('/login');
			}
		}

	});
