angular.module('MainApp')
    .controller('ResetCtrl', function($scope, $routeParams, Account) {
        $scope.resetPassword = function() {
            Account.resetPassword($routeParams.token, $scope.user)
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
    });