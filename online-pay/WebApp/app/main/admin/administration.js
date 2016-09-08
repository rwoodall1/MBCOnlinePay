/// <reference path="school.js" />
'use strict';

angular.module('app')
.controller('AdminCtrl', ['$rootScope', '$scope', '$state','$stateParams', '$location', 'OrderDataService', 'NotificationService',
    function ($rootScope, $scope, $state,$stateParams, $location,OrderDataService, InvoiceDataService, NotificationService) {
       
        initialize();

        function initialize() {
          console.log($stateParams)
            $scope.schname = $stateParams.schname;
            $scope.schoolCode = $stateParams.schoolCode;
            $scope.invno = $stateParams.invoicenumber;
           
            $scope.getOrders = getOrders;
            $scope.loading = true;
            getOrders();
        }

        function getOrders() {

            OrderDataService.getOrders($scope.invno).then(function (response) {
                if (!response.isSuccessful) {
                    NotificationService.displayError('Order retrieval failed.');
                    $scope.loading = false;
                    return;
                };
                $scope.loading = false;
                console.log(response.data)

            });
        }





    }]);
