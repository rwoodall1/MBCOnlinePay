/// <reference path="school.js" />
'use strict';

angular.module('app')
.controller('ParentPaymentCtrl', ['$rootScope', '$scope', '$state', '$location', '$stateParams', '$localStorage', 'InvoiceDataService','OrderDataService', 'NotificationService', 'ngCart',
    function ($rootScope, $scope, $state, $location, $stateParams, $localStorage, InvoiceDataService,OrderDataService, NotificationService, ngCart) {

        initialize();
        function initialize() {
            $scope.dupOrder = false;
            $scope.dupOrderByPass = false;
            $scope.test = test;
            $scope.application = {};
            $scope.application.order = {};
            $scope.application.order.yearbookType = "Standard Yearbook";
            $scope.application.order.yearbookQuantity = 1;
            $scope.application.order.studentFirstName = '';
            $scope.application.order.studentLastName = '';
            $scope.application.order.grade = "";
            $scope.application.order.teacher = "";
            $scope.application.order.icon1 = "";
            $scope.application.order.icon2 = "";
            $scope.application.order.icon3 = "";
            $scope.application.order.icon4 = "";
            $scope.application.order.parentpayment = true;
            $scope.application.order.year = new Date().getFullYear();
            $scope.application.cartid = Math.floor(Math.random() * (900000000 - 1000 + 1)) + 1000;
            $scope.checkForm = checkForm;
            $scope.checkedout = false;
            $scope.init = {};
            $scope.currentDate = new Date();
            $scope.pastCutOffDate = false;
            $scope.gettingInitValues = false;
            $scope.availableYearbookTypes = ['Standard Yearbook'];
            $scope.availableAdTypes = [];
            $scope.cartObj = {};
            $scope.teachers = {};
            $scope.grades = {};
            $scope.basePrice = 0;
            $scope.application.order.iconAmt = 0;
            $scope.setPrice = setPrice;
            $scope.addIcon = addIcon;
            $scope.checkingout = false;
            $scope.neworderid = "";
            $scope.defaultgrades = [{ grade: 'Kindergarten' },
                { grade: '1' },
                { grade: '2' },
                { grade: '3' },
                { grade: '4' },
                { grade: '5' },
                { grade: '6' },
                { grade: '7' },
                { grade: '8' },
                { grade: '9' },
                { grade: '10' },
                { grade: '11' },
                { grade: '12' }]
            $scope.textProofRead ={value:false};
            $scope.proofReadLoveLine = { value: false };
            $scope.proofReadAd = { value: false };
            if ($stateParams.pcode == null) {
                if (typeof $localStorage.paycode === 'undefined' || $localStorage.paycode == null || $localStorage.paycode == '') {
                    $state.go('anon.parent');
                }else{
                    $scope.application.order.paycode = $localStorage.paycode;
                    $scope.application.order.invoicenumber = $scope.application.paycode;
                }
                
            } else {

                $scope.application.order.paycode = $stateParams.pcode;
                $scope.application.order.invoicenumber = $stateParams.pcode;
                $localStorage.paycode = $scope.application.paycode;
            }
            $scope.gettingInitValues = true;
            InvoiceDataService.invoiceInit($scope.application.order.paycode).then(function (response) {
                if (!response.isSuccessful) {
                    NotificationService.displayError(response.error.userMessage);
                    $scope.gettingInitValues = false;
                    return;
                }
                console.log(response.data)
                $scope.schoolname = response.data.schoolname;
                $scope.application.order.schoolcode = $scope.schoolcode;
                $scope.application.order.schoolname = $scope.schoolname;
                $scope.teachers = response.data.teachers;
                
                $scope.grades = response.data.grades;
               
                $scope.icons = response.data.icons;
                $scope.init = response.data;
                $scope.application.order.schCode = $scope.init.schCode;
                $scope.validate = validate;
                //console.log($scope.init);
                // var cutOffDate = new Date($scope.init.onlineCuto);
                console.log($scope.init.onlineCuto)
                var cutOffDate = addDays(new Date($scope.init.onlineCuto), 1);
                 console.log(cutOffDate +' cutoff')
                console.log($scope.currentDate +' current')
               
                $scope.pastCutOffDate = $scope.currentDate > cutOffDate;

   
                if ($scope.init.foilPers == "1") { $scope.availableYearbookTypes.push("Personalized Foil Yearbook");}
                if ($scope.init.foilTxt == "1") { $scope.availableYearbookTypes.push("Personalized Foil Text"); }
                if ($scope.init.inkPers == "1") { $scope.availableYearbookTypes.push("Personalized Ink Yearbook");}
                if ($scope.init.inkText == "1") { $scope.availableYearbookTypes.push("Personalized Ink Text"); }
                if ($scope.init.picPers == "1") { $scope.availableYearbookTypes.push("Personalized Picture Yearbook"); }
                if ($scope.init.luvLines == "1") { $scope.availableYearbookTypes.push("Love Line"); }

                if ($scope.init.adLine == "1") {
                    $scope.availableYearbookTypes.push("Ad");
                    if ($scope.init.fullAdlineAmt > 0) { $scope.availableAdTypes.push("Full Page Ad"); }
                    if ($scope.init.halfAdlineAmt > 0) { $scope.availableAdTypes.push("1/2 Page Ad"); }
                    if ($scope.init.quaterAdlineAmt > 0) { $scope.availableAdTypes.push("1/4 Page Ad"); }
                    if ($scope.init.eightAdlineAmt > 0) { $scope.availableAdTypes.push("1/8 Page Ad"); }
                }
                setPrice();

                $scope.gettingInitValues = false;
            });

            $scope.$on('ngCart:itemAdded', function (event, args) {
                $scope.application.order.lovelinetext = "";
                $scope.application.order.adType = "";
                $scope.application.order.personalizedText = "";
                $scope.application.order.icon1 = "";
                $scope.application.order.icon2 = "";
                $scope.application.order.icon3 = "";
                $scope.application.order.icon4 = "";
                $scope.application.cartid = Math.floor(Math.random() * (900000000 - 1000 + 1)) + 1000;
            });

            $scope.$on('ngCart:checkout_succeeded', function (event, args) {
            
                setAllFormInputsToDirty();
               
                    $scope.neworderid = args.data;
                    $localStorage.$reset();
                    $scope.checkedout = true;
                    //document.getElementById('extnForm').action = 'https://www.securepaymentportal.com/mbc?orderid=' + $scope.neworderid;
                    document.getElementById('extnForm').action = 'https://www.securepaymentportal.com/MBCSecure/MbcPayment.aspx?orderid=' + $scope.neworderid;
                    document.getElementById('extnForm').submit();
                
            });
        }
        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
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
        function test() {
            $scope.ngCart = ngCart
          $scope.ngCart.addItem(id, name, price, q, data)
        }
        function checkForm() {
            
          
            setAllFormInputsToDirty();
       
            angular.copy($scope.application.order, $scope.cartObj);
          
            $scope.basePrice = $scope.basePrice - $scope.application.order.iconAmt;
          
                  $scope.application.order.iconAmt = 0;
               
             
        }
        function checkForDuplicateOrder(){
            var dupchkdata = { StudentFname: $scope.application.order.studentFirstName, StudentLname: $scope.application.order.studentLastName, ShcInvoicenumber: $scope.application.paycode }
            OrderDataService.duplicateOrderChk(dupchkdata).then(function (response) {
             
                if (!response.isSuccessful) {
                   //don't stop of failure go ahead with order
                    return false;
                }
                return response.data;
            });
        }
        function validate() {
        
            var retval = false
       
           
            if($scope.textProofRead.value == false && $scope.application.order.yearbookType == 'Personalized Foil Yearbook')
            {retval=true;}
            if($scope.textProofRead.value == false && $scope.application.order.yearbookType == 'Personalized Foil Text'){
             retval=true
            }
            if($scope.textProofRead.value == false && $scope.application.order.yearbookType == 'Personalized Ink Yearbook'){
                retval=true;
            } 

            if($scope.textProofRead.value == false && $scope.application.order.yearbookType == 'Personalized Ink Text'){           
                retval=true;}
            if(!$scope.onlinePayForm.$valid ){
                retval=true;
            }
           
            if ($scope.application.order.yearbookType == 'Love Line') {
                if ($scope.proofReadLoveLine.value == false) {
                    return true
                }
                if ((typeof ($scope.application.order.personalizedText) == 'undefined' || $scope.application.order.personalizedText.length < 1)) {
                    return true
                }
            }
            if ($scope.application.order.yearbookType == 'Ad') {
                if ($scope.proofReadAd.value == false) {
                    return true
                }
                if (typeof $scope.application.order.adType == 'undefined') {
                    
                    return true
                }
                
            }
          
            //if (retval == false) {
            //        if (!$scope.dupOrderByPass && $scope.application.order.studentFirstName != '' && $scope.application.order.studentLastName != '') {
            //            $scope.dupOrder = checkForDuplicateOrder();
            //        if ($scope.dupOrder ) {
            //            retval = true;
                        
            //            }
            //        }
                
            //}
          
            return retval
         
        }
        function addIcon(q) {
            if ($scope.application.order.iconAmt>0) {
                $scope.basePrice = $scope.basePrice - $scope.application.order.iconAmt;
            }
            $scope.application.order.iconAmt = 0;
            $scope.application.order.iconAmt = q * $scope.init.iconAmt;
            
            $scope.basePrice = $scope.basePrice + $scope.application.order.iconAmt;
           
            }
        function clearExtras() {
            $scope.application.order.personalizedText = '';
            $scope.application.order.icon1=''
            $scope.application.order.icon2=''
            $scope.application.order.icon3=''
            $scope.application.order.icon4=''

        }
        function setPrice() {
            $scope.application.order.iconAmt = 0;
            $scope.basePrice = 0;
            $scope.basePrice = $scope.init.basicInvAmt;
            if ($scope.application.order.yearbookType == "Standard Yearbook") {
                clearExtras();

            }
            if ($scope.application.order.yearbookType == "Personalized Foil Yearbook") { $scope.basePrice = $scope.init.foilPersAmt; console.log("1" + $scope.basePrice); }
            if ($scope.application.order.yearbookType == "Personalized Foil Text") {  $scope.basePrice = $scope.init.foilTxtAmt; console.log("2" + $scope.basePrice);}
            if ($scope.application.order.yearbookType == "Personalized Ink Yearbook") {  $scope.basePrice = $scope.init.inkPersAmt; console.log("3" + $scope.basePrice);}
            if ($scope.application.order.yearbookType == "Personalized Ink Text") {  $scope.basePrice = $scope.init.inkTxtAmt; console.log("4" + $scope.basePrice);}
            if ($scope.application.order.yearbookType == "Personalized Picture Yearbook") {  $scope.basePrice = $scope.init.picPersAmt;console.log("5" + $scope.basePrice); }
            if ($scope.application.order.yearbookType == "Love Line") {  $scope.basePrice = $scope.init.luvLineAmt; console.log("6" + $scope.basePrice);}

            if ($scope.application.order.yearbookType == "Ad") {
                if ($scope.application.order.adType == "Full Page Ad") { $scope.basePrice = $scope.init.fullAdlineAmt; console.log("7" + $scope.basePrice); }
                if ($scope.application.order.adType == "1/2 Page Ad") {  $scope.basePrice = $scope.init.halfAdlineAmt; console.log("8" +$scope.basePrice);}
                if ($scope.application.order.adType == "1/4 Page Ad") {  $scope.basePrice = $scope.init.quaterAdlineAmt; console.log("9" +$scope.basePrice);}
                if ($scope.application.order.adType == "1/8 Page Ad") {  $scope.basePrice = $scope.init.eightAdlineAmt; console.log("10" +$scope.basePrice);}
            }
           
        }

       

    }
]);
