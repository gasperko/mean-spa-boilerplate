angular.module('DashboardApp')
	.controller('TriggersCtrl', function($scope, $rootScope, $log, $resource, $location, $window, $auth, $routeParams, $uibModal, UrlHelper, Error, NgTableParams, Trigger) {

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

	});