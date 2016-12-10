angular.module('DashboardApp')
	.service('Error', function($http, $httpParamSerializer, UrlHelper) {
		
		return {
			list: function() {
				var url = UrlHelper.buildUrl('/errors');
				return $http.get(url);
			},
			delete: function(id) {
				var url = UrlHelper.buildUrl('/error/' + id);
				return $http.delete(url);
			},
			bulk: function(action, data, all) {
				var url = UrlHelper.buildUrl('/error/bulk');
				
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
			}
		};

	});