app.factory('dataService', function($http,$window) {

    var serviceBaseUrl = "http://localhost:57387/api/";

   
    //var serviceBaseUrl = BFU.DashboardServiceURL;

    var exportData = function (widgetModel) {
        ////debugger;
        //console.log("widgetModel", widgetModel);        
        return $http.post(serviceBaseUrl + "/Dashboard/GetData", widgetModel)
                .then(function (response) {

                    if (response.data && response.data.type == "timeout") {
                        $window.location.href = '/Login/Index';
                        return response;
                    }

                    //console.log("exportData", response);
                    //var file = new Blob(([response.data.data]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    ////debugger;
                    ////if (window.navigator.msSaveOrOpenBlob) {
                    ////    navigator.msSaveBlob(file, 'fileName.pdf');
                    ////}
                    //saveAs(file, 'filename.xlsx');
                    return response;
                });
      
    }

    var getData1 = function (widgetModel) {
        ////debugger;
        //console.log("widgetModel", widgetModel);

        //var filter = [];
        //_.each(_.keys(filterObj), function (col) {

        //    if (filterObj[col].length > 0) {
        //        var obj = { 'ColName': col, 'Values': [] }; //, 'Values': [filterObj[col]]

        //        if (_.isArray(filterObj[col])) { obj.Values = filterObj[col]; }
        //        else { obj.Values.push(filterObj[col]); }

        //        filter.push(obj)
        //    }
        //});
        ////console.log("getData-Fiter", filter);

        //debugger;
        return $http.post(serviceBaseUrl + "data/getData", widgetModel)
                .then(function (response) {
                    //debugger;
                    //console.log("response.data.data",response.data.data);
                    //console.log("response---->", response);

                    if (response.data && response.data.type == "timeout") {
                        $window.location.href = '/Login/Index';
                        return response;
                    }

                    //return response.data.data;
                    return response.data;
                });
    }

    var getTotalRowCount = function (widgetModel) {
        ////debugger;
        //console.log("widgetModel", widgetModel);

        return $http.post(serviceBaseUrl + "/Dashboard/GetTotalRowCount", widgetModel)
                .then(function (response) {

                    if (response.data && response.data.type == "timeout") {
                        $window.location.href = '/Login/Index';
                        return response;
                    }

                    return response.data.data;
                });
    }

    var getLoggedInUser = function () {
        return $http.post(serviceBaseUrl + "/Dashboard/GetLoggedInUser")
               .then(function (response) {
                   //console.log("GetLoggedInUser",response.data);

                   if (response.data && response.data.type == "timeout") {
                       $window.location.href = '/Login/Index';
                       return response;
                   }

                   return response.data;
               });
    }

    var getRecentQuarterByMOC = function () {
        return $http.post(serviceBaseUrl + "/Dashboard/GetRecentQuarterByMOC")
               .then(function (response) {

                   if (response.data && response.data.type == "timeout") {
                       $window.location.href = '/Login/Index';
                       return response;
                   }

                   return response.data;
               });
    }

    var getConfiguredDesignations = function () {
        return $http.post(serviceBaseUrl + "/Dashboard/GetAllConfiguredLoginDesignations")
               .then(function (response) {
                   //console.log("GetLoggedInUser",response.data);

                   if (response.data && response.data.type == "timeout") {
                       $window.location.href = '/Login/Index';
                       return response;
                   }

                   return response.data;
               });
    }

    var getEmployeesByDesignation = function (desig,branchCode,costCenterCode) {
        return $http.post(serviceBaseUrl + "/Dashboard/GetEmployeesByDesignation", { 'BusinessTitle': desig, 'BranchCode': branchCode, 'CostCenterCode': costCenterCode })
               .then(function (response) {
                   //console.log("GetLoggedInUser",response.data);

                   if (response.data && response.data.type == "timeout") {
                       $window.location.href = '/Login/Index';
                       return response;
                   }

                   return response.data;
               });
    }

    
    return {      
        getData1: getData1,
        getTotalRowCount: getTotalRowCount,
        exportData: exportData,
        getLoggedInUser: getLoggedInUser,
        getRecentQuarterByMOC: getRecentQuarterByMOC,
        getConfiguredDesignations: getConfiguredDesignations,
        getEmployeesByDesignation:getEmployeesByDesignation
    }

})