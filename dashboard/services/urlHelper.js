angular.module('DashboardApp')
	.service('UrlHelper', function($http, $window, $q, $cookies) {
		
		var currentAppID = $cookies.get('currentAppId');

		return {
			buildUrl: function(path) {
				return '/' + currentAppID + '/dashboard' + path;
			}
		};
	});