angular.module('MainApp')
	.service('User', function($http, $window, $cookies) {
		return {
			setToken: function(token) {
				return $cookies.put('token', token);
			}
		};
	});