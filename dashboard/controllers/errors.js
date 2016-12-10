angular.module('DashboardApp')
	.controller('ErrorsCtrl', function($scope, $rootScope, $log, $resource, $location, $window, $auth, $routeParams, $uibModal, UrlHelper, Error, NgTableParams) {

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

	});
