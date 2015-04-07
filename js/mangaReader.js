(function() {

	var app = angular.module("mangaReader", ["ngRoute"]);	
	
	app.config(['$routeProvider', function($routeProvider) {
			$routeProvider.
			  when("/", {
			  		templateUrl: "partials/mangaReader.html",
      				controller: 'mangaReaderCtr'
    		  }).
			  when("/:manga", {
			  		templateUrl: "partials/mangaReader.html",
					controller: 'mangaReaderCtr'
			  }).
			  when("/:manga/:chapter", {
			  		templateUrl: "partials/mangaReader.html",
					controller: 'mangaReaderCtr'
			  }).
			  when("/:manga/:chapter/:page", {
			  		templateUrl: "partials/mangaReader.html",
					controller: 'mangaReaderCtr'
			  }).
			  otherwise({
				redirectTo: '/'
			  })
  	}]);
	
	
	app.controller("mangaReaderCtr", ['$scope', '$http', '$location', '$routeParams',
		function($scope, $http, $location, $routeParams){
			$scope.collection = {
				// mangas : [],
// 				current : {
// 					manga : {
// 						chapters : {
// 							pages : ["1.png", "2.png"]
// 						}
// 					}
// 				}
			};
			var $this = this;
			$this.manga = $routeParams.manga;
			$this.chapter = $routeParams.chapter;
			$this.page = $routeParams.page;
			$this.mangas = [];
			$this.chapters = [];
			$this.pages = [];
			
			$this.selectAction = function(sel) {
				if (sel == "manga") {
					$location.path($this.manga);
				} else if (sel == "chapter") {
					$location.path($this.manga + "/" + $this.chapter);
				} else if (sel == "page") {
					
					$location.path($this.manga + "/" + $this.chapter + "/" + $this.page.page);
				}
			};
			
			$http.get("api/getmangas.php").success(function(response) {
				$this.mangas = response.mangas;
			});
			
			if (this.manga) {
				$http.get("api/getchapters.php?manga=" + this.manga).success(function(response) {
					$this.chapters = response.chapters;
				});
			}
			
			if (this.manga && this.chapter) {
				$http.get("api/getpages.php?manga=" + this.manga + "&chapter=" + this.chapter).success(function(response) {
					$this.pages = response.pages;
				});
			}
	}]);

})();