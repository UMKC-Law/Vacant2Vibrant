// File: chapter10/routing-example/app/scripts/services.js
angular.module('fifaApp')
    .factory('FifaService', ['$rootScope',
        function ($rootScope) {
            var organizations = [];
            return {

                getTeams: function (callback) {
                    Tabletop.init({
                        key: '0AhPhtlCrkuIFdEQ0TzNsSUl0QmFMdmU3QUcxRlhJV1E',
                        simpleSheet: true,
                        parseNumbers: true,
                        callback: function (data, tabletop) {
                            if (callback && typeof(callback) === "function") {
                                $rootScope.$apply(function () {
                                    for(var i=0; i < data.length; i++) {
                                        organizations[i] = {};
                                        organizations[i].rank = 10;
                                        organizations[i].flagURL = '';
                                        organizations[i].name = data[i].name;
                                        organizations[i].id = i;

                                    }
                                    callback(organizations);
                                });
                            }
                        }
                    });
                },
                getTeamDetails: function (code) {

                    return organizations[code];
                    // return $http.get('/api/team/' + code);
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
