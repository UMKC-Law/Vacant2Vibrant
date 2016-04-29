// File: chapter10/routing-example/app/scripts/services.js
angular.module('fifaApp')
    .factory('FifaService', ['$rootScope',
        function ($rootScope) {
            var organizations = [];
            var tags = [];
            var types = [];

            Array.prototype.filterObjects = function(key, value) {
                return this.filter(function(x) { return x[key] === value; })
            }


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

                                            tag = data[i].tags;

                                            if ( tag.length > 0 ) {
                                                parts = tag.split(';');

                                                for ( k = 0; k < parts.length; k++ ) {
                                                    part = parts[k].trim();
                                                    if ( '' == tags.filterObjects("text", part)) {
                                                        var obj = {};
                                                        obj['value'] = part;;
                                                        obj['text'] = part;
                                                        tags.push(obj);
                                                    }
                                                }
                                            }

                                            type = data[i].typeofentity;

                                            if ( type.length > 0 ) {

                                                if ( '' == types.filterObjects("text", type)) {
                                                    var obj = {};
                                                    obj['value'] = type;
                                                    obj['text'] = type;
                                                    types.push(obj);
                                                }
                                            }
                                        }
                                    }

                                    callback(organizations, tags, types);
                                });
                            }
                        }
                    });
                },
                getTeamDetails: function (code) {
                    return organizations[code];
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
