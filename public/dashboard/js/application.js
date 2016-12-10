angular.module('MainApp', ['ngRoute', 'satellizer', 'ngCookies']);
angular.module('DashboardApp', ['MainApp','ngRoute', 'ngResource', 'satellizer', 'ngCookies', 'ngTable', 'ui.bootstrap', 'angular-clipboard'])
    .config(["$routeProvider", "$locationProvider", "$authProvider", function($routeProvider, $locationProvider, $authProvider) {
        loginRequired.$inject = ["$location", "$auth"];
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
    }])
    .run(["$rootScope", "$window", "$routeParams", "App", function($rootScope, $window, $routeParams, App) {
        
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
						$location.path('/app/' + r.data.app.appId);
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
		}

		$scope.goToDashboard = function(app) {
			console.log('$scope.profile', $scope.profile);
			var token = $window.localStorage.satellizer_token
			if(token){
				$cookies.put('token', token);
				console.log('token', token, $cookies.get('token'));
				$location.path('/' + app.appId + '/dashboard');
			}
		}

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

angular.module('DashboardApp')
	.controller('CustomEventsCtrl', ["$scope", "$rootScope", "$resource", "$location", "$window", "$auth", "$log", "$routeParams", "$uibModal", "UrlHelper", "CustomEvent", "NgTableParams", function($scope, $rootScope, $resource, $location, $window, $auth, $log, $routeParams, $uibModal, UrlHelper, CustomEvent, NgTableParams) {

		var modalInstance;
		var Api = $resource(UrlHelper.buildUrl('/custom-events'));

		function CustomEventDetailViewModel(e) {

			var obj = e;
			
			obj._id = e._id;
			obj.eventName = e.eventName;
			obj.data = e.data;
			obj.createdAt = e.createdAt;

			return obj;

		};

		function showDetails(event) {

			$scope.detailedEvent = new CustomEventDetailViewModel(event);

			modalInstance = $uibModal.open({
		      templateUrl: 'partials/custom-events.detail.html',
		      scope: $scope
		    });

		}

		function remove(event) {

			var sure = confirm('Do you want to remove?');

			if (sure) {
				CustomEvent
					.delete(event._id)
					.then(function(r) {
						// var index = $scope.app.indexOf(app);
						// $scope.app.splice(index, 1);
						$scope.gridEvents.reload();
					});
			}

		}

		function closeModal() {
			if(modalInstance){
				modalInstance.close();
			}
		}

		function selectAll() {			
			$scope.selecteds = [];

			angular.forEach($scope.gridEvents.data, function(data) {
				data.isSelected = true;
				$scope.selecteds.push(data);
			});

		}

		function clearSelection() {
			
			$scope.selecteds = [];

			angular.forEach($scope.gridEvents.data, function(data) {
				data.isSelected = false;
			});

		}

		function toggleAll(){

			$scope.selectedAll = !$scope.selectedAll;

			if($scope.selectedAll){
				// seleciona todos
				$log.log('selectAll');
				selectAll();
			}else{
				// limpa seleção
				$log.log('clear selectAll');
				clearSelection();
			}

		}

		function toggleSelection(error){

			if(error.isSelected){
				// seleciona
				$scope.selecteds.push(error);
			}else{
				// limpa
				var index = $scope.selecteds.indexOf(error);
  				$scope.selecteds.splice(index, 1);  
			}

		}

		function toggleSelectAllPages($event){

			$event.preventDefault();
			$scope.selectedAllPages = !$scope.selectedAllPages;
			
			if($scope.selectedAllPages){
				selectAll();
				$scope.selectedAll = true;
			}else{
				clearSelection();
				$scope.selectedAll = false;
			}

		}

		function bulkAction(action) {

			var data = [];

			function execute() {
				CustomEvent
					.bulk(action, data, $scope.selectedAllPages)
					.then(function(r) {
						
						console.log('error bulk', r);
						
						$scope.gridEvents.reload();

					});
			}

			// $scope.selecteds
			if($scope.selecteds.length){

				
				if(!$scope.selectedAllPages){
					angular.forEach($scope.selecteds, function(o) {
						data.push(o._id);
					});
				}

				if(action === 'delete'){
					var sure = confirm('Do you want delete the selected objects?');
					if(sure){
						execute();
					}
				}else{
					execute();
				}

			}else{
				alert('Select one or more objects.')
			}

		}

		function init() {

			$scope.gridEvents = new NgTableParams({}, {
				filterDelay: 300,
				getData: function(params) {

					console.info("params", params);
					
					//ajax request to api
					return Api.get(params.url()).$promise.then(function(r) {
						console.log('r', r);
						// if (r && r.data && r.data.errors) {
						if (r) {
							$scope.gridTotal = r.total;
							params.total(r.total); // recal. page nav controls
							var filtered = r.docs;
							return filtered;
						}
					});
	
				}
			});

		}

		$scope.profile = $rootScope.currentUser;
		$scope.globalSearchTerm = '';
		$scope.selectedAll = false;
		$scope.selectedAllPages = false;
		$scope.gridTotal = 0;
		$scope.selecteds = [];
		$scope.gridEvents = [];
		$scope.detailedEvent = {};
		$scope.showDetails = showDetails;
		$scope.remove = remove;
		$scope.closeModal = closeModal;
		$scope.selectAll = selectAll;
		$scope.toggleSelection = toggleSelection;
		$scope.toggleSelectAllPages = toggleSelectAllPages;
		$scope.toggleAll = toggleAll;
		$scope.bulkAction = bulkAction;

		init();

		// Watcher for global search without button
		$scope.$watch('globalSearchTerm', function(newTerm, oldTerm) {

			$scope.gridEvents.filter({
				_all: newTerm
			});

		}, true);


	}]);

angular.module('DashboardApp')
	.controller('DashboardCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "$routeParams", "App", function($scope, $rootScope, $location, $window, $auth, $routeParams, App) {

		function buildSnippet(app) {

			$scope.textToCopy = "(function(j, s, e, l, i, n, f, o) {\n";
			$scope.textToCopy += "j['JselObject'] = i;\n";
			$scope.textToCopy += "j[i] = j[i] || function() {\n";
			$scope.textToCopy += "    (j[i].q = j[i].q || []).push(arguments)\n";
			$scope.textToCopy += "},\n";
			$scope.textToCopy += "j[i].id = '" + app.appId +"',\n";
			$scope.textToCopy += "n = s.createElement(e),\n";
			$scope.textToCopy += "f = s.getElementsByTagName(e)[0];\n";
			$scope.textToCopy += "n.async = 1;\n";
			$scope.textToCopy += "n.src = l;\n";
			$scope.textToCopy += "f.parentNode.insertBefore(n, f)\n";
			$scope.textToCopy += "})(window, document, 'script', 'http://jsel.info/static/scripts/jsel.js', 'jsel');";
			
		}

		function init() {

			App
                .getCurrent()
                .then(function(r) {
                    if (r && r.data && r.data.app) {
                        $scope.app = r.data.app;
                        buildSnippet($scope.app);
                    }
                });

		}

		$scope.btnCopyText = 'Copy to clipboard';

		$scope.textToCopy = '';

		$scope.app = {};

		$scope.success = function () {
            console.log('Copied!');
            $scope.btnCopyText = 'Copied!';
        };

        $scope.fail = function (err) {
            console.error('Error!', err);
            $scope.btnCopyText = 'Error!';
        };

		init();

	}]);

angular.module('DashboardApp')
	.controller('ErrorsCtrl', ["$scope", "$rootScope", "$log", "$resource", "$location", "$window", "$auth", "$routeParams", "$uibModal", "UrlHelper", "Error", "NgTableParams", function($scope, $rootScope, $log, $resource, $location, $window, $auth, $routeParams, $uibModal, UrlHelper, Error, NgTableParams) {

		var modalInstance;
		var Api = $resource(UrlHelper.buildUrl('/errors'));

		function ErrorViewModel(e) {

			var obj = e.data;
			
			obj._id = e._id;
			obj.os = e.ua.os.family;
			obj.browser = e.ua.family;
			obj.browserVersion = e.ua.major;
			obj.url = obj.locationObject.href;
			//obj.url = '';

			return obj;

		}

		function filterErrors(errors) {

			var filtered = [];

			angular.forEach(errors, function(e) {
				filtered.push(new ErrorViewModel(e));
			});

			//return new NgTableParams({}, { dataset: filtered});

			return filtered;

		}

		function showDetails(error) {

			$scope.detailedError = error;

			modalInstance = $uibModal.open({
		      templateUrl: 'partials/errors.detail.html',
		      scope: $scope
		    });

		}

		function remove(error) {

			var sure = confirm('Do you want to delete?');

			if (sure) {
				Error
					.delete(error._id)
					.then(function(r) {
						// var index = $scope.app.indexOf(app);
						// $scope.app.splice(index, 1);
						$scope.gridErrors.reload();
					});
			}

		}

		function closeModal() {
			if(modalInstance){
				modalInstance.close();
			}
		}

		function selectAll() {
			console.info('$scope.gridErrors', $scope.gridErrors);
			
			$scope.selecteds = [];

			angular.forEach($scope.gridErrors.data, function(data) {
				data.isSelected = true;
				$scope.selecteds.push(data);
			});

		}

		function clearSelection() {
			
			$scope.selecteds = [];

			angular.forEach($scope.gridErrors.data, function(data) {
				data.isSelected = false;
			});

		}

		function toggleAll(){

			$scope.selectedAll = !$scope.selectedAll;

			if($scope.selectedAll){
				// seleciona todos
				$log.log('selectAll');
				selectAll();
			}else{
				// limpa seleção
				$log.log('clear selectAll');
				clearSelection();
			}

		}

		function toggleSelection(error){

			if(error.isSelected){
				// seleciona
				$scope.selecteds.push(error);
			}else{
				// limpa
				var index = $scope.selecteds.indexOf(error);
  				$scope.selecteds.splice(index, 1);  
			}

		}

		function toggleSelectAllPages($event){

			$event.preventDefault();
			$scope.selectedAllPages = !$scope.selectedAllPages;
			
			if($scope.selectedAllPages){
				selectAll();
				$scope.selectedAll = true;
			}else{
				clearSelection();
				$scope.selectedAll = false;
			}

		}

		function bulkAction(action) {

			var data = [];

			function execute() {
				Error
					.bulk(action, data, $scope.selectedAllPages)
					.then(function(r) {
						
						console.log('error bulk', r);
						
						$scope.gridErrors.reload();

					});
			}

			// $scope.selecteds
			if($scope.selecteds.length){

				
				if(!$scope.selectedAllPages){
					angular.forEach($scope.selecteds, function(o) {
						data.push(o._id);
					});
				}

				if(action === 'delete'){
					var sure = confirm('Do you want delete the selected objects?');
					if(sure){
						execute();
					}
				}else{
					execute();
				}

			}else{
				alert('Select one or more objects.')
			}

		}

		function init() {

			// Error
			// 	.list($routeParams.appId)
			// 	.then(function(r) {
			// 		console.log('r', r);
			// 		if (r && r.data && r.data.errors) {
			// 			$scope.errors = r.data.errors;
			// 		}
			// 	});

			$scope.gridErrors = new NgTableParams({}, {
				filterDelay: 300,
				getData: function(params) {

					console.info("params", params);
					
					//ajax request to api
					return Api.get(params.url()).$promise.then(function(r) {
						console.log('r', r);
						// if (r && r.data && r.data.errors) {
						if (r) {
							$scope.gridTotal = r.total;
							params.total(r.total); // recal. page nav controls
							var filteredErrors = filterErrors(r.docs);
							return filteredErrors;
						}
					});
					
				}
			});

		}

		$scope.profile = $rootScope.currentUser;
		$scope.globalSearchTerm = '';
		$scope.selectedAll = false;
		$scope.selectedAllPages = false;
		$scope.gridTotal = 0;
		$scope.selecteds = [];
		$scope.gridErrors = [];
		$scope.detailedError = {};
		$scope.showDetails = showDetails;
		$scope.remove = remove;
		$scope.closeModal = closeModal;
		$scope.selectAll = selectAll;
		$scope.toggleSelection = toggleSelection;
		$scope.toggleSelectAllPages = toggleSelectAllPages;
		$scope.toggleAll = toggleAll;
		$scope.bulkAction = bulkAction;

		init();

		// Watcher for global search without button
		$scope.$watch('globalSearchTerm', function(newTerm, oldTerm) {

			$scope.gridErrors.filter({
				_all: newTerm
			});

		}, true);

	}]);

angular.module('DashboardApp')
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

angular.module('DashboardApp')
    .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", "$routeParams", "App", function($scope, $location, $window, $auth, $routeParams, App) {
        
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

    }]);
angular.module('DashboardApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
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
angular.module('DashboardApp')
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
angular.module('DashboardApp')
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

angular.module('DashboardApp')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
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
	.service('App', ["$http", "$window", "$q", "$cookies", function($http, $window, $q, $cookies) {
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
			getCurrent: function() {
				var currentAppID = $cookies.get('currentAppId');

				var deferred = $q.defer();

				if(currentAppID){

					var currentApp = $window.localStorage['app_' + currentAppID];
					if(currentApp){
						currentApp = JSON.parse(currentApp);
						deferred.resolve({
							data: {
								app: currentApp
							}
						});
					}else{

						return this
								.getData(currentAppID)
								.then(function(r){
									if(r && r.data){
										var app = r.data.app;
										$window.localStorage['app_' + app.appId ] = JSON.stringify(app);
									}
									return r;
								})
					}
					
				}else {
					
					deferred.reject();
				}
				
				return deferred.promise;

			}
		};
	}]);
angular.module('DashboardApp')
	.service('CustomEvent', ["$http", "UrlHelper", function($http, UrlHelper) {
		
		return {
			list: function() {
				var url = UrlHelper.buildUrl('/custom-events');
				return $http.get(url);
			},
			delete: function(id) {
				var url = UrlHelper.buildUrl('/custom-event/' + id);
				return $http.delete(url);
			},
			bulk: function(action, data, all) {
				var url = UrlHelper.buildUrl('/custom-event/bulk');
				
				var params = {
					action: action,
					data: data
				};

				if(!!all){
					params.all = true;
				}
								
				return $http({
					url: url,
					method: 'GET',
					params: params,
					paramSerializer: '$httpParamSerializerJQLike'
				});
			}
		};
		
	}]);
angular.module('DashboardApp')
	.service('Error', ["$http", "$httpParamSerializer", "UrlHelper", function($http, $httpParamSerializer, UrlHelper) {
		
		return {
			list: function() {
				var url = UrlHelper.buildUrl('/errors');
				return $http.get(url);
			},
			delete: function(id) {
				var url = UrlHelper.buildUrl('/error/' + id);
				return $http.delete(url);
			},
			bulk: function(action, data, all) {
				var url = UrlHelper.buildUrl('/error/bulk');
				
				var params = {
					action: action,
					data: data
				};

				if(!!all){
					params.all = true;
				}
								
				console.log('params', params);

				return $http({
					url: url,
					method: 'GET',
					params: params,
					paramSerializer: '$httpParamSerializerJQLike'
				});
			}
		};

	}]);
angular.module('DashboardApp')
	.service('UrlHelper', ["$http", "$window", "$q", "$cookies", function($http, $window, $q, $cookies) {
		
		var currentAppID = $cookies.get('currentAppId');

		return {
			buildUrl: function(path) {
				return '/' + currentAppID + '/dashboard' + path;
			}
		};
	}]);
angular.module('DashboardApp')
	.filter('AppDate', ["$filter", function($filter) {

		var angularDateFilter = $filter('date');
		
	    return function(theDate, format) {
	    	format = format || 'dd/MM/yy HH:mm';
	    	return angularDateFilter(theDate, format);
	    }

	}]);