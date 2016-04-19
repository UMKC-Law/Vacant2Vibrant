// File: chapter10/routing-example/app/scripts/app.js
angular.module('fifaApp', ['ngRoute'])
    .config(function ($routeProvider) {

        $routeProvider.when('/', {
                templateUrl: 'views/team_list.html',
                controller: 'TeamListCtrl as teamListCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html'
            })
            .when('/team/:code', {
                templateUrl: 'views/team_details.html',
                controller: 'TeamDetailsCtrl as teamDetailsCtrl'
            });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    });
