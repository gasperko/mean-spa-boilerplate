angular.module('MainApp')
	.controller('AppsEditCtrl', function($scope, $rootScope, $location, $window, $routeParams, App) {
		
		function init() {
			App
				.getData($routeParams.appId)
				.then(function(r) {
					console.info('r', r);
					if(r && r.data && r.data.app){
						$scope.app = r.data.app;
					}
				})
		}

		$scope.buttonLabel = 'Save';
		$scope.app = {};

		$scope.submit = function() {

			App
				.edit($routeParams.appId, $scope.app)
				.then(function(r){
					console.log('r', r);
					if(r && r.data){
						$location.path('/apps');
					}
				})
				.catch(function(response) {
					$scope.messages = {
						error: Array.isArray(response.data) ? response.data : [response.data]
					};
				});
		};

		init();
	});