angular.module('MainApp', ['ngRoute', 'satellizer', 'ngCookies']);
angular.module('MainApp')
    .factory('Account', ["$http", "$window", "$cookies", "$auth", function($http, $window, $cookies, $auth) {
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
            resetPassword: function(token, data) {
                return $http.post('/reset/' + token, data);
            },
            logout: function() {
                delete $window.localStorage.user;
                $cookies.remove('currentAppId', {path: '/'});
                $cookies.remove('token', {path: '/'});
                $auth.logout();
            }

        };
    }]);
angular.module('DashboardApp', ['MainApp','ngRoute', 'ngResource', 'satellizer', 'ngCookies', 'ngTable', 'ui.bootstrap', 'angular-clipboard', 'ui.ace'])
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
    }])
    .run(["$rootScope", "$window", "$routeParams", "App", "Dashboard", function($rootScope, $window, $routeParams, App, Dashboard) {
        
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

		var self = this;
		var modalInstance;
		var Api = $resource(UrlHelper.buildUrl('/custom-events'));

		function CustomEventDetailViewModel(e) {

			var obj = {};
			
			obj._id = e._id;
			obj.eventName = e.eventName;
			obj.data = e.data;
			obj.createdAt = e.createdAt;
			obj._new = e._new;

			return obj;

		};

		function showDetails(event) {

			$scope.detailedEvent = new CustomEventDetailViewModel(event);

			modalInstance = $uibModal.open({
		      templateUrl: 'partials/custom-events.detail.html',
		      scope: $scope
		    });

		    event._new = false;

			CustomEvent
				.update(event._id)
				.then(fetchUnread);
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

			//self.selectedAll = !self.selectedAll;

			if(self.selectedAll){
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
			self.selectedAllPages = !self.selectedAllPages;
			
			if(self.selectedAllPages){
				selectAll();
				self.selectedAll = true;
			}else{
				clearSelection();
				self.selectedAll = false;
			}

		}

		function fetchUnread() {
			CustomEvent
				.stats()
				.then(function(r){
					if(r && r.data && r.data.hasOwnProperty('count')){
						$rootScope.stats.events = r.data.count || 0;
					}
				});
		}

		function bulkAction(action) {

			var data = [];

			function execute() {
				CustomEvent
					.bulk(action, data, self.selectedAllPages)
					.then(function(r) {
						
						console.log('error bulk', r);
						
						$scope.gridEvents.reload();

						self.selectedAll = false;
						self.selectedAllPages = false;
						clearSelection();
					});
			}

			// $scope.selecteds
			if($scope.selecteds.length){

				
				if(!self.selectedAllPages){
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

							self.selectedAll = false;
							self.selectedAllPages = false;
							clearSelection();

							fetchUnread();

							$scope.gridTotal = r.total;
							params.total(r.total); // recal. page nav controls
							var filtered = r.docs;
							return filtered;
						}
					});
	
				}
			});

		}

		$rootScope.stats = $rootScope.stats || {};
		
		$scope.profile = $rootScope.currentUser;
		$scope.globalSearchTerm = '';
		self.selectedAll = false;
		self.selectedAllPages = false;
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
	.controller('DashboardCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "$routeParams", "App", "Dashboard", function($scope, $rootScope, $location, $window, $auth, $routeParams, App, Dashboard) {

		function buildSnippet(app) {

			var textToCopy = '';

			textToCopy += "<script>\n";
			textToCopy += "\t(function(j, s, e, l, i, n, f, o) {\n";
			textToCopy += "\t\tj['JselObject'] = i;\n";
			textToCopy += "\t\tj[i] = j[i] || function() {\n";
			textToCopy += "\t\t    (j[i].q = j[i].q || []).push(arguments)\n";
			textToCopy += "\t\t},\n";
			textToCopy += "\t\tj[i].id = '" + app.appId + "',\n";
			textToCopy += "\t\tn = s.createElement(e),\n";
			textToCopy += "\t\tf = s.getElementsByTagName(e)[0];\n";
			textToCopy += "\t\tn.async = 1;\n";
			textToCopy += "\t\tn.src = l;\n";
			textToCopy += "\t\tf.parentNode.insertBefore(n, f)\n";
			textToCopy += "\t})(window, document, 'script', '//jsel.info/static/scripts/jsel.js', 'jsel');\n";
			textToCopy += "</script>\n";


			return textToCopy;

		}

		function init() {

			App
				.getCurrent()
				.then(function(r) {
					if (r && r.data && r.data.app) {
						$scope.app = r.data.app;
						$scope.textToCopy = buildSnippet($scope.app);
					}
				});

			Dashboard
				.stats()
				.then(function(r) {
					console.log('callback 2', r);
					if (r && r.data) {
						$rootScope.stats = r.data;
					}
				});
		}

		$scope.btnCopyText = 'Copy to clipboard';

		$scope.textToCopy = '';

		$scope.app = {};
		$rootScope.stats = {};

		$scope.success = function() {
			console.log('Copied!');
			$scope.btnCopyText = 'Copied!';
		};

		$scope.fail = function(err) {
			console.error('Error!', err);
			$scope.btnCopyText = 'Error!';
		};

		$scope.aceOption = {
			mode: 'html',
			useWrapMode: false,
			showGutter: false,
			theme: 'chrome',
			onLoad: function(_ace) {

				_ace.setReadOnly(true);
				_ace.setShowPrintMargin(false);
				_ace.setHighlightActiveLine(false);
				_ace.setBehavioursEnabled(false);
				_ace.setDisplayIndentGuides(false);
				
			}
		};

		init();

	}]);
angular.module('DashboardApp')
	.controller('ErrorsCtrl', ["$scope", "$rootScope", "$log", "$resource", "$location", "$window", "$auth", "$routeParams", "$uibModal", "UrlHelper", "Error", "NgTableParams", function($scope, $rootScope, $log, $resource, $location, $window, $auth, $routeParams, $uibModal, UrlHelper, Error, NgTableParams) {
		
		var self = this;

		var modalInstance;
		var Api = $resource(UrlHelper.buildUrl('/errors'));

		function ErrorViewModel(e) {

			var obj = e.data;
			
			obj._id = e._id;
			obj.os = e.ua.os.family;
			obj.browser = e.ua.family;
			obj.browserVersion = e.ua.major;
			obj.url = obj.locationObject.href;
			obj._new = e._new;
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


			error._new = false;

		    Error
				.update(error._id)
				.then(fetchUnread);

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

			//self.selectedAll = !self.selectedAll;

			if(self.selectedAll){
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
			self.selectedAllPages = !self.selectedAllPages;
			
			if(self.selectedAllPages){
				selectAll();
				self.selectedAll = true;
			}else{
				clearSelection();
				self.selectedAll = false;
			}

		}

		function fetchUnread() {
			Error
				.stats()
				.then(function(r){
					if(r && r.data && r.data.hasOwnProperty('count')){
						$rootScope.stats.errors = r.data.count || 0;
					}
				});
		}

		function bulkAction(action) {

			var data = [];

			function execute() {

				Error
					.bulk(action, data, self.selectedAllPages)
					.then(function(r) {
						
						console.log('error bulk', r);
						
						$scope.gridErrors.reload();

						self.selectedAll = false;
						self.selectedAllPages = false;
						clearSelection();

					});
			}

			// $scope.selecteds
			if($scope.selecteds.length){

				
				if(!self.selectedAllPages){
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

							self.selectedAll = false;
							self.selectedAllPages = false;
							clearSelection();

							fetchUnread();

							$scope.gridTotal = r.total;
							params.total(r.total); // recal. page nav controls
							var filteredErrors = filterErrors(r.docs);
							return filteredErrors;
						}
					});
					
				}
			});

		}

		$rootScope.stats = $rootScope.stats || {};

		$scope.profile = $rootScope.currentUser;
		$scope.globalSearchTerm = '';
		self.selectedAll = false;
		self.selectedAllPages = false;
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
    .controller('HeaderCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "$routeParams", "App", "$interval", "$timeout", "Dashboard", "Account", function($scope, $rootScope, $location, $window, $auth, $routeParams, App, $interval, $timeout, Dashboard, Account) {
        
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
angular.module('DashboardApp')
	.controller('TriggersCtrl', ["$scope", "$rootScope", "$log", "$resource", "$location", "$window", "$auth", "$routeParams", "$uibModal", "UrlHelper", "Error", "NgTableParams", "Trigger", function($scope, $rootScope, $log, $resource, $location, $window, $auth, $routeParams, $uibModal, UrlHelper, Error, NgTableParams, Trigger) {

		var self = this;

		var modalInstance;
		var Api = $resource(UrlHelper.buildUrl('/triggers'));

		function openCreate() {

			modalInstance = $uibModal.open({
				templateUrl: 'partials/triggers.save.html',
				controller: 'TriggersSaveCtrl',
				resolve: {
			        editModel: function () {
			          return null;
			        }
			      }
			});

			modalInstance.result.then(function() {
				$scope.grid.reload();
			}, function() {
				// $log.info('Modal dismissed at: ' + new Date());
			});

		}

		function showDetails(element) {

			$scope.detailedError = element;

			modalInstance = $uibModal.open({
				templateUrl: 'partials/triggers.save.html',
				controller: 'TriggersSaveCtrl',
				resolve: {
			        editModel: function () {
			          return element;
			        }
			      }
			});


			modalInstance.result.then(function() {
				$scope.grid.reload();
			}, function() {
				// $log.info('Modal dismissed at: ' + new Date());
			});

		}

		function remove(element) {

			var sure = confirm('Do you want to delete?');

			if (sure) {
				Trigger
					.delete(element._id)
					.then(function(r) {
						$scope.grid.reload();
					});
			}

		}

		function closeModal() {
			if (modalInstance) {
				modalInstance.close();
			}
		}

		function selectAll() {

			$scope.selecteds = [];

			angular.forEach($scope.grid.data, function(data) {
				data.isSelected = true;
				$scope.selecteds.push(data);
			});

		}

		function clearSelection() {

			$scope.selecteds = [];

			angular.forEach($scope.grid.data, function(data) {
				data.isSelected = false;
			});

		}

		function toggleAll() {

			//self.selectedAll = !self.selectedAll;

			if (self.selectedAll) {
				// seleciona todos
				$log.log('selectAll');
				selectAll();
			} else {
				// limpa seleção
				$log.log('clear selectAll');
				clearSelection();
			}

		}

		function toggleSelection(error) {

			if (error.isSelected) {
				// seleciona
				$scope.selecteds.push(error);
			} else {
				// limpa
				var index = $scope.selecteds.indexOf(error);
				$scope.selecteds.splice(index, 1);
			}

		}

		function toggleSelectAllPages($event) {

			$event.preventDefault();
			self.selectedAllPages = !self.selectedAllPages;

			if (self.selectedAllPages) {
				selectAll();
				self.selectedAll = true;
			} else {
				clearSelection();
				self.selectedAll = false;
			}

		}

		function bulkAction(action) {

			var data = [];

			function execute() {

				Error
					.bulk(action, data, self.selectedAllPages)
					.then(function(r) {

						console.log('error bulk', r);

						$scope.grid.reload();

						self.selectedAll = false;
						self.selectedAllPages = false;
						clearSelection();

					});
			}

			// $scope.selecteds
			if ($scope.selecteds.length) {


				if (!self.selectedAllPages) {
					angular.forEach($scope.selecteds, function(o) {
						data.push(o._id);
					});
				}

				if (action === 'delete') {
					var sure = confirm('Do you want delete the selected objects?');
					if (sure) {
						execute();
					}
				} else {
					execute();
				}

			} else {
				alert('Select one or more objects.')
			}

		}

		function init() {

			$scope.trigger = {};

			$scope.trigger.callback = "function(){\n var Trigger = new Function(); \nreturn {this: this.toString(),\nTrigger: Trigger}\n}";

			$scope.grid = new NgTableParams({}, {
				filterDelay: 300,
				getData: function(params) {

					console.info("params", params);

					//ajax request to api
					return Api.get(params.url()).$promise.then(function(r) {
						console.log('r', r);
						if (r) {

							self.selectedAll = false;
							self.selectedAllPages = false;
							clearSelection();

							$scope.gridTotal = r.total;
							params.total(r.total); // recal. page nav controls
							return r.docs;
						}
					});

				}
			});

		}

		$rootScope.stats = $rootScope.stats || {};

		$scope.profile = $rootScope.currentUser;
		$scope.globalSearchTerm = '';
		self.selectedAll = false;
		self.selectedAllPages = false;
		$scope.gridTotal = 0;
		$scope.selecteds = [];
		$scope.grid = [];
		$scope.detailedError = {};
		$scope.showDetails = showDetails;
		$scope.remove = remove;
		$scope.closeModal = closeModal;
		$scope.selectAll = selectAll;
		$scope.toggleSelection = toggleSelection;
		$scope.toggleSelectAllPages = toggleSelectAllPages;
		$scope.toggleAll = toggleAll;
		$scope.bulkAction = bulkAction;


		/////

		$scope.openCreate = openCreate;

		init();

		// Watcher for global search without button
		$scope.$watch('globalSearchTerm', function(newTerm, oldTerm) {

			$scope.grid.filter({
				_all: newTerm
			});

		}, true);

	}]);
angular.module('DashboardApp')
	.controller('TriggersSaveCtrl', ["$scope", "$rootScope", "$log", "$resource", "$location", "$window", "$auth", "$routeParams", "$uibModalInstance", "editModel", "UrlHelper", "Error", "NgTableParams", "Trigger", "$sce", function($scope, $rootScope, $log, $resource, $location, $window, $auth, $routeParams, $uibModalInstance, editModel, UrlHelper, Error, NgTableParams, Trigger, $sce) {

		var self = this;
		var aceMode = 'javascript';

		var baseCallbackDesc = '/*\n';
		baseCallbackDesc += 'global scope:\n';
		baseCallbackDesc += '\t@global {object} request(http request)\n';
		baseCallbackDesc += '\t@global {object} mailer(mail service)\n';
		baseCallbackDesc += '\n';
		baseCallbackDesc += 'callback function scope:\n';
		baseCallbackDesc += '\t@param {any} arg1(first argument of Event)\n';
		baseCallbackDesc += '\t@param {any} arg2(second argument of Event)\n';
		baseCallbackDesc += '\t...\n';
		baseCallbackDesc += '\t@param {any} argN(N argument of Event)\n';
		baseCallbackDesc += '*/\n';
		var baseCallback = baseCallbackDesc;
		baseCallback += 'function callback(arg1, arg2, argN) {\n';
		baseCallback += '\t // handle data\n';
		baseCallback += '}';

		function stripComments(stringIN) {
			var SLASH = '/';
			var BACK_SLASH = '\\';
			var STAR = '*';
			var DOUBLE_QUOTE = '"';
			var SINGLE_QUOTE = "'";
			var NEW_LINE = '\n';
			var CARRIAGE_RETURN = '\r';

			var string = stringIN;
			var length = string.length;
			var position = 0;
			var output = [];

			function getCurrentCharacter() {
				return string.charAt(position);
			}

			function getPreviousCharacter() {
				return string.charAt(position - 1);
			}

			function getNextCharacter() {
				return string.charAt(position + 1);
			}

			function add() {
				output.push(getCurrentCharacter());
			}

			function next() {
				position++;
			}

			function atEnd() {
				return position >= length;
			}

			function isEscaping() {
				if (getPreviousCharacter() == BACK_SLASH) {
					var caret = position - 1;
					var escaped = true;
					while (caret-- > 0) {
						if (string.charAt(caret) != BACK_SLASH) {
							return escaped;
						}
						escaped = !escaped;
					}
					return escaped;
				}
				return false;
			}

			function processSingleQuotedString() {
				if (getCurrentCharacter() == SINGLE_QUOTE) {
					add();
					next();
					while (!atEnd()) {
						if (getCurrentCharacter() == SINGLE_QUOTE && !isEscaping()) {
							return;
						}
						add();
						next();
					}
				}
			}

			function processDoubleQuotedString() {
				if (getCurrentCharacter() == DOUBLE_QUOTE) {
					add();
					next();
					while (!atEnd()) {
						if (getCurrentCharacter() == DOUBLE_QUOTE && !isEscaping()) {
							return;
						}
						add();
						next();
					}
				}
			}

			function processSingleLineComment() {
				if (getCurrentCharacter() == SLASH) {
					if (getNextCharacter() == SLASH) {
						next();
						while (!atEnd()) {
							next();
							if (getCurrentCharacter() == NEW_LINE || getCurrentCharacter() == CARRIAGE_RETURN) {
								return;
							}
						}
					}
				}
			}

			function processMultiLineComment() {
				if (getCurrentCharacter() == SLASH) {
					if (getNextCharacter() == STAR) {
						next();
						next();
						while (!atEnd()) {
							next();
							if (getCurrentCharacter() == STAR) {
								if (getNextCharacter() == SLASH) {
									next();
									next();
									return;
								}
							}
						}
					}
				}
			}

			function processRegularExpression() {
				if (getCurrentCharacter() == SLASH) {
					add();
					next();
					while (!atEnd()) {
						if (getCurrentCharacter() == SLASH && !isEscaping()) {
							return;
						}
						add();
						next();
					}
				}
			}

			while (!atEnd()) {
				processDoubleQuotedString();
				processSingleQuotedString();
				processSingleLineComment();
				processMultiLineComment();
				processRegularExpression();
				if (!atEnd()) {
					add();
					next();
				}
			}
			return output.join('');

		};

		function validateCallbackFuntion() {

			var r = false;

			try {

				var base = 'var window=null,console,document=null,angular=null,top=null,$=null,jQuery=null';

				var code = '(function(){';
				code += base;
				code += ';var $e=';
				code += $scope.trigger.callback;
				code += '; return $e;';
				code += '});';

				var ev = eval(code);
				console.log('ev', ev, ev(), typeof ev, typeof $e);
				console.log('eval', ev, ev());

				r = typeof ev === 'function' && typeof ev() === 'function';

			} catch (e) {

				r = false;
				console.log('error catch', e, e.toString());

			}

			return r;

		}

		function submit($form) {

			// TODO - melhorar tudo isso
			var req;
			$scope.callbackInvalid = false;
			$scope.canSave = true;

			$scope.validateCallbackError = 'Callback must be a <strong>function</strong>.';

			if (!$scope.canSave || !$scope.trigger.callback) {
				$scope.canSave = false;
				return;
			}

			if (!validateCallbackFuntion()) {
				$scope.callbackInvalid = true;
				return;
			}

			if (!!~$scope.trigger.callback.indexOf('console.')) {
				$scope.callbackInvalid = true;
				$scope.validateCallbackError = '<strong>console</strong> is not defined.';
				//$rootScope.$safeApply();
				return;
			}

			// remove comentários do código
			// $scope.trigger.callback = $scope.trigger.callback.replace(baseCallbackDesc, '');
			$scope.trigger.callback = stripComments($scope.trigger.callback);


			if (!$scope.isEdit) {
				req = Trigger.create($scope.trigger);
			} else {
				req = Trigger.update($scope.trigger._id, $scope.trigger);
			}

			req
				.then(function(r) {
					console.log('r', r);
					$scope.trigger = {};
					close();
				})
				.catch(function(response) {
					$scope.messages = {
						error: Array.isArray(response.data) ? response.data : [response.data]
					};
				});

		}

		function close() {
			$uibModalInstance.close();
		}

		function init() {
			console.log('editModel', editModel);
			if (editModel) {
				$scope.isEdit = true;
				$scope.trigger = editModel;
			} else {
				$scope.trigger = {
					enabled: true
				};

				$scope.trigger.callback = baseCallback;
			}
		}

		$scope.aceOption = {
			theme: 'chrome',
			mode: aceMode.toLowerCase(),
			onLoad: function(_ace) {

				_ace.setShowPrintMargin(false);

				_ace.getSession().on("changeAnnotation", function() {

					var annot = _ace.getSession().getAnnotations();

					console.log('annot', annot);

					$scope.canSave = true;
					$scope.callbackInvalid = false;

					angular.forEach(annot, function(a) {
						if (a.type === 'error') {
							$scope.canSave = false;
						}
					});

					$rootScope.$safeApply();

				});

			}
		};

		$scope.validateCallbackError = 'Callback must be a <strong>function</strong>.';
		$scope.canSave = true;
		$scope.submit = submit;
		$scope.close = close;

		init();

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
		
		function buildUrl(path) {
			path = path ? '/' + path : '';
			return UrlHelper.buildUrl('/custom-event' + path);
		}

		return {
			list: function() {
				var url = UrlHelper.buildUrl('/custom-events');
				return $http.get(url);
			},
			delete: function(id) {
				var url = buildUrl(id);
				return $http.delete(url);
			},
			update: function(id) {
				var url = buildUrl(id);
				return $http.put(url);
			},
			bulk: function(action, data, all) {
				var url = buildUrl('bulk');
				
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
			},
			stats: function() {
				var url = buildUrl('stats');
				return $http.get(url);
			}
		};
		
	}]);
angular.module('MainApp')
	.service('Dashboard', ["$http", "$window", "UrlHelper", function($http, $window, UrlHelper) {
		
		var requestCache = [];

		return {
			stats: function() {

				if(requestCache['stats']){
					return requestCache['stats'];
				}else{
					var url = UrlHelper.buildUrl('/stats');
					requestCache['stats'] = $http.get(url);
					requestCache['stats']
						.then(function(r){
							requestCache['stats'] = null;
							return r;
						})
					return requestCache['stats'];
				}
				
			}
		};
	}]);
angular.module('DashboardApp')
	.service('Error', ["$http", "$httpParamSerializer", "UrlHelper", function($http, $httpParamSerializer, UrlHelper) {
		
		function buildUrl(path) {
			path = path ? '/' + path : '';
			return UrlHelper.buildUrl('/error' + path);
		}

		return {
			list: function() {
				var url = UrlHelper.buildUrl('/errors');
				return $http.get(url);
			},
			delete: function(id) {
				var url = buildUrl(id);
				return $http.delete(url);
			},
			update: function(id) {
				var url = buildUrl(id);
				return $http.put(url);
			},
			bulk: function(action, data, all) {
				var url = buildUrl('bulk');
				
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
			},
			stats: function() {
				var url = buildUrl('stats');
				return $http.get(url);
			}
		};

	}]);
angular.module('DashboardApp')
	.service('Trigger', ["$http", "$httpParamSerializer", "UrlHelper", function($http, $httpParamSerializer, UrlHelper) {
		
		function buildUrl(path) {
			path = path ? '/' + path : '';
			return UrlHelper.buildUrl('/trigger' + path);
		}

		return {
			create: function(data) {
				var url = UrlHelper.buildUrl('/triggers');
				return $http.post(url, data);
			},
			list: function() {
				var url = UrlHelper.buildUrl('/triggers');
				return $http.get(url);
			},
			delete: function(id) {
				var url = buildUrl(id);
				return $http.delete(url);
			},
			update: function(id, data) {
				var url = buildUrl(id);
				return $http.put(url, data);
			},
			bulk: function(action, data, all) {
				var url = buildUrl('bulk');
				
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
			},
			stats: function() {
				var url = buildUrl('stats');
				return $http.get(url);
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
angular.module('DashboardApp')
	.directive('appBadge', function() {
	
		function link(scope, elem, attrs) {

		}

		return {
			restrict: 'A',
			templateUrl: 'partials/app-badge.html',
			scope: {
				value: '='
			},
			link: link
		};

	});