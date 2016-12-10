angular.module('DashboardApp')
	.controller('CustomEventsCtrl', function($scope, $rootScope, $resource, $location, $window, $auth, $log, $routeParams, $uibModal, UrlHelper, CustomEvent, NgTableParams) {

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


	});
