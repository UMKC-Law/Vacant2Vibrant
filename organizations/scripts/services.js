// File: chapter10/routing-example/app/scripts/services.js
angular.module('fifaApp')
    .factory('FifaService', ['$rootScope',
        function ($rootScope) {
            var organizations = [];
            return {

                getTeams: function (callback) {
                    Tabletop.init({
                        key: '1g6GIToW1Mhq83zVW4nJe4Y573v5MJOztqn3qvjwWX7s',
                        simpleSheet: true,
                        parseNumbers: true,
                        callback: function (data, tabletop) {
                            if (callback && typeof(callback) === "function") {
                                $rootScope.$apply(function () {

                                    for(var i=0; i < data.length; i++) {

                                        if ( data[i].organizationname.length > 0 ) {

                                            organizations[i] = data[i];
                                            organizations[i].id = i;
                                        }
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
