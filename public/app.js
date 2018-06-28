var app = angular.module("myApp", ['gridster','ngDragDrop','ngSanitize']); 

app.controller('myCtrl', function($scope,$compile,$rootScope) {

    $rootScope.globalFilter = {
        //activeFilter: { 'empcode': '000246073', 'Reportingtoid': '000246073' },
        activeFilter: {}, // 'Branch': 'B001'  //'EmpName': 'Atul Mehta' // 'EmpName':'Herjit Bhalla' // 'reportingtoname': 'Sudipto Mukherjee'
        //activeFilter: {},
        filterStack: [],
        //defaultFilter: { 'empcode': '000246073', 'Reportingtoid': '000246073' }
        defaultFilter: {},
        defaultORFilter:{}
        //fixedFilter: { 'empcode': '000281412' }
    };

    $rootScope.loggedInUser = true;

  $scope.standardItems = [
    { sizeX: 1, sizeY: 1, row: 0, col: 0, droppedItems:[],  showForm:false },
    { sizeX: 1, sizeY: 1, row: 0, col: 2 , droppedItems:[], showForm : false},
    { sizeX: 1, sizeY: 1, row: 0, col: 4, droppedItems:[] , showForm : false},
    { sizeX: 1, sizeY: 1, row: 0, col: 5, droppedItems:[] , showForm : false},
    { sizeX: 2, sizeY: 1, row: 1, col: 0, droppedItems:[],  showForm : false },
    { sizeX: 1, sizeY: 1, row: 1, col: 4, droppedItems:[],  showForm : false },
    { sizeX: 1, sizeY: 1, row: 1, col: 5 , droppedItems:[], showForm : false},
    { sizeX: 1, sizeY: 1, row: 2, col: 0, droppedItems:[],  showForm : false },
    { sizeX: 2, sizeY: 1, row: 2, col: 1, droppedItems:[] , showForm : false},
    { sizeX: 1, sizeY: 1, row: 2, col: 3, droppedItems:[] , showForm : false},
    { sizeX: 1, sizeY: 1, row: 2, col: 4, droppedItems:[],  showForm : false}
    ];

    $scope.listOfDirectives=[{'title': 'kpi', 'type':'kpi','properties':[{'name':'dimension','value':''},{'name':'Measure','value':''}]},
                             {'title': 'filter', 'type':'filter','properties':[{'name':'dimension','value':''},{'name':'fitername','value':''}]},
                             {'title': 'text', 'type':'filter','properties':[{'name':'info','value':''}]},
                            
                            //  {'title': 'kpi', 'type':'kpi','properties':[{'propname':'dimension','displayname':'Dimension','type':'string'},
                            //                                              {'propname':'measure','displayname':'Measure','type':'object','details':{}}]}
                           ];

    $scope.listOfDirectivesDropped=[];

    $scope.list1 = {title: 'AngularJS - Drag Me'};
  $scope.list2 = {};

  $scope.gridsterOpts = {
    //rowHeight: '1'
  };

  //------------------
//   $scope.men = [
//     'John',
//     'Jack',
//     'Mark',
//     'Ernie'
//     ];
    
    
//     $scope.women = [
//     'Jane',
//     'Jill',
//     'Betty',
//     'Mary'
//     ];

    // $scope.standardItems.filter(function(item,i){
    //     alert(i);
    // });
    
    
    $scope.addText = "";
    
    
    $scope.dropSuccessHandler = function($event,index,array){
       // array.splice(index,1);
    };
    
    // $scope.onDrop = function($event,$data,array){
    //     array.push($data);
    // };

    $scope.onDrop = function($event,$data,item){
       //debugger;
        //array.push($data);

        //$data.dirHtml = $compile("<" + $data.title + "></" + $data.title + ">")($scope);
        $data.dirHtml = `<kpi properties="{'ShowIcon':true,'Format':'0%', 'FontSize':'16px','ShowProgress':false }" 
                          measure="[{Expression:'sum(VacationHours)',DisplayName:'VacationHours'}]"></kpi>`;

         var containerDiv = $event.currentTarget;
         //angular.element(containerDiv).append($data.dirHtml);
        //  if($data.target){
        //     $data.target.empty();
        //     $data.target.append($data.dirHtml);
        //  } else {
            $data.target =angular.element(containerDiv).find("renderarea");
            $data.target.empty();
            $data.target.append($data.dirHtml);
            
         //}
         
         item.droppedItems =[];
        item.droppedItems.push($data);
    };

    $scope.openForm = function(item){
        item.showForm = true;
    }

    $scope.SaveProperties = function(item){
       
        // item.dirHtml = $compile("<" + item.title + "></" + item.title + ">")($scope);

        // var html="<" + item.title;
        // item.properties.filter(function(prop,i){
        //     html += " " + prop.name + "=" + prop.value + " ";
        // })
        // html +="></" + item.title + ">";

        var html =  `<kpi label="Vacation Hours"  properties="{'ShowIcon':false,'Format':'0', 'FontSize':'16px','ShowProgress':false}" 
        measure="[{Expression:'sum(VacationHours)',DisplayName:'VacationHours'}]"></kpi> `;

        item.dirHtml = $compile(html)($scope);
         var containerDiv = item.target;

         containerDiv.empty();
         item.showForm =false;
         containerDiv.append(item.dirHtml);
        
    }

    // $scope.$on('gridster-item-resized', function(item) {
    //     debugger;
    //     // item.$element
    //     // item.gridster
    //     // item.row
    //     // item.col
    //     // item.sizeX
    //     // item.sizeY
    //     // item.minSizeX
    //     // item.minSizeY
    //     // item.maxSizeX
    //     // item.maxSizeY
    // })
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.config(['$sceProvider', function($sceProvider) {
    $sceProvider.enabled(true);
}]);

app.config(function($provide){
    $provide.decorator("$sanitize", function($delegate, $log){
        return function(text, target){
 
            var result = $delegate(text, target);
            $log.info("$sanitize input: " + text);
            $log.info("$sanitize output: " + result);
 
            return result;
        };
    });
});


app.directive("text", function() {
    return {
        template : '<h1>text Directive rendered.{{myInfo}}</h1>',
        scope: {
            myInfo: '@info'
          },
        link: function(scope, element, attr){
            //scope.text="aa";
        }
    };
});

app.directive("renderarea", function() {
    return {
        template : ""
    };
});
