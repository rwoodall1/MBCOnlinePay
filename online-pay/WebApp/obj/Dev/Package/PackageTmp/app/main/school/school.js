/// <reference path="school.js" />
'use strict';

angular.module('app')
.controller('SchoolCtrl', ['$rootScope', '$scope', '$state', '$location',
    function ($rootScope, $scope, $state, $location) {

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

            if ($scope.paycode == 12345) {
                $scope.lookingUpPayCode = false;
            } else {
                $scope.lookingUpPayCode = false;
                $scope.paycodeNotFound = true;
            }
        }
    }
]);
