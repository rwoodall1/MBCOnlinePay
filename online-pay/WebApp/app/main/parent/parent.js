/// <reference path="school.js" />
'use strict';

angular.module('app')
.controller('ParentCtrl', ['$rootScope', '$scope', '$state', '$location', 'InvoiceDataService', 'NotificationService',
    function ($rootScope, $scope, $state, $location, InvoiceDataService, NotificationService) {
       
        initialize();

        function initialize() {
          
            $scope.application = {};
            $scope.application.onlinePay = {};
            $scope.products = [];
            $scope.paycodeNotFound = false;
            $scope.lookingUpPayCode = false;
            $scope.lookupPayCode = lookupPayCode;
        }

        function lookupPayCode() {
            $scope.paycodeNotFound = false;
            $scope.lookingUpPayCode = true;
            if (typeof $scope.application.paycode == 'undefined') {
                $scope.paycodeNotFound = true;
                $scope.lookingUpPayCode = false;
                return;
            }
            InvoiceDataService.invoiceCodeExist($scope.application.paycode).then(function (response) {
                if (!response.isSuccessful) {
                    NotificationService.displayError('Unable to retrieve invoice code');
                    $scope.lookingUpPayCode = false;
                    return;
                }

                if(response.data){
                    $state.go('anon.parentpayment', { pcode: $scope.application.paycode });
                }else{
                    $scope.paycodeNotFound = true;
                }

                $scope.lookingUpPayCode = false;
            });
        }
    }
]);
