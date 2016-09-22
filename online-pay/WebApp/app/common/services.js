'use strict';

angular.module('app')
    .value('appName', 'Mbc Online Pay')
    .value('version', '1.0')
    .service('UtilService', ['$window', '$http', '$q', '$rootScope', function ($window, $http, $q, $rootScope) {

        function goToTop() {$window.scrollTo(0, 0);}

        function goBack() {$window.history.back();}

        function closeModal() {
            $('.modal.in').modal('hide');
            $(".modal-backdrop").hide();
            $('body').removeClass('modal-open');
        }

        function setServerVars() {
            var defer = $q.defer();
            $http.get('api/utility/' + 'getServerVars').
                success(function (data, status, headers, config) {
                    $rootScope.environment = data.environment;
                    $rootScope.rootURL = data.rootURL;
                    if (data.environment == "dev") {
                        $rootScope.IsDev = true;
                    } else {
                        $rootScope.IsDev = false;
                    }
                    defer.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    defer.resolve(null);
                });

            return defer.promise;
        }

        function convertToDate(dateString, inputmask) {
            var myReturn = {};
            myReturn.isDate = false;
            if (inputmask == "yyyymmdd") {
                myReturn.date = Date.parse(dateString);
                myReturn.isDate = true;
            }

            return myReturn;
        }

        var checkRootScope = function () {
            var defer = $q.defer();
            var checkRootScopeLoop = function (checkTime) {
                if (typeof $rootScope.serverVars !== "undefined") {
                    defer.resolve(true);
                } else if (checkTime <= 10000) {
                    checkTime = checkTime + 200;
                    setTimeout(function () { checkRootScopeLoop(checkTime); }, 200);
                } else {
                    defer.resolve(false);
                }
            }
            checkRootScopeLoop(0);

            return defer.promise;
        }

        return {
            goToTop: goToTop,
            goBack: goBack,
            closeModal: closeModal,
            setServerVars: setServerVars,
            convertToDate: convertToDate,
            checkRootScope: checkRootScope
        };
    }])
      .service('TeacherDataService', ['$http', '$q', '$rootScope', 'globalConstants', 'NotificationService', function ($http, $q, $rootScope, globalConstants, NotificationService) {
          var orderApiPrefix = 'api/teacher/';
          var getTeachers = function (schcode) {
              var defer = $q.defer();

              $http.get(orderApiPrefix + 'getAllTeachers?schcode=' + schcode).
                success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    defer.resolve(null);
                });

              return defer.promise;
          }
          var addTeacher = function (data) {
              var defer = $q.defer();
           
              var postData = {
                  Teacher: data.teacher,
                  Grade:data.grade,
                  Schcode:data.schcode
              }

              $http.post(orderApiPrefix + 'addTeacher',postData).
                success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    defer.resolve(null);
                });

              return defer.promise;
          }
          var deleteTeacher = function (id) {
              var defer = $q.defer();
                          
              $http.get(orderApiPrefix + 'deleteTeacher?id='+id).
                success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    defer.resolve(null);
                });

              return defer.promise;
          }
          return {
              deleteTeacher:deleteTeacher,
              getTeachers: getTeachers,
              addTeacher:addTeacher
          };

      }])
    .service('NotificationService', ['$rootScope', '$mdToast', 'UtilService', function ($rootScope, $mdToast, UtilService) {
        var displayError = function (errorMessage, bypassNextStateChange, keepExistingMessages) {
            bypassNextStateChange = typeof bypassNextStateChange !== 'undefined' ? bypassNextStateChange : false;
            keepExistingMessages = typeof keepExistingMessages !== 'undefined' ? keepExistingMessages : false;
            // $rootScope.$broadcast('displayError', errorMessage, bypassNextStateChange);

             $mdToast.show(
                $mdToast.simple()
                .content(errorMessage)
                .hideDelay(10000)
                .position('bottom right')
                .theme('toast-error')
            );
        }

        var displayWarning = function (warningMessage, bypassNextStateChange, keepExistingMessages) {
            bypassNextStateChange = typeof bypassNextStateChange !== 'undefined' ? bypassNextStateChange : false;
            keepExistingMessages = typeof keepExistingMessages !== 'undefined' ? keepExistingMessages : false;
            $rootScope.$broadcast('displayWarning', warningMessage, bypassNextStateChange, keepExistingMessages);
        }

        var displaySuccess = function (successMessage, bypassNextStateChange) {
            $mdToast.show(
                $mdToast.simple()
                .content(successMessage)
                .hideDelay(10000)
                .position('bottom right')
                .theme('toast-success')
            );
            UtilService.goToTop();
        }

        var removeError = function () {
            $rootScope.$broadcast('removeErrorDisplay');
        }

        return {
            displayError: displayError,
            displayWarning: displayWarning,
            displaySuccess: displaySuccess,
            removeError: removeError
        };
    }])
    .service('OrderDataService', ['$http', '$q', '$rootScope', 'globalConstants', 'NotificationService', function ($http, $q, $rootScope, globalConstants, NotificationService) {
        var orderApiPrefix = 'api/order/';
        var duplicateOrderChk = function (dupchkdata) {
            var defer = $q.defer();

            $http.post(orderApiPrefix + 'duplicateOrderChk',dupchkdata).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.resolve(null);
              });

            return defer.promise;
        }
        

   
        var getOrders = function (invno) {
            var defer = $q.defer();

            $http.get(orderApiPrefix + 'getAllOrders?invno='+invno).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.resolve(null);
              });

            return defer.promise;
        }
        return {
            getOrders:getOrders,
            duplicateOrderChk: duplicateOrderChk
        };

    }])
    .service('InvoiceDataService', ['$http', '$q', '$rootScope', 'globalConstants', 'NotificationService', function ($http, $q, $rootScope, globalConstants, NotificationService) {
        var invoiceApiPrefix = 'api/invoice/';

        var invoiceCodeExist = function (invNumber) {
            var defer = $q.defer();

            $http.get(invoiceApiPrefix + 'invoiceCodeExist?invNumber=' + invNumber).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.resolve(null);
              });

            return defer.promise;
        }
        var login = function (schcode,password) {
            var defer = $q.defer();
           var postData = { schcode: schcode, password: password };
            $http.post(invoiceApiPrefix +'login' ,postData).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.resolve(null);
              });

            return defer.promise;
        }

        var invoiceInit = function (invNumber) {
            var defer = $q.defer();

            $http.get(invoiceApiPrefix + 'invoiceInit?invNumber=' + invNumber).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.resolve(null);
              });

            return defer.promise;
        }
        var schoolExist = function (schcode) {
            var defer = $q.defer();

            $http.get(invoiceApiPrefix + 'schoolExist?schcode=' + schcode).
              success(function (data, status, headers, config) {
                  defer.resolve(data);
              }).
              error(function (data, status, headers, config) {
                  defer.resolve(null);
              });
            console.log(defer.promise)
            return defer.promise;

        }
        return {
            login:login,
            schoolExist:schoolExist,
            invoiceCodeExist: invoiceCodeExist,
            invoiceInit: invoiceInit
        };



    }]);

