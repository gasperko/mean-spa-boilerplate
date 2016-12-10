angular.module('DashboardApp')
	.filter('AppDate', function($filter) {

		var angularDateFilter = $filter('date');
		
	    return function(theDate, format) {
	    	format = format || 'dd/MM/yy HH:mm';
	    	return angularDateFilter(theDate, format);
	    }

	});