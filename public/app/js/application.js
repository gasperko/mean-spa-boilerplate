angular.module('MainApp', ['ngRoute', 'satellizer', 'ngCookies'])
    .config(["$routeProvider", "$locationProvider", "$authProvider", function($routeProvider, $locationProvider, $authProvider) {
        skipIfAuthenticated.$inject = ["$location", "$auth"];
        loginRequired.$inject = ["$location", "$auth"];
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
    }])
    .run(["$rootScope", "$window", "User", "$auth", function($rootScope, $window, User, $auth) {
        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }

        $rootScope.$on('user/logged', function(){
            console.info('on user/logged');
            User.setToken($auth.getToken());
        });

        if ($auth.isAuthenticated()) {
            $rootScope.$broadcast('user/logged');
        }
        
        console.debug(User, $auth.getToken());
    }]);
angular.module('MainApp')
	.controller('AppsCreateCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "App", function($scope, $rootScope, $location, $window, $auth, App) {
		
		$scope.buttonLabel = 'Create';

		$scope.submit = function() {

			App
				.create($scope.app)
				.then(function(r){
					console.log('r', r);
					if(r && r.data){
						// $location.path('/app/' + r.data.app.appId);
						App.goToDashboard(r.data.app.appId);
					}
				})
				.catch(function(response) {
					$scope.messages = {
						error: Array.isArray(response.data) ? response.data : [response.data]
					};
				});
		};

	}]);
angular.module('MainApp')
	.controller('AppsDetailCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "App", function($scope, $rootScope, $location, $window, $auth, App) {
		
		$scope.create = function() {

			App
				.create($scope.app)
				.then(function(r){
					console.log('r', r);
					if(r && r.data){
						$location.path('/apps/' + r.data.app.appId);
					}
				})
				.catch(function(response) {
					$scope.messages = {
						error: Array.isArray(response.data) ? response.data : [response.data]
					};
				});
		};
	}]);
angular.module('MainApp')
	.controller('AppsEditCtrl', ["$scope", "$rootScope", "$location", "$window", "$routeParams", "App", function($scope, $rootScope, $location, $window, $routeParams, App) {
		
		function init() {
			App
				.getData($routeParams.appId)
				.then(function(r) {
					console.info('r', r);
					if(r && r.data && r.data.app){
						$scope.app = r.data.app;
					}
				})
		}

		$scope.buttonLabel = 'Save';
		$scope.app = {};

		$scope.submit = function() {

			App
				.edit($routeParams.appId, $scope.app)
				.then(function(r){
					console.log('r', r);
					if(r && r.data){
						$location.path('/apps');
					}
				})
				.catch(function(response) {
					$scope.messages = {
						error: Array.isArray(response.data) ? response.data : [response.data]
					};
				});
		};

		init();
	}]);
angular.module('MainApp')
	.controller('AppsCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "$cookies", "App", function($scope, $rootScope, $location, $window, $auth, $cookies, App) {

		function init() {

			App
				.list()
				.then(function(r) {
					console.log('r', r);
					if (r && r.data && r.data.apps) {
						$scope.apps = r.data.apps;
					}
				});

		}

		$scope.profile = $rootScope.currentUser;
		$scope.apps = [];

		$scope.remove = function(app) {
			var sure = confirm('Do you want to remove?');
			if (sure) {
				App
					.delete(app.appId)
					.then(function(r) {
						var index = $scope.apps.indexOf(app);
						$scope.apps.splice(index, 1);
					});
			}
		};

		$scope.goToDashboard = function(app) {
			console.log('$scope.profile', $scope.profile);
			//$location.path('/' + app.appId + '/dashboard');
			// window.location.href = '/' + app.appId + '/dashboard';
			App.goToDashboard(app.appId);
		};

		init();

	}]);

angular.module('MainApp')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MainApp')
	.controller('DashboardCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "$routeParams", "App", function($scope, $rootScope, $location, $window, $auth, $routeParams, App) {

		function init() {

			App
				.getData($routeParams.appId)
				.then(function(r) {
					console.log('r', r);
					if (r && r.data && r.data.apps) {
						$scope.app = r.data.app;
					}
				});

		}

		$scope.profile = $rootScope.currentUser;
		$scope.app = [];

		$scope.remove = function(app) {
			var sure = confirm('Do you want to remove?');
			if (sure) {
				App
					.delete(app.appId)
					.then(function(r) {
						var index = $scope.app.indexOf(app);
						$scope.app.splice(index, 1);
					});
			}
		}

		init();

	}]);

angular.module('MainApp')
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MainApp')
    .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", "User", function($scope, $location, $window, $auth, User) {
        
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.logout = function() {
            $auth.logout();
            delete $window.localStorage.user;
            User.setToken('');
            $location.path('/');
        };
    }]);
angular.module('MainApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.$broadcast('user/logged');
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/account');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $rootScope.$broadcast('user/logged');
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('MainApp')
    .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", function($scope, $rootScope, $location, $window, $auth, Account) {
        $scope.profile = $rootScope.currentUser;

        $scope.updateProfile = function() {
            Account.updateProfile($scope.profile)
                .then(function(response) {
                    $rootScope.currentUser = response.data.user;
                    $window.localStorage.user = JSON.stringify(response.data.user);
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };

        $scope.changePassword = function() {
            Account.changePassword($scope.profile)
                .then(function(response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };

        $scope.link = function(provider) {
            $auth.link(provider)
                .then(function(response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function(response) {
                    $window.scrollTo(0, 0);
                    $scope.messages = {
                        error: [response.data]
                    };
                });
        };
        $scope.unlink = function(provider) {
            $auth.unlink(provider)
                .then(function() {
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: [response.data]
                    };
                });
        };

        $scope.deleteAccount = function() {
            Account.deleteAccount()
                .then(function() {
                    $auth.logout();
                    delete $window.localStorage.user;
                    $location.path('/');
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: [response.data]
                    };
                });
        };
    }]);
angular.module('MainApp')
  .controller('ResetCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.resetPassword = function() {
      Account.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  }]);

angular.module('MainApp')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.$broadcast('user/logged');
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $rootScope.$broadcast('user/logged');
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('MainApp')
  .factory('Account', ["$http", function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  }]);
angular.module('MainApp')
	.service('App', ["$http", function($http) {
		return {
			list: function() {
				return $http.get('/app/list');
			},
			create: function(data) {
				return $http.post('/app', data);
			},
			edit: function(id, data) {
				return $http.post('/app/edit/' + id, data);
			},
			delete: function(id) {
				return $http.delete(/app/ + id);
			},
			getData: function(id) {
				return $http.get('/app/data/' + id);
			},
			goToDashboard: function(id) {
				window.location.href = '/' + id + '/dashboard';
				return;
			}
			// ,
			// updateProfile: function(data) {
			// 	return $http.put('/account', data);
			// },
			// changePassword: function(data) {
			// 	return $http.put('/account', data);
			// },
			// deleteAccount: function() {
			// 	return $http.delete('/account');
			// },
			// forgotPassword: function(data) {
			// 	return $http.post('/forgot', data);
			// },
			// resetPassword: function(data) {
			// 	return $http.post('/reset', data);
			// }
		};
	}]);
angular.module('MainApp')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
angular.module('MainApp')
	.service('User', ["$http", "$window", "$cookies", function($http, $window, $cookies) {
		return {
			setToken: function(token) {
				return $cookies.put('token', token);
			}
		};
	}]);