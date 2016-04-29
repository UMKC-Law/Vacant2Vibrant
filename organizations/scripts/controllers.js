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
            self.tags = [];
            self.types = [];


            FifaService.getTeams(function (resp, tags, types) {
                self.orgs = resp;
                self.tags = tags;
                self.types = types;
            });

        }])

    .filter('searchOrgs', function() {

        // Create the return function and set the required parameter as well as an optional paramater
        return function(input, str, tag, type) {
console.log(str + "|" + tag + "|" + type + "|");
            if ( str == undefined
            && tag == undefined
            && type == undefined ) {           // If there is not input
                return input;
            }

            var out = [];

      //      var regex = new RegExp( str , "i");

            if ( str != undefined ) {
                var lowerStr = str.toLowerCase();
            }

            // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
            angular.forEach(input, function (org) {
                var hit = false;
                if ( str != undefined
                    && (org.organizationname.toLowerCase().indexOf(lowerStr) != -1
                    || org.descriptionoforganizationorinitiative.toLowerCase().indexOf(lowerStr) != -1)) {

                    hit=true;
                }

                if ( type != undefined && org.typeofentity.toLowerCase() == type.toLowerCase() ) {
                    hit = true;
                }

                if ( tag != undefined && org.tags.toLowerCase() == tag.toLowerCase()) {
                    hit = true;
                }

                console.log( "hit=|" + hit + "|");
                if (hit) {
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

