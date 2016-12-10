angular.module('MainApp')
	.controller('AppsDetailCtrl', function($scope, $rootScope, $location, $window, $auth, App) {
		
		$scope.create = function() {

			App
				.create($scope.app)
				.then(function(r){
					console.log('r', r);
					if(r && r.data){
						$location.path('/apps/' + r.data.app.appId);
					}
				})
				.catch(function(response) {
					$scope.messages = {
						error: Array.isArray(response.data) ? response.data : [response.data]
					};
				});
		};
	});