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

    .filter('searchOrgs', function () {

        // Create the return function and set the required parameter as well as an optional paramater
        return function (input, str, tag, type) {

            if (str == undefined
                && tag == undefined
                && type == undefined) {           // If there is not input
                return input;
            }

            var out = [];

            //      var regex = new RegExp( str , "i");

            var lowerStr = "";
            if (str != undefined) {
                lowerStr = str.toLowerCase();
            } else {
                lowerStr = '';
            }


            var lowerType = "";
            if (type != undefined) {
                lowerType = type.toLowerCase();
            } else {
                lowerType = "";
            }

            var lowerTag = "";
            if (tag != undefined) {
                lowerTag = tag.toLowerCase();
            } else {
                lowerTag = "";
            }

            if (lowerTag == 'na') {
                lowerTag = '';
            }

            // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
            angular.forEach(input, function (org) {

                var lower_type = org.typeofentity.toLowerCase();
                var lower_tag = org.tags.toLowerCase();

                var tag_matched = false;

                parts = lower_tag.split(';');
                for ( k = 0; k < parts.length; k++ ) {
                    part = parts[k].trim();
                    if ( lowerTag == part ) {
                        tag_matched = true;
                        break;
                    }
                }

                if (

                    ( lowerStr == ""
                    || (org.organizationname.toLowerCase().indexOf(lowerStr) != -1
                    || org.descriptionoforganizationorinitiative.toLowerCase().indexOf(lowerStr) != -1))

                    && ( lowerType == "" || lower_type == lowerType)

                    && ( lowerTag == "" || tag_matched)


                ) {
                    out.push(org);
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
                console.dir(data);

                if (data.whatoverlapsexist.lenght < 1) {
                    data.whatoverlapsexist = 'paul';
                }
                self.org = data;

            }]);

