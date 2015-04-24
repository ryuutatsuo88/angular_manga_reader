(function() {
	var app = angular.module("myApp", ["mangaReader"]);
	
	app.config(['$routeProvider', function($routeProvider) {
			$routeProvider.
			  when("/", {
			  		templateUrl: "partials/mangaDirectory.html",
      				controller: 'mangaDirectoryCtr'
    		  })
  	}]);
  	
  	app.controller("mangaDirectoryCtr", ['$scope', '$http', '$location', '$routeParams', 'Collection',
		function($scope, $http, $location, $routeParams, Collection){
			var $this = this;
			
			Collection.init();
			$this.mangas = Collection.data.mangasData;
			
	}]);
	
	app.filter('myLimitTo', [function(){
    return function(obj, limit){
        var keys = Object.keys(obj);
        if(keys.length < 1){
            return [];
        }

        var ret = new Object,
        count = 0;
        angular.forEach(keys, function(key, arrayIndex){
           if(count >= limit){
                return false;
            }
            ret[key] = obj[key];
            count++;
        });
        return ret;
    };
}]);

})();