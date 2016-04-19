// File: chapter10/routing-example/app/scripts/controllers.js
angular.module('fifaApp')
  .controller('MainCtrl', ['UserService',
    function(UserService) {
      var self = this;
      self.userService = UserService;

      // Check if the user is logged in when the application
      // loads
      // User Service will automatically update isLoggedIn
      // after this call finishes
      UserService.session();
  }])

  .controller('TeamListCtrl', ['Tabletop',
    function(Tabletop) {
      var self = this;
      self.teams = [];
      Tabletop.then(function(ttdata){
        var data = ttdata[0];
        for ( var i in data ) {
            self.teams[i] = [];
          self.teams[i]['code'] = i;
          self.teams[i]['name'] = data[i]['Organization Name'];
          self.teams[i]['rank'] =  10;
          self.teams[i]['flagUri'] = 'http://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg';

        }
       });
  }])

  .controller('xTeamListCtrl', ['FifaService',
    function(FifaService) {
      var self = this;
      self.teams = [];

      FifaService.getTeams().then(function(resp) {
        self.teams = resp.data;
      console.dir(self.teams);
      });
  }])

  .controller('LoginCtrl', ['UserService', '$location',
    function(UserService, $location) {
      var self = this;
      self.user = {username: '', password: ''};

      self.login = function() {
        UserService.login(self.user).then(function(success) {
          $location.path('/');
        }, function(error) {
          self.errorMessage = error.data.msg;
        })
      };
  }])

  .controller('TeamDetailsCtrl',
    ['$location', '$routeParams', 'FifaService',
    function($location, $routeParams, FifaService) {
      var self = this;
      self.team = {};
      FifaService.getTeamDetails($routeParams.code)
          .then(function(resp){
        self.team = resp.data;
      }, function(error){
        $location.path('/login');
      });
    }]);
