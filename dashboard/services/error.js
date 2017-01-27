angular.module('DashboardApp')
	.service('Error', function($http, $httpParamSerializer, UrlHelper) {
		
		function buildUrl(path) {
			path = path ? '/' + path : '';
			return UrlHelper.buildUrl('/error' + path);
		}

		return {
			list: function() {
				var url = UrlHelper.buildUrl('/errors');
				return $http.get(url);
			},
			delete: function(id) {
				var url = buildUrl(id);
				return $http.delete(url);
			},
			update: function(id) {
				var url = buildUrl(id);
				return $http.put(url);
			},
			bulk: function(action, data, all) {
				var url = buildUrl('bulk');
				
				var params = {
					action: action,
					data: data
				};

				if(!!all){
					params.all = true;
				}
								
				console.log('params', params);

				return $http({
					url: url,
					method: 'GET',
					params: params,
					paramSerializer: '$httpParamSerializerJQLike'
				});
			},
			stats: function() {
				var url = buildUrl('stats');
				return $http.get(url);
			}
		};

	});