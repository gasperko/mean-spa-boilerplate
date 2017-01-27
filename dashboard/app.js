angular.module('DashboardApp', ['MainApp','ngRoute', 'ngResource', 'satellizer', 'ngCookies', 'ngTable', 'ui.bootstrap', 'angular-clipboard', 'ui.ace'])
    .config(function($routeProvider, $locationProvider, $authProvider) {
        $locationProvider.html5Mode(false);

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'DashboardCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when('/errors', {
                templateUrl: 'partials/errors.html',
                controller: 'ErrorsCtrl',
                controllerAs: 'vm',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when('/custom-events', {
                templateUrl: 'partials/custom-events.html',
                controller: 'CustomEventsCtrl',
                controllerAs: 'vm',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when('/triggers', {
                templateUrl: 'partials/triggers.html',
                controller: 'TriggersCtrl',
                controllerAs: 'vm',
                resolve: {
                    loginRequired: loginRequired
                }
            });

        $authProvider.loginUrl = '/login';
        $authProvider.signupUrl = '/signup';

        function skipIfAuthenticated($location, $auth) {
            if ($auth.isAuthenticated()) {
                $location.path('/');
            }
        }

        function loginRequired($location, $auth) {
            if (!$auth.isAuthenticated()) {
                window.location.replace('/');
            }
        }
    })
    .run(function($rootScope, $window, $routeParams, App, Dashboard) {
        
        $rootScope.stats = {};

        $rootScope.$safeApply = function safeApply(operation) {
            var phase = this.$root.$$phase;
            if (phase !== '$apply' && phase !== '$digest') {
                this.$apply(operation);
                return;
            }

            if (operation && typeof operation === 'function'){
                operation();
            }
        };

        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }

        function init() {

             Dashboard
            .stats()
            .then(function(r) {
                console.log('callback 1', r);
                if(r && r.data){
                    $rootScope.stats = r.data;
                }
            });

        }

        init();       

    });