angular.module('MainApp')
	.service('App', function($http) {
		return {
			list: function() {
				return $http.get('/app/list');
			},
			create: function(data) {
				return $http.post('/app', data);
			},
			edit: function(id, data) {
				return $http.post('/app/edit/' + id, data);
			},
			delete: function(id) {
				return $http.delete(/app/ + id);
			},
			getData: function(id) {
				return $http.get('/app/data/' + id);
			},
			goToDashboard: function(id) {
				window.location.href = '/' + id + '/dashboard';
				return;
			}
			// ,
			// updateProfile: function(data) {
			// 	return $http.put('/account', data);
			// },
			// changePassword: function(data) {
			// 	return $http.put('/account', data);
			// },
			// deleteAccount: function() {
			// 	return $http.delete('/account');
			// },
			// forgotPassword: function(data) {
			// 	return $http.post('/forgot', data);
			// },
			// resetPassword: function(data) {
			// 	return $http.post('/reset', data);
			// }
		};
	});