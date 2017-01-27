angular.module('DashboardApp')
	.directive('appBadge', function() {
	
		function link(scope, elem, attrs) {

		}

		return {
			restrict: 'A',
			templateUrl: 'partials/app-badge.html',
			scope: {
				value: '='
			},
			link: link
		};

	});