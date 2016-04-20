// File: chapter10/routing-example/app/scripts/controllers.js
angular.module('fifaApp')
    .controller('MainCtrl', ['UserService',
        function (UserService) {
            var self = this;
            self.userService = UserService;

            // Check if the user is logged in when the application
            // loads
            // User Service will automatically update isLoggedIn
            // after this call finishes
            UserService.session();
        }])

    .controller('TeamListCtrl', ['FifaService',
        function (FifaService) {
            var self = this;
            self.teams = [];

            FifaService.getTeams(function (resp) {
                self.teams = resp;
            });
        }])

    .controller('LoginCtrl', ['UserService', '$location',
        function (UserService, $location) {
            var self = this;
            self.user = {username: '', password: ''};

            self.login = function () {
                UserService.login(self.user).then(function (success) {
                    $location.path('/');
                }, function (error) {
                    self.errorMessage = error.data.msg;
                })
            };
        }])

    .controller('TeamDetailsCtrl',
        ['$location', '$routeParams', 'FifaService',
            function ($location, $routeParams, FifaService) {
                var self = this;
                self.team = {};
                data = FifaService.getTeamDetails($routeParams.code);
                console.dir( data);
                self.team = data;

            }]);
