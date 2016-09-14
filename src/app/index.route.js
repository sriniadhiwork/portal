(function() {
    'use strict';

    angular
        .module('portal')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'vm'
            })
            .when('/search', {
                templateUrl: 'app/search/search.html',
                controller: 'SearchController',
                controllerAs: 'vm'
            })
            .when('/review', {
                templateUrl: 'app/review/review.html',
                controller: 'ReviewController',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: 'app/about/about.html',
                controller: 'AboutController',
                controllerAs: 'vm'
            })
            .when('/resources', {
                templateUrl: 'app/resources/resources.html',
                controller: 'ResourcesController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

})();
