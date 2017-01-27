angular.module('DashboardApp')
	.service('CustomEvent', function($http, UrlHelper) {
		
		function buildUrl(path) {
			path = path ? '/' + path : '';
			return UrlHelper.buildUrl('/custom-event' + path);
		}

		return {
			list: function() {
				var url = UrlHelper.buildUrl('/custom-events');
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