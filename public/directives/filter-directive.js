app.directive("filter", function($http) {
    return {
        templateUrl : "./directives/filter.html",
        scope: {
            fitername: '@',           
            dimension: "@"
        },
        link:  function(scope, element, attr){
       
            function refresh(){                
                //console.log('scope.dimension',scope.dimension);
                if(!scope.dimension) {return;}

                $http.post("http://localhost:57387/api/data/getfilters",{"Dimension":scope.dimension})
                .then(function(response) {                  
                    console.log(response.data);
                    scope.data = response.data;
                });
            }
            refresh();
        }
    };
});