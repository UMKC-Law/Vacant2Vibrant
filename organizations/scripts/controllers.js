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
            self.orgs = [];

            FifaService.getTeams(function (resp) {
                self.orgs = resp;

            });
        }])

    .filter('searchOrgs', function() {

        // Create the return function and set the required parameter as well as an optional paramater
        return function(input, str) {

            if ( str == undefined ) {           // If there is not input
                return input;
            }

            var out = [];

            var regex = new RegExp( str , "i");

            var lowerStr = str.toLowerCase();

            // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
            angular.forEach(input, function (org) {
                if ( org.name.toLowerCase().indexOf(lowerStr) != -1
                || org.organization.toLowerCase().indexOf(lowerStr) != -1
                || org.whatdotheydo.toLowerCase().indexOf(lowerStr) != -1) {
                    out.push(org)
                }

            });

            return out;
        }

    })

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

                if ( data.whatoverlapsexist.lenght < 1 ) {
                    data.whatoverlapsexist = 'paul';
                }
                self.org = data;

            }]);

