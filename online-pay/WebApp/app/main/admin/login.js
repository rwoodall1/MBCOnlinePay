/// <reference path="school.js" />
'use strict';

angular.module('app')
.controller('LoginCtrl', ['$rootScope', '$scope', '$state', '$location', '$stateParams', 'InvoiceDataService', 'NotificationService',
    function ($rootScope, $scope, $state, $location,$stateParams, InvoiceDataService, NotificationService) {
       
        initialize();

        function initialize() {
         
            $scope.passWord = '';
            $scope.schoolCode=''
            $scope.loginFailed = false;
            $scope.login = login;
            $scope.loggingIn = false;
        }

        function login() {
            $scope.paycodeNotFound = false;
            $scope.loggingIn = true;
         
            InvoiceDataService.login($scope.schoolCode, $scope.passWord).then(function (response) {
                if (!response.isSuccessful) {
                    NotificationService.displayError('Login Failed');
                    $scope.loginFailed = true;
                    $scope.loggingIn = false;
                    return;
                }
         
                if (response.data) {
                    $scope.loggingIn = false;
                    $state.go('anon.administration', { invoicenumber: response.data.invno, schcode: response.data.schcode,schname:response.data.schname});
                    return false;
                } else {
                    $scope.loggingIn = false;
                    $scope.loginFailed = true;
                    NotificationService.displayError('Login Failed');
                }

                $scope.loggingIn = false; });
        }
    }
]);
