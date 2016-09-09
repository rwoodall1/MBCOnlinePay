'use strict';
agGrid.initialiseAgGridWithAngular1(angular);
angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.bootstrap.showErrors',
    //'ui.grid',
    //'ui.grid.edit',
    //'ui.grid.autoResize',
    'angular-loading-bar',
    'markdown',
    'ngAnimate',
    'ngSanitize',
    'ngFileUpload',
    'ngMaterial',
    'gettext',
    'ngStorage',
    'ngCart',
    'agGrid',
])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$compileProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $compileProvider, $mdThemingProvider) {
    //whitelist
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|secureimageupload|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }

    var TLBlueMap = $mdThemingProvider.extendPalette('blue', {
        'A200': '192c57'
    });
    $mdThemingProvider.definePalette('TLBlue', TLBlueMap);

    var TLPurpleMap = $mdThemingProvider.extendPalette('red', {
        '500': 'a63026'
    });
    $mdThemingProvider.definePalette('TLRed', TLPurpleMap);

    $mdThemingProvider.theme('default')
        .primaryPalette('TLRed')
        .accentPalette('TLBlue');

    // Anonymous routes
    $stateProvider
        .state('anon', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: null
            }
        })
        .state('anon.default', {
            url: '/',
            templateUrl: '/app/main/parent/parent.html',
            controller: 'ParentCtrl',
        })
        .state('anon.parent', {
            url: '/parent',
            templateUrl: '/app/main/parent/parent.html',
            controller: 'ParentCtrl',
        })
        .state('anon.parentpayment', {
            url: '/parent/payment',
            templateUrl: '/app/main/parent/payment/parentpayment.html',
            controller: 'ParentPaymentCtrl',
            params: {
                pcode: null          
            },
        })
        .state('anon.login', {
            url: '/login',
            templateUrl: '/app/main/admin/login.html',
            controller: 'LoginCtrl',
           
        })
         .state('anon.administration', {
             url: '/admin',
             templateUrl: '/app/main/admin/administration.html',
             controller: 'AdminCtrl',
             params: {
                 invoicenumber: null,
                 schcode: null,
                 schname:null
             },
         })
        .state('anon.school', {
            url: '/school',
            templateUrl: '/app/main/school/school.html',
            controller: 'SchoolCtrl',
        });
        

    //    $urlRouterProvider.otherwise('');

    // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
    $urlRouterProvider.rule(function ($injector, $location) {
        if ($location.protocol() === 'file')
            return;

        var path = $location.path()
        // Note: misnomer. This returns a query object, not a search string
            , search = $location.search()
            , params
        ;

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {
            return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {
            return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        params = [];
        angular.forEach(search, function (v, k) {
            params.push(k + '=' + v);
        });
        return path + '/?' + params.join('&');
    });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function ($injector, $q, $location) {
        return {
            response: function (response) {
              
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function (rejection) {
               
                if (rejection.status === 401) {
                    console.log("Response Error 401", rejection);

                    if (rejection.data == "Lost_Session") {
                       window.location.href = '/forceSessionLogout';
                    }
                    else {
                         window.location.href = '/forceLogout';
                    }
                 
                }
                return $q.reject(rejection);
            }
        };
    });
}])

.config(['showErrorsConfigProvider', function (showErrorsConfigProvider) {
    showErrorsConfigProvider.showSuccess(true);
}])

.run(['$rootScope', '$templateCache', '$state', 'globalConstants', 'NotificationService', 'UtilService', '$window','$location', function ($rootScope, $templateCache, $state, globalConstants, NotificationService, UtilService, $window,$location) {
  
    UtilService.setServerVars().then(function (response) {
        $rootScope.serverVars = response;
    });

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        $rootScope.$broadcast('removeErrorDisplay');
    });
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (typeof (current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
    });
}]);