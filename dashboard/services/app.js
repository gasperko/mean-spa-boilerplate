angular.module('MainApp')
	.service('App', function($http, $window, $q, $cookies) {
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
			getCurrent: function() {
				var currentAppID = $cookies.get('currentAppId');

				var deferred = $q.defer();

				if(currentAppID){

					var currentApp = $window.localStorage['app_' + currentAppID];
					if(currentApp){

						currentApp = JSON.parse(currentApp);
						
						deferred.resolve({
							data: {
								app: currentApp
							}
						});

					}else{

						return this
								.getData(currentAppID)
								.then(function(r){
									if(r && r.data){
										var app = r.data.app;
										$window.localStorage['app_' + app.appId ] = JSON.stringify(app);
									}
									return r;
								})
					}
					
				}else {
					
					deferred.reject();
				}
				
				return deferred.promise;

			}
		};
	});