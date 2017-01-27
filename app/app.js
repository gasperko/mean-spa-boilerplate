angular.module('MainApp', ['ngRoute', 'satellizer', 'ngCookies'])
    .config(function($routeProvider, $locationProvider, $authProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html'
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl',
                resolve: {
                    skipIfAuthenticated: skipIfAuthenticated
                }
            })
            .when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'SignupCtrl',
                resolve: {
                    skipIfAuthenticated: skipIfAuthenticated
                }
            })
            .when('/account', {
                templateUrl: 'partials/profile.html',
                controller: 'ProfileCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when('/forgot', {
                templateUrl: 'partials/forgot.html',
                controller: 'ForgotCtrl',
                resolve: {
                    skipIfAuthenticated: skipIfAuthenticated
                }
            })
            .when('/reset/:token', {
                templateUrl: 'partials/reset.html',
                controller: 'ResetCtrl',
                resolve: {
                    skipIfAuthenticated: skipIfAuthenticated
                }
            })
            .when('/apps', {
                templateUrl: 'partials/apps.html',
                controller: 'AppsCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when('/apps/create', {
                templateUrl: 'partials/apps.create.html',
                controller: 'AppsCreateCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when('/apps/edit/:appId', {
                templateUrl: 'partials/apps.create.html',
                controller: 'AppsEditCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .when('/apps/:appId', {
                templateUrl: 'partials/apps.detail.html',
                controller: 'AppsDetailCtrl',
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
    .run(function($rootScope, $window, User, $auth) {
        
        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }

        $rootScope.$on('user/logged', function(){
            console.debug('user/logged');
            User.setToken($auth.getToken());
        });

        if ($auth.isAuthenticated()) {
            $rootScope.$broadcast('user/logged');
        }
        
    });