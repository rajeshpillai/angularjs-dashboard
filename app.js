var app = angular.module("myApp", ['gridster','ngDragDrop']); 

app.controller('myCtrl', function($scope,$compile) {
  $scope.standardItems = [
    { id:"box1", sizeX: 10, sizeY: 1, row: 0, col: 0, dropperItems:[], showForm:false },
    { sizeX: 2, sizeY: 2, row: 0, col: 2 , dropperItems:[], showForm : false},
    { sizeX: 1, sizeY: 1, row: 0, col: 4, dropperItems:[] , showForm : false},
    { sizeX: 1, sizeY: 1, row: 0, col: 5, dropperItems:[] , showForm : false},
    { sizeX: 2, sizeY: 1, row: 1, col: 0, dropperItems:[], showForm : false },
    { sizeX: 1, sizeY: 1, row: 1, col: 4, dropperItems:[], showForm : false },
    { sizeX: 1, sizeY: 2, row: 1, col: 5 , dropperItems:[], showForm : false},
    { sizeX: 1, sizeY: 1, row: 2, col: 0, dropperItems:[], showForm : false },
    { sizeX: 2, sizeY: 1, row: 2, col: 1, dropperItems:[] , showForm : false},
    { sizeX: 1, sizeY: 1, row: 2, col: 3, dropperItems:[] , showForm : false},
    { sizeX: 1, sizeY: 1, row: 2, col: 4, dropperItems:[], showForm : false}
    ];

    $scope.listOfDirectives=[{'title': 'kpi', 'type':'kpi','properties':[{'name':'Measure','value':''}]},
                             {'title': 'filter', 'type':'filter','properties':[{'name':'Dimension','value':''}]},
                             {'title': 'text', 'type':'filter','properties':[{'name':'info','value':''}]}];

    $scope.listOfDirectivesDropped=[];

    $scope.list1 = {title: 'AngularJS - Drag Me'};
  $scope.list2 = {};

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

        $data.dirHtml = $compile("<" + $data.title + "></" + $data.title + ">")($scope);
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
         
         item.dropperItems =[];
        item.dropperItems.push($data);
    };

    $scope.openForm = function(item){
        item.showForm = true;
    }

    $scope.SaveProperties = function(item){
        //debugger;
        // item.dirHtml = $compile("<" + item.title + "></" + item.title + ">")($scope);

        var html="<" + item.title;
        item.properties.filter(function(prop,i){
            html += " " + prop.name + "=" + prop.value + " ";
        })
        html +="></" + item.title + ">";
        item.dirHtml = $compile(html)($scope);
         var containerDiv = item.target;

         containerDiv.empty();
         item.showForm =false;
         containerDiv.append(item.dirHtml);
        
    }
});

app.config(['$sceProvider', function($sceProvider) {
    $sceProvider.enabled(true);
}]);

app.directive("kpi", function() {
    return {
        template : "<h1>KPI Directive rendered</h1>"
    };
});

app.directive("filter", function() {
    return {
        template : "<h1>filter Directive rendered</h1>"
    };
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
