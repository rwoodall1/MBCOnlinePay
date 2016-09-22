/// <reference path="school.js" />
'use strict';

angular.module('app')
.controller('AdminCtrl', ['$rootScope', '$scope', '$state','$stateParams', '$location','globalConstants','TeacherDataService', 'OrderDataService','$modal','NotificationService',
    function ($rootScope, $scope, $state,$stateParams, $location,globalConstants,TeacherDataService,OrderDataService,$modal,InvoiceDataService, NotificationService) {
       
        initialize();

        function initialize() {
            $scope.page = 'orders';
            $scope.globalConstants = globalConstants;
            $scope.getOrders = getOrders;
            $scope.schname = $stateParams.schname;
            $scope.schcode = $stateParams.schcode;
            $scope.invno = $stateParams.invoicenumber;
            $scope.onBtExport = onBtExport;
            $scope.sizeToFit = sizeToFit;
            $scope.autoSizeTeacherAll = autoSizeTeacherAll;
            $scope.sizeTeacherToFit = sizeTeacherToFit;
            //$scope.gradeToAdd = {};
            $scope.teacherToAdd = '';
            $scope.autoSizeAll = autoSizeAll;
            $scope.addTeacher = addTeacher;
            $scope.deleteTeacher=deleteTeacher;
            $scope.addingTeacher = false;
            $scope.getTeachers = getTeachers;
            $scope.orders = {};
            $scope.orderColumnDefs = [
                { headerName: "Grade", field: "grade", headerTooltip: "Grade", width: 130, },
                { headerName: "Teacher", field: "teacher", headerTooltip: "Teacher", width: 130,filterParams: { apply: true } },
                { headerName: "First Name", headerTooltip: "First Name", field: "studentfname", width: 100, },
                { headerName: "Last Name", field: "studentlname", headerTooltip: "Last Name", width: 100, filterParams: { apply: true } },
                { headerName: "Item", field: "booktype", headerTooltip: "Item", width: 100, filterParams: { apply: true } },
                {headerName: "Text", field: "perstext1", width: 130, hide: true },
                { headerName: "Icon1", field: "icon1", width: 130, hide: true },
                { headerName: "Icon2", field: "icon2", width: 130, hide: true },
                { headerName: "Icon3", field: "icon3", width: 130, hide: true },
                { headerName: "Icon4", field: "icon4", width: 130, hide: true },
                {headerName: "Qty", field: "itemqty", width: 130, hide: true },
                { headerName: "Item Amount", field: "itemAmount", width: 130, hide: true },
                {headerName: "Item Total", field: "itemtotal", headerTooltip: "Item Total", width: 100, template: '<span>{{data.itemtotal | currency}}</span>' },
                { headerName: "Order Id", field: "orderId", headerTooltip: "Order Id", width:60,filterParams: { apply: true } },
                { headerName: "Date", field: "ordDate", headerTooltip: "Order Date",minwidth:100, width:100, filterParams: { apply: true }, template: '<span>{{data.ordDate | date}}</span>' },
                { headerName: "Email", field: "emailaddress", width: 130, hide: true },                
                { headerName: "Trans Id", field: "transid", width: 130, hide: true },                
                { headerName: "Pay Type", field: "paytype", width: 130, hide: true },
                { headerName: "Payer First Name", field: "payerfname", width: 130, hide: true },
                { headerName: "Pay Last Name", field: "payerlname", width: 130, hide: true },
                  ];
            $scope.ordersGridOptions ={}; 
            $scope.teacherColumnDefs = [
                { headerName: "", field: "", minwidth: 50, width:60, template: '<span><a ng-click="deleteTeacher(data.id)" class="text-link">Delete</a></span>' },
               { headerName: "Teacher", field: "teacher", headerTooltip: "Teacher", minwidth: 100, width: 100, filterParams: { apply: true } },
               { headerName: "Grade", headerTooltip: "grade", field: "grade", width: 100, },
               { headerName: "Schcode", field: "schcode", hide: true, width: 100, },
                { headerName: "Id", field: "id", hide: true, width: 50, },
            ];
            $scope.teacherGridOptions = {};
            $scope.getOrders = getOrders;
            $scope.loading = true;
            
           
            
            getOrders();
           
        }
        function setFormsToSubmitted() {
            $scope.form.$setSubmitted();
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
        function deleteTeacher(id) {
            TeacherDataService.deleteTeacher(id).then(function (response) {
                if (!response.isSuccessful) {
                    NotificationService.displayError('Failed to delete teacher.');
                    $scope.loading = false;
                    return;
                };
                $scope.teachers = {}

                getTeachers();

           
            });

        }
        function getTeachers() {
          
            if ($scope.page == 'class') {
                TeacherDataService.getTeachers($scope.schcode).then(function (response) {
                    if (!response.isSuccessful) {
                        NotificationService.displayError('Failed to retrieve teachers.');
                        $scope.loading = false;
                        return;
                    };
                    $scope.loading = false;
                    $scope.teachers = response.data;

                    var hasFooter = false;
                    var myHeight = 550;
                    if ($scope.teachers.length < 20) { myHeight = 27 + ($scope.teachers.length * 26) + 6; if (hasFooter) { myHeight = myHeight + 25; } }
                    $scope.gridStyle = { 'height': myHeight + 'px' };
                    var theGridOptions = {
                        columnDefs: $scope.teacherColumnDefs,
                        angularCompileRows: true,
                        rowData: $scope.teachers,
                        enableSorting: true,
                        suppressRowClickSelection: true,
                        enableColResize: true,
                        onGridReady: function (event) { sizeTeacherToFit(); },
                        enableFilter: true,
                        getRowStyle: function (params) {
                            if (params.node.floating) {
                                return { 'font-weight': 'bold' }
                            }
                        }
                    }
               $scope.teacherGridOptions = theGridOptions;
                });
            }
        }
        
        function addTeacher(teacher,grade) {
            setAllFormInputsToDirty()
            setFormsToSubmitted()
            if ($scope.form.$valid) {
        
            var data = {
                schcode: $scope.schcode,
                teacher: teacher,
                grade:grade.text
            }
          
            TeacherDataService.addTeacher(data).then(function (response) {
              
                if (!response.isSuccessful) {
                    NotificationService.displayError(response.error.userHelp);
                    $scope.loading = false;
                    return;
                };
              
                $scope.teachers = {}
               
                getTeachers();
         

            });
            
            };
        }
        function getOrders() {
           
            OrderDataService.getOrders($scope.invno).then(function (response) {
                if (!response.isSuccessful) {
                    NotificationService.displayError('Order retrieval failed.');
                    $scope.loading = false;
                    return;
                };
                $scope.loading = false;
                $scope.orders = response.data;
               
                var hasFooter = false;
                var myHeight = 550;
                if ($scope.orders.length < 20) { myHeight = 27 + ($scope.orders.length * 26) + 6; if (hasFooter) { myHeight = myHeight + 25; } }
                $scope.gridStyle = { 'height': myHeight + 'px' };
                var theGridOptions= {
                    columnDefs: $scope.orderColumnDefs,
                    angularCompileRows: true,
                    rowData: $scope.orders,
                    enableSorting: true,
                    suppressRowClickSelection: true,
                    enableColResize: true,
                    onGridReady: function (event) { sizeToFit(); },
                    enableFilter: true,
                    getRowStyle: function (params) {
                        if (params.node.floating) {
                            return { 'font-weight': 'bold' }
                        }
                    }
                };
                $scope.ordersGridOptions = theGridOptions
               

            });
        }
        function sizeToFit() {
            $scope.ordersGridOptions.api.sizeColumnsToFit();
        }
        function sizeTeacherToFit() {
            $scope.teacherGridOptions.api.sizeColumnsToFit();
        }
        function autoSizeTeacherAll() {

            var allColumnIds = [];
            $scope.teacherColumnDefs.forEach(function (columnDef) {
                allColumnIds.push(columnDef.field);
            });
            $scope.teacherGridOptions.columnApi.autoSizeColumns(allColumnIds);
        }
        function autoSizeAll() {

            var allColumnIds = [];
            $scope.orderColumnDefs.forEach(function (columnDef) {
                allColumnIds.push(columnDef.field);
            });
            $scope.ordersGridOptions.columnApi.autoSizeColumns(allColumnIds);
        }
        function onBtExport() {
            var params = {
                allColumns: true,
                fileName: $scope.exportName,
            };

            $scope.ordersGridOptions.api.exportDataAsCsv(params);
        }




    }]);
