// File: chapter10/routing-example/app/scripts/services.js
angular.module('fifaApp')
  .factory('FifaService', ['$http',
    function($http) {
      return {
        getTeams: function() {
          var data =  $http.get('/api/team');
          console.dir(data);
          return data;
        },

        getTeamDetails: function(code) {
          return $http.get('/api/team/' + code);
        }
      }
  }])
  .factory('googleData', ['TableTop', function( TableTop ){
    Tabletop.then(function(ttdata){
          var data = ttdata[0];
          console.dir(data);
    });
  }])
  .factory('UserService', ['$http', function($http) {
    var service = {
      isLoggedIn: false,

      session: function() {
        return $http.get('/api/session')
              .then(function(response) {
          service.isLoggedIn = true;
          return response;
        });
      },

      login: function(user) {
        return $http.post('/api/login', user)
          .then(function(response) {
            service.isLoggedIn = true;
            return response;
        });
      }
    };
    return service;
  }]);
