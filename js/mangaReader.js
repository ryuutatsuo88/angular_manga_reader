(function() {
	var app = angular.module("mangaReader", ["ngRoute"]);
	
	app.factory('Collection', function($http) {
		var factory = {
			firsttime : true,
			manga : null,
			chapter : null,
			page : null,
			mangas : [],
			chapters : [],
			origPages : [],
			pages : [],
			current : {}	
		};
		
		
		function setMangas(a) {
			factory.mangas = a;
		};
		
		function getMangas() {
			$http.get("api/getmangas.php").success(function(response) {
				setMangas(response.mangas);
			});
		};
		
		function setChapters(a) {
			factory.chapters = a;
		};
		
		function getChapters() {
			$http.get("api/getchapters.php?manga=" + factory.manga).success(function(response) {
				setChapters(response.chapters)
			});
		};
		
		function setPages(a) {
			factory.pages = [];
			for (var i = 0; i < a.length; i++) {
				factory.pages.push(a[i].page);	
			}
		};
		
		function getPages() {
			$http.get("api/getpages.php?manga=" + factory.manga + "&chapter=" + factory.chapter).success(function(response) {
				factory.origPages = response.pages;
				setPages(response.pages);
			});
		};
		
		function setCurrent(manga) {
			factory.current = {};
			factory.current[manga] = {};
		};
		
		function setCurrentChapter(manga, ch) {
			setCurrent(manga);
			factory.current[manga][ch] = {};
		};
		
		function setCurrentPages(manga, ch, p) {
			setCurrentChapter(manga, ch);
			factory.current[manga][ch].pages = p;
		};
		
		function selectManga (m) {
			factory.manga = m;
			factory.chapter = null;
			factory.page = null;
			getChapters();
		}; 
		
		function selectChapter (ch) {
			factory.chapter = ch;
			getPages();
			factory.page = null;
		};
		
		function selectPage (p) {
			factory.page = p;
		};

// 				current : {
// 					"manganame" : {
// 						"chaptername" : {
// 							pages : ["1.png", "2.png"],
//							
// 						}
// 					}
// 				}
		
		function init (m, ch, p) {
			if (factory.firsttime) {
				factory.firsttime = false;
				factory.manga = m;
				factory.chapter = ch;
				factory.page = p;
				getMangas();
				getChapters();
				getPages();
			}
		};
		
		return {
			data : factory,
			init: init,
			setMangas: setMangas,
			getMangas: getMangas,
			setChapters: setChapters,
			getChapters: getChapters,
			setPages: setPages,
			getPages: getPages,
			setCurrent: setCurrent,
			setCurrentChapter: setCurrentChapter,
			setCurrentPages: setCurrentPages,
			selectManga: selectManga,
			selectChapter: selectChapter,
			selectPage: selectPage
		};
	});	
	
	app.config(['$routeProvider', function($routeProvider) {
			$routeProvider.
			  when("/", {
			  		template: " ",
      				controller: 'mangaReaderCtr'
    		  }).
			  when("/:manga", {
			  		template: " ",
					controller: 'mangaReaderCtr'
			  }).
			  when("/:manga/:chapter", {
			  		template: " ",
					controller: 'mangaReaderCtr'
			  }).
			  when("/:manga/:chapter/:page", {
			  		template: " ",
					controller: 'mangaReaderCtr'
			  })
  	}]);
	
	app.directive("mangaReader", function () {
		return {
			resrict: "E",
			replace: true,
			controller: "mangaReaderCtr",
			controllerAs: "mangaReader",
			templateUrl: "partials/mangaReader.html"
		};
	});
	
	app.controller("mangaReaderCtr", ['$scope', '$http', '$location', '$routeParams', 'Collection',
		function($scope, $http, $location, $routeParams, Collection){
			var $this = this;
			
			Collection.init($routeParams.manga, $routeParams.chapter, $routeParams.page);
			$this.fact = Collection;
			
			$this.selectAction = function(sel) {
				if (sel == "manga") {
					$this.fact.selectManga($this.fact.data.manga);
					$location.path($this.fact.data.manga);
				} else if (sel == "chapter") {
					$this.fact.selectChapter($this.fact.data.chapter);
					$location.path($this.fact.data.manga + "/" + $this.fact.data.chapter);
				} else if (sel == "page") {
					$this.fact.selectPage($this.fact.data.page);
					$location.path($this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
				}
			};
	}]);

})();