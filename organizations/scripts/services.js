// File: chapter10/routing-example/app/scripts/services.js
angular.module('fifaApp')
    .factory('FifaService', ['$rootScope',
        function ($rootScope) {
            return {
                getTeams: function (callback) {
                    Tabletop.init({
                        key: '0AhPhtlCrkuIFdEQ0TzNsSUl0QmFMdmU3QUcxRlhJV1E',
                        simpleSheet: true,
                        parseNumbers: true,
                        callback: function (data, tabletop) {
                            if (callback && typeof(callback) === "function") {
                                $rootScope.$apply(function () {
                                    callback(data);
                                });
                            }
                        }
                    });
                },
                getTeamDetails: function (code) {
                    return $http.get('/api/team/' + code);
                }
            }
        }])
    .factory('UserService', ['$http', function ($http) {
        var service = {
            isLoggedIn: false,

            session: function () {
                return $http.get('/api/session')
                    .then(function (response) {
                        service.isLoggedIn = true;
                        return response;
                    });
            },

            login: function (user) {
                return $http.post('/api/login', user)
                    .then(function (response) {
                        service.isLoggedIn = true;
                        return response;
                    });
            }
        };
        return service;
    }]);
