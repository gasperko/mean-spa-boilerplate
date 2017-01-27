angular.module('MainApp')
    .factory('Account', function($http, $window, $cookies, $auth) {
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
    });