angular.module('MainApp')
  .factory('Contact', function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  });