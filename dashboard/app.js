angular.module('DashboardApp', ['MainApp','ngRoute', 'ngResource', 'satellizer', 'ngCookies', 'ngTable', 'ui.bootstrap', 'angular-clipboard'])
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
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when('/custom-events', {
                templateUrl: 'partials/custom-events.html',
                controller: 'CustomEventsCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .otherwise({
                templateUrl: 'partials/404.html'
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
                $location.path('/login');
            }
        }
    })
    .run(function($rootScope, $window, $routeParams, App) {
        
        // console.info('$routeParams', $routeParams, App);
        
        // App
        //     .getData($routeParams.appId)
        //     .then(function(r) {
        //         console.log('r', r);
        //         if (r && r.data && r.data.apps) {
        //             $rootScope.currentApp= r.data.app;
        //         }
        //     });

        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }
    });