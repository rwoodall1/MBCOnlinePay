/// <reference path="school.js" />
'use strict';

angular.module('app')
.controller('ParentPaymentCtrl', ['$rootScope', '$scope', '$state', '$location', '$stateParams', '$localStorage', 'InvoiceDataService', 'NotificationService', 'ngCart',
    function ($rootScope, $scope, $state, $location, $stateParams, $localStorage, InvoiceDataService, NotificationService, ngCart) {

        initialize();

        function checkForm() {
            
        }

        function initialize() {
            $scope.application = {};
            $scope.application.order = {};
            $scope.application.order.yearbookType = "Standard Yearbook";
            $scope.application.order.yearbookQuantity = 1;
            $scope.application.order.grade = "";
            $scope.application.order.teacher = "";
            $scope.application.order.icon1 = "";
            $scope.application.order.icon2 = "";
            $scope.application.order.icon3 = "";
            $scope.application.order.icon4 = "";
            $scope.application.cartid = Math.floor(Math.random() * (900000000 - 1000 + 1)) + 1000;
            $scope.checkForm = checkForm;

            $scope.gettingInitValues = false;

            if ($stateParams.pcode == null) {
                if (typeof $localStorage.paycode === 'undefined' || $localStorage.paycode == null || $localStorage.paycode == '') {
                    $state.go('anon.parent');
                }else{
                    $scope.application.paycode = $localStorage.paycode;
                }
                
            } else {
                $scope.application.paycode = $stateParams.pcode;
                $localStorage.paycode = $scope.application.paycode;
            }
            $scope.gettingInitValues = true;
            InvoiceDataService.invoiceInit($scope.application.paycode).then(function (response) {
                if (!response.isSuccessful) {
                    NotificationService.displayError(response.error.userMessage);
                    $scope.gettingInitValues = false;
                    return;
                }

                $scope.schoolname = response.data.schoolName;
                $scope.teachers = response.data.teachers;
                $scope.grades = response.data.grades;
                $scope.icons = response.data.icons;

                $scope.gettingInitValues = false;
            });

            $scope.$on('ngCart:itemAdded', function (event, args) {
                $scope.application.order = {};
                $scope.application.order.yearbookType = "Standard Yearbook";
                $scope.application.order.yearbookQuantity = 1;
                $scope.application.order.grade = "";
                $scope.application.order.teacher = "";
                $scope.application.order.icon1 = "";
                $scope.application.order.icon2 = "";
                $scope.application.order.icon3 = "";
                $scope.application.order.icon4 = "";
                $scope.application.cartid = Math.floor(Math.random() * (900000000 - 1000 + 1)) + 1000;
            });
        }

    }
]);
