app.directive("kpi", ['$compile', '$rootScope','dataService', 'utilityService', function ($compile, $rootScope,dataService, utilityService) {
    return {
        restrict: 'EA',
        templateUrl: './directives/kpi.html?v=2a',
        transclude: true,
        //priority: scope.priority,
        scope: {
            //value: "=",
            //type: "@"
            label: "@",
            fixedfilter: "=",
            measure: "=",
            properties: "=",
            ignoreglobalfilter: "=",
            mapfilteroption: "=",
            orfilter: "=",
            sqltablename: "@",
            dependentfilter: "=",
            storevaluein: "@",
            applyformula: "@",
            aggr: "=",
            dimension: "=",
            isondialog: "@",
            value: "=",
            isvalue: "@",
            unionor:"=",
            applydefaultorfilterasor: "@"
            //applydefaultorfilterasand: "@"
        },
        controller: function ($scope) {
            var vm = this;

        },
        controllerAs: 'vm',
        link: function (scope, elem, attrs, ctrl) {

            //console.log("scope", scope);
            //console.log("scope.type", scope.type);
            //console.log("scope.value",scope.value);
            //scope.$watch("value", function (newValue, oldValue) {
            //    scope.vm.value = scope.value;
            //    scope.vm.type = scope.type;
            //});

            //scope.vm.value = scope.value;
            //scope.vm.type = scope.type;

            scope.vm.loading = true;
            scope.vm.applydefaultorfilterasor = false;
            //scope.vm.applydefaultorfilterasand = true;
            if (scope.applydefaultorfilterasor)
            {                
                scope.vm.applydefaultorfilterasor = scope.applydefaultorfilterasor;
            }
            //if (scope.applydefaultorfilterasand) {
            //    scope.vm.applydefaultorfilterasand = scope.applydefaultorfilterasand;
            //}

            //THis is used when multiple queries fired and only latest result should be formatted and shown
            scope.querycount = 0;

            if (scope.isondialog) {
                scope.refresh = true;
            }

            scope.$on('$destroy', function () {
                //alert('Put unbind handlers for timers etc. here')
                if (scope.isondialog) {
                    //debugger;
                    scope.refresh = false;
                    scope = null;
                    elem.remove();
                }
            })

            scope.vm.label = scope.label;
            var propeties = { "Format": "0,0", "FontSize": "12px", 'ShowProgress': false, 'Separator': '-', 'ShowInDiffLine': false, 'LabelColor': '#000', 'Type':'Currency','ProgressLabel':'' };
            if (scope.properties) {
                propeties = utilityService.extendDefaults(propeties, scope.properties);
            }            
           
            scope.vm.properties = propeties;

            //var visualCue = [
            //    { 'from': -0.9999, 'to': 0, 'color': '#999' }, //Gray
            //    { 'from': 0.1, 'to': 1, 'color': '#ffa500' },  //Orange
            //    { 'from': 1.1, 'to': 1000, 'color': '#ff0000' } //Red
            //];

            var visualCue = [
              { 'from': -0.9999, 'to': 0.5, 'color': 'green', 'icon':'down' }, //Green V
              { 'from': 0.5, 'to': 1, 'color': '#ffc640', 'icon': 'square' },  //yellow  square
              { 'from': 1, 'to': 1000, 'color': '#ff0000', 'icon': 'up' } //Red    ^
            ];

            scope.vm.visualCue = visualCue;

            // listen for the event in the relevant $scope
            $rootScope.$on('dashboardFilterChange', function () {
                //console.log("dashboardFilterChange- KPI"); // 'Data to send'
                RefreshKPIData();

            });

            $rootScope.$on('amtUnitChange', function () {
                //console.log("dashboardFilterChange- KPI"); // 'Data to send'
                formatData();

            });

            function RefreshKPIData() {
                    if (scope) {

                    scope.querycount = scope.querycount + 1;

                    if (scope.isvalue) {
                        //debugger;
                        scope.vm.value = scope.value;
                        formatData();
                        scope.vm.loading = false;
                        return;
                    }
                  
                    var filterList = utilityService.getFilterList($rootScope.globalFilter.activeFilter);

                    //var defaultORFilterAsand = (scope.vm.applydefaultorfilterasand == true) ? utilityService.getFilterList($rootScope.globalFilter.defaultORFilter) : [];
                    ////Add default ORFilter as And
                    //if (defaultORFilterAsand) {
                    //    //var r = $rootScope;
                    //    _.each(defaultORFilterAsand, function (filter) {
                    //        //debugger;
                    //        filterList.push({ 'ColName': filter.ColName, 'Values': filter.Values });
                    //    })
                    //    //debugger;
                    //}

                    if (scope.mapfilteroption) {
                        _.each(scope.mapfilteroption, function (mapfilterOpt) {
                            _.each(filterList, function (filter) {
                                // debugger;
                                if (filter.ColName == mapfilterOpt.Source) {
                                    filter.ColName = mapfilterOpt.Target;
                                    //filter[mapfilterOpt.Target] = filter.ColName;
                                }
                            })
                        })
                    }

                    if (scope.fixedfilter) {
                        //Remove any change in Fixed filter from active filter list
                        _.each(scope.fixedfilter, function (fixFilter) {
                            if (fixFilter.OperationType) {
                                //If operation type is null or is not null then do not remove from filterlist
                                if (fixFilter.OperationType.indexOf("null") == -1) {
                                    _.remove(filterList, { 'ColName': fixFilter.ColName });
                                }
                            }
                            else {
                                _.remove(filterList, { 'ColName': fixFilter.ColName });
                            }
                        })
                    }


                    if (scope.ignoreglobalfilter) {
                        _.each(scope.ignoreglobalfilter, function (ignoreGlbFilterName) {
                            // debugger;
                            _.remove(filterList, { 'ColName': ignoreGlbFilterName });
                        })
                    }

                    if (scope.dependentfilter) {
                        //var r = $rootScope;
                        _.each(scope.dependentfilter, function (filter) {
                            //debugger;
                            filterList.push({ 'ColName': filter.ColName, 'Values': eval(filter.Object) });
                        })
                        //debugger;
                    }

                    //debugger;
                    //var orFilterList = (scope.vm.applydefaultorfilterasor == true)? utilityService.getFilterList($rootScope.globalFilter.defaultORFilter): [];
                    //if (!orFilterList) { orFilterList = []; }

                    //if (scope.vm.applydefaultorfilterasor) {
                    //    //Remove ignore filter from defaultOR Filter also
                    //    if (scope.ignoreglobalfilter) {
                    //        _.each(scope.ignoreglobalfilter, function (ignoreGlbFilterName) {
                    //            // debugger;
                    //            _.remove(orFilterList, { 'ColName': ignoreGlbFilterName });
                    //        })
                    //    }
                    //}

                    var orFilterList = [];
                    if ($rootScope.globalFilter.defaultORFilter && !(_.isEmpty($rootScope.globalFilter.defaultORFilter))) {
                        //debugger;
                        var defaultOrFilterList = _.clone(utilityService.getFilterList($rootScope.globalFilter.defaultORFilter));
                        //Remove ignore filter from defaultOR Filter also
                        _.each(scope.ignoreglobalfilter, function (ignoreGlbFilterName) {                           
                            _.remove(defaultOrFilterList, { 'ColName': ignoreGlbFilterName });
                        })     
                       
                        if (defaultOrFilterList && defaultOrFilterList.length > 0) {
                            orFilterList.push({ 'OperationType': 'and', 'FilterList': _.clone(utilityService.getFilterList($rootScope.globalFilter.defaultORFilter)) });
                            //if (scope.vm.applydefaultorfilterasor) {
                            //    orFilterList.push({ 'OperationType': 'or', 'FilterList': _.clone(utilityService.getFilterList($rootScope.globalFilter.defaultORFilter)) });
                            //}
                            //else {
                            //    orFilterList.push({'OperationType':'and', 'FilterList': _.clone(utilityService.getFilterList($rootScope.globalFilter.defaultORFilter)) });
                            //}          
                        }
                    }

                    //if (!orFilterList) { orFilterList = []; }
                    //Remove ignore filter from defaultOR Filter also
                    if (scope.ignoreglobalfilter) {
                        _.each(scope.ignoreglobalfilter, function (ignoreGlbFilterName) {
                            _.each(orFilterList, function (orFilter) {
                                //debugger;
                                _.remove(orFilter.FilterList, { 'ColName': ignoreGlbFilterName });
                            })
                        })
                    }
                    ////Remove orfilter list if not contains any list
                    //_.each(orFilterList, function (orFilter) {
                    //    //debugger;
                    //    if (orFilter.FilterList.length == 0) {
                    //        _.remove(orFilter.FilterList, { 'ColName': ignoreGlbFilterName });
                    //    }
                    //})

                    //unionor
                    if (scope.unionor && scope.unionor.length > 0) {

                        //orFilterList.push.apply(orFilterList, scope.unionor);
                        //debugger;
                        orFilterList.push.apply(orFilterList, { 'OperationType': 'or', 'FilterList': scope.unionor });
                    }


                    if (scope.orfilter && scope.orfilter.length > 0) {
                        //debugger;
                        orFilterList.push.apply(orFilterList, scope.orfilter);
                    }
                   
                                    
                    
                    var hashKey = utilityService.getHashKeyValueForFilter(filterList, orFilterList);
                    console.log("hashKey", hashKey);

                    if (scope.hashKey != hashKey) {

                        if (scope.isondialog && !scope.refresh) {
                            //debugger;
                            scope.vm.loading = false;
                            return false;
                        }

                        scope.hashKey = hashKey;
                        console.log("Call DB for KPI-", scope.label);
                       //debugger;
                        
                        var kpiWidgetModel = {
                            Measure: scope.measure,
                            FixedFilter: scope.fixedfilter,
                            FilterList: filterList,
                            ORFilterList: orFilterList,
                            Type: 'KPI',
                            Aggr: scope.aggr,
                            Dimension: scope.dimension,
                            QueryCount: scope.querycount
                        };

                        if (scope.sqltablename) {
                            kpiWidgetModel["SqlTableName"] = scope.sqltablename;
                        }

                        if (($rootScope.dashboardType == "m" || $rootScope.dashboardType == "e") && !$rootScope.loggedInUser) { //&& _.filter(filterList, { 'EmpName': $rootScope.loggedInUser.UserEmployeeName }).length == 0) {
                            scope.vm.loading = false;
                            return false;
                        }

                        scope.vm.loading = true;
                        if (!$rootScope.loggedInUser) {
                            return false;
                        }

                        if (scope.isvalue) {
                            scope.vm.loading = false;
                            return false;
                        }
                        
                        dataService.getData1(kpiWidgetModel).then(function (data) {
                            //debugger;
                            if (scope) {

                                if (kpiWidgetModel.QueryCount < scope.querycount) {
                                    return;
                                }

                                //console.log('kpiWidgetModel service result', data);

                                //var jsonData = JSON.parse(data);
                                var jsonData = data;
                                //if (!data) { scope.vm.value = 0;}
                                scope.vm.value = "";
                                if (jsonData.length > 0) {
                                    //debugger;
                                    var measureName = "";
                                    if (_.isNull(scope.measure[0].DisplayName)) { measureName = scope.measure[0].Expression; }
                                    else
                                    { measureName = scope.measure[0].DisplayName; }

                                    scope.vm.value = jsonData[0][scope.measure[0].DisplayName];

                                    //scope.vm.originalValue = scope.vm.value;

                                    //scope.vm.value = 1;
                                    //debugger;

                                    formatData();

                                    scope.vm.loading = false;

                                    //if (scope.vm.properties.Format.indexOf('%') == -1 && $rootScope.amtUnit != 'Absolute') {
                                    //    //debugger;
                                    //    switch ($rootScope.amtUnit) {
                                    //        case "Thousands":
                                    //            scope.vm.value = scope.vm.value / 1000;
                                    //            break;
                                    //        case "Millions":
                                    //            scope.vm.value = scope.vm.value / 1000000;
                                    //            break                                    
                                    //    }

                                    //}

                                    //scope.vm.formattedValue = numeral(scope.vm.value).format(scope.vm.properties.Format);



                                    //if (scope.vm.properties.Format.indexOf('%') == -1) {
                                    //    scope.vm.formattedValue = "₹" + scope.vm.formattedValue;
                                    //}
                                }
                            }
                        })
                    }
                }
            }

            RefreshKPIData();

            function formatData() {
                if (!scope) { return; }
                //debugger;
                var formattedValue = scope.vm.value;

                if (scope.storevaluein) {
                    $rootScope[scope.storevaluein] = _.cloneDeep(scope.vm.value);
                }

                if (scope.applyformula) {
                   // debugger;
                    formattedValue =  eval(scope.applyformula);
                    // eval(filter.Object)
                }

                if (scope.vm.properties.Format.indexOf('%') == -1 && $rootScope.amtUnit != 'Absolute' && scope.properties.Type != "Count") {
                    //debugger;
                    switch ($rootScope.amtUnit) {
                        case "Thousands":
                            formattedValue = formattedValue / 1000;
                            break;
                        case "Millions":
                            formattedValue = formattedValue / 1000000;
                            break
                    }

                    //debugger;
                   

                }

                console.log("scope.vm.properties.Format:", numeral(formattedValue), scope.vm.properties.Format);

                scope.vm.formattedValue = numeral(formattedValue).format(scope.vm.properties.Format);

                if ($rootScope.amtUnit == "Millions" && scope.vm.properties.Format.indexOf('%') == -1 && scope.properties.Type != "Count") {
                    //"Format": "0,0.00"
                    scope.vm.formattedValue = numeral(formattedValue).format("0,0.00");
                }
                


                if (scope.vm.properties.Format.indexOf('%') == -1 && scope.vm.properties.Type == "Currency") {
                    //scope.vm.formattedValue = "₹" + scope.vm.formattedValue;
                    //scope.vm.formattedValue = "&#8377;" + scope.vm.formattedValue;
                    scope.vm.formattedValue = '<i class="fa fa-inr"></i>' + scope.vm.formattedValue;
                    scope.vm.formattedValue += utilityService.getCurencyUnitCode($rootScope.amtUnit);
                }
            }

        }
    };
}]);





// app.directive("kpi", function($http) {
//     return {
//         templateUrl : "./directives/kpi.html",
//         scope: {
//             label: "@",          
//             measure: "@",           
//             dimension: "@"
//         },
//         link:  function(scope, element, attr){
       
//             function refresh(){   
//                 scope.value =0.00;                             
//                 if(!scope.measure) {return;}

//                 $http.post("http://localhost:57387/api/data/evalexp",{"Dimension":scope.dimension, "Measure":scope.measure })
//                 .then(function(response) {                  
//                     console.log(response.data);
//                     scope.data = response.data;

//                     if(scope.data && scope.data.length > 0){
//                         scope.value = scope.data[0][scope.dimension];
//                     }
//                 });
//             }
//             refresh();
//         }
//     };
// });