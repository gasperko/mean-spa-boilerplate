angular.module('MainApp')
    .controller('HeaderCtrl', function($scope, $location, $window, $auth, User, Account) {
        
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.logout = function() {
            Account.logout();
            $location.path('/');
        };
        
    });