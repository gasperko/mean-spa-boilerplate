angular.module('MainApp')
	.controller('AppsCreateCtrl', function($scope, $rootScope, $location, $window, $auth, App) {
		
		$scope.buttonLabel = 'Create';

		$scope.submit = function() {

			App
				.create($scope.app)
				.then(function(r){
					console.log('r', r);
					if(r && r.data){
						$location.path('/app/' + r.data.app.appId);
					}
				})
				.catch(function(response) {
					$scope.messages = {
						error: Array.isArray(response.data) ? response.data : [response.data]
					};
				});
		};

	});