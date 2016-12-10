angular.module('DashboardApp')
	.service('CustomEvent', function($http, UrlHelper) {
		
		return {
			list: function() {
				var url = UrlHelper.buildUrl('/custom-events');
				return $http.get(url);
			},
			delete: function(id) {
				var url = UrlHelper.buildUrl('/custom-event/' + id);
				return $http.delete(url);
			},
			bulk: function(action, data, all) {
				var url = UrlHelper.buildUrl('/custom-event/bulk');
				
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
			}
		};
		
	});