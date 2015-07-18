'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/home.html'
            })
            .state('save', {
                url: '/save',
                templateUrl: 'templates/save.html'
            })
            .state('detail', {
                url: '/detail/:id',
                templateUrl: 'templates/home.html'
            });
    }
]);