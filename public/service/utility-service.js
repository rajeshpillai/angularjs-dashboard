app.factory('utilityService', function ($rootScope) {
    var getFilterList= function (filter) {
        var filterList = [];
        //debugger;
        _.each(_.keys(filter), function (col) {
            //debugger;
            if (filter[col].length > 0) {
                var obj = { 'ColName': col, 'Values': [], 'DisplayName': col, 'Display': true }; //, 'Values': [filterObj[col]]

                if (_.isArray(filter[col])) { obj.Values = filter[col]; }
                else { obj.Values.push(filter[col]); }

                if (_.findIndex($rootScope.hideFiltersToDisplay, { 'ColName': col }) !== -1) {
                    obj['Display'] = false;
                }
               
                if (_.findIndex($rootScope.doNotApplyFilters, { 'ColName': col }) == -1) {
                    filterList.push(obj)
                }
               
                
                //filterList.push(obj)
                
            }
        })
        return filterList;
    }

    var getFilterListForCurrentSelection = function (filter) {
        var filterList = [];
        _.each(_.keys(filter), function (col) {

            if (filter[col].length > 0) {
                var obj = { 'ColName': col, 'Values': '', 'DisplayName': col, 'Display': true }; //, 'Values': [filterObj[col]]

                if (_.isArray(filter[col])) { obj.Values = _.join(filter[col], ','); }
                else { obj.Values= filter[col]; }

                if (_.findIndex($rootScope.hideFiltersToDisplay, { 'ColName': col }) !== -1) {
                    obj['Display'] = false;
                }

                _.each($rootScope.mapDisplayName, function (key, value) {
                    //debugger;
                    if (obj['ColName'] == key['ColName']) {
                        obj['DisplayName'] = key['DisplayName'];
                    }
                })

                //debugger;

                filterList.push(obj)
            }
        })
        //debugger;
        return filterList;
    }

    var getLastFilterForCurrentSelection = function (filter) {
        var obj = {};
        var filterList = [];
        if (filter) {
            _.each(_.keys(filter), function (col) {

                if (filter[col].length > 0) {
                    var obj = { 'ColName': col, 'Values': '', 'DisplayName': col, 'Display': true }; //, 'Values': [filterObj[col]]

                    if (_.isArray(filter[col])) { obj.Values = _.join(filter[col], ','); }
                    else { obj.Values = filter[col]; }

                    if (_.findIndex($rootScope.hideFiltersToDisplay, { 'ColName': col }) !== -1)
                    {
                        obj['Display'] = false;
                    }
                    
                    _.each($rootScope.mapDisplayName, function (key, value) {
                        //debugger;
                        if (obj['ColName'] == key['ColName']) {
                            obj['DisplayName'] = key['DisplayName'];
                        }
                    })

                    filterList.push(obj)
                }
            })
        }
        if (filterList.length > 0) {
            obj= filterList[filterList.length - 1];
        }
        return obj;
    }


    var getHashKeyValueForFilter = function (filterList, orFilterList,fixedFilterList) {
        //debugger;
        var hashKey = "";
        _.each(filterList, function (filter,i) {
            //debugger;
            hashKey += filter.ColName + _.join(filter.Values,'');
        })

        if (orFilterList) {

            //_.each(orFilterList, function (orFilter, i) {
            //    //debugger;
            //    hashKey += orFilter.ColName + _.join(orFilter.Values, '');
            //})
            _.each(orFilterList, function (orFilter, j) {
                hashKey += orFilter.OperationType;
                _.each(orFilter.FilterList, function (filter, i) {
                    //debugger;
                    hashKey += filter.ColName + _.join(filter.Values, '');
                })
            })
        }


        if (fixedFilterList) {
            _.each(fixedFilterList, function (fxFilter, i) {
                //debugger;
                hashKey += fxFilter.ColName + _.join(fxFilter.Values, '');
            })
        }
       

        //console.log("getHashKeyValueForFilter-hashKey", hashKey);
        return hashKey;
    }

    // Utility method to extend defaults with user options
    var extendDefaults= function (source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }        
        return source;
    }

    var getURLParameterByName = function (name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var getCurencyUnitCode = function (amtUnit) {

        var unitCode = "";
        switch (amtUnit) {
            case "Thousands":
                unitCode = "K";
                break;
            case "Millions":
                unitCode = "M"
                break
        }
        return unitCode;
    }


    var getValueInCurrentCurrency = function (value,amtUnit, format) {

        var yValue = parseFloat(value);
        if (!format || (format && format.indexOf('%') == -1)) {
            switch (amtUnit) {
                case "Thousands":
                    yValue = yValue / 1000;
                    break;
                case "Millions":
                    yValue = yValue / 1000000;
                    break
            }
        }
        if (format) { yValue = numeral(yValue).format(format) } //parseFloat(d3.format(format)(yValue));
        return yValue;
    }

    var getBFUGroupIcon = function (bfuGroup) {

        //BFUGroup wise icon details
        var bfuHeadIcons = [
           { 'BFUGroup': 'travel', 'img': '/img/dashboard/flight.png' },
           { 'BFUGroup': 'training', 'img': '/img/dashboard/training.png' },
           { 'BFUGroup': 'miscellaneous', 'img': '/img/dashboard/misc.png' },
           { 'BFUGroup': 'purchased services', 'img': '/img/dashboard/purchasedservices.png' },
           { 'BFUGroup': 'post & tel', 'img': '/img/dashboard/postage.png' },
           { 'BFUGroup': 'others', 'img': '/img/dashboard/others.png' },
           { 'BFUGroup': 'rent / hand', 'img': '/img/dashboard/rent.png' },
           { 'BFUGroup': 'books & periodicls', 'img': '/img/dashboard/books.png' },
           { 'BFUGroup': 'printng & statnry', 'img': '/img/dashboard/printing.png' },
           { 'BFUGroup': 'routine repairs', 'img': '/img/dashboard/routine.png' },
           { 'BFUGroup': 'welfare expenses', 'img': '/img/dashboard/welfare.png' },
           { 'BFUGroup': 'motor vehicle', 'img': '/img/dashboard/motor.png' },
           { 'BFUGroup': 'bank charges', 'img': '/img/dashboard/bankcharges.png' },
           { 'BFUGroup': 'p.r. & legal exps', 'img': '/img/dashboard/legal.png' },
           { 'BFUGroup': 'rates & taxes', 'img': '/img/dashboard/taxes.png' },
           { 'BFUGroup': 'e.d.p. expenses', 'img': '/img/dashboard/edp.png' }
                         
        ];

        var iconFilterResult = _.filter(bfuHeadIcons, { 'BFUGroup': bfuGroup.toLowerCase() });
        var icon = "/img/dashboard/expenses.png";

        if (iconFilterResult.length > 0) {
            icon = iconFilterResult[0].img;
        }
        return icon;
    }

    var formatPercentage = function (value) {
        return numeral(yValue).format('0%');
    }

    function formatHourstoDays(hours) {
        var days = Math.trunc(hours / 24);
        var remHours = Math.trunc(hours % 24);
        
        var formattedTime = "";
        if (days > 0) {
            formattedTime = days;
            if (days == 1) {
                formattedTime += " day "
            }
            else {
                formattedTime += " days "
            }
        }

        if (remHours > 0) {
            formattedTime += remHours;

            if (remHours == 1) {
                formattedTime += " hour "
            }
            else {
                formattedTime += " hours "
            }
        }

        return formattedTime;
    }

    return {
        getFilterList: getFilterList,
        extendDefaults: extendDefaults,
        getFilterListForCurrentSelection: getFilterListForCurrentSelection,
        getHashKeyValueForFilter: getHashKeyValueForFilter,
        getURLParameterByName: getURLParameterByName,
        getCurencyUnitCode: getCurencyUnitCode,
        getValueInCurrentCurrency: getValueInCurrentCurrency,
        getBFUGroupIcon: getBFUGroupIcon,
        getLastFilterForCurrentSelection: getLastFilterForCurrentSelection,
        formatPercentage: formatPercentage,
        formatHourstoDays: formatHourstoDays
    }
})