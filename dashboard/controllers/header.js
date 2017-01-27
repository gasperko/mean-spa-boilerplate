angular.module('DashboardApp')
    .controller('HeaderCtrl', function($scope, $rootScope, $location, $window, $auth, $routeParams, App, $interval, $timeout, Dashboard, Account) {
        
        function fetchStats() {

            Dashboard
                .stats()
                .then(function(r) {
                    console.log('callback 1', r);
                    if(r && r.data){
                        $rootScope.stats = r.data;
                    }
                });

        }

        function init() {

            App
                .getCurrent()
                .then(function(r) {
                    console.log('r', r);
                    if (r && r.data && r.data.app) {
                        $scope.app = r.data.app;
                    }
                });

            fetchStats();

            $interval(fetchStats, 20000);

        }

        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.logout = function() {

            Account.logout();

            $timeout(function(){
                 window.location.replace('/');
            }, 300);

           
        };

        $scope.app = {};

        $rootScope.stats = $rootScope.stats || {};

        init();

    });