angular.module('MainApp')
	.service('Dashboard', function($http, $window, UrlHelper) {
		
		var requestCache = [];

		return {
			stats: function() {

				if(requestCache['stats']){
					return requestCache['stats'];
				}else{
					var url = UrlHelper.buildUrl('/stats');
					requestCache['stats'] = $http.get(url);
					requestCache['stats']
						.then(function(r){
							requestCache['stats'] = null;
							return r;
						})
					return requestCache['stats'];
				}
				
			}
		};
	});