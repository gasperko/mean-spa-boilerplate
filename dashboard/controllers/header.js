angular.module('DashboardApp')
    .controller('HeaderCtrl', function($scope, $location, $window, $auth, $routeParams, App) {
        
        function init() {

            App
                .getCurrent()
                .then(function(r) {
                    console.log('r', r);
                    if (r && r.data && r.data.app) {
                        $scope.app = r.data.app;
                    }
                });

        }

        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.logout = function() {
            $auth.logout();
            delete $window.localStorage.user;
            $location.path('/');
        };

        $scope.app = {};

        init();

    });