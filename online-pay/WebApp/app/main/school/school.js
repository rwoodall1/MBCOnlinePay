/// <reference path="school.js" />
'use strict';

angular.module('app')
.controller('SchoolCtrl', ['$rootScope', '$scope', '$state', 'InvoiceDataService', '$location',
    function ($rootScope, $scope, $state, InvoiceDataService, $location) {

        initialize();
 function initialize() {
            $scope.application = {};
            $scope.lookupSchoolCode = lookupSchoolCode;
           
            $scope.schoolCodeNotFound = false;
            $scope.lookingUpPayCode = false;
            $scope.lookupSchoolCode = lookupSchoolCode;
           $scope.schoolCode="";
 }
 function setAllFormInputsToDirty() {
     for (var property in $scope.form) {
         if ($scope.form.hasOwnProperty(property)) {
             if (property.indexOf("$") == -1) {
                 $scope.form[property].$setDirty();
             }
         }
     }
 }
 function lookupSchoolCode(schoolCode) {
    
     $scope.lookingUpPayCode = true;
     InvoiceDataService.schoolExist(schoolCode).then(function (response) {
         if (!response.isSuccessful) {
             NotificationService.displayError(response.error.userMessage);
             $scope.lookingUpPayCode  = false;
             return;
         }
         console.log(response);
         console.log(response.data);
         var cust = response.data
         
         if (cust != null) {
             //send to paysite
             //$state.go('anon.parentpayment', { pcode: $scope.application.paycode });
             window.location("https://www.securepaymentportal.com/MBCSecure/mbcschool?schcode="+cust.schcode+"&schname="+cust.schname)

         } else {//mark school not found
              
                 $scope.schoolCodeNotFound = true;
                 $scope.lookingUpPayCode = false;
         }

        
     });

 }

//nothing below
    }]);

       

        


        
    
       
