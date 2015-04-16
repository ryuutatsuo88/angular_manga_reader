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
			pagesData : {},
			pages : [],
			img : null	
		};
		
		
		function setMangas(a) {
			factory.mangas = a;
		};
		
		function getMangas(done) {
			$http.get("api/getmangas.php").success(function(response) {
				setMangas(response.mangas);
				done();
			});
		};
		
		function setChapters(a) {
			factory.chapters = a;
			if (factory.chapter == null) {
				selectChapter(factory.chapters[0], function(){});
			}
		};
		
		function getChapters(done) {
			$http.get("api/getchapters.php?manga=" + factory.manga).success(function(response) {
				setChapters(response.chapters);
				done();
			});
		};
		
		function setPages(a) {
			factory.pages = [];
			for (var i = 0; i < a.length; i++) {
				factory.pagesData[a[i].page] = a[i];
				factory.pages.push(a[i].page);	
			}
			if (factory.page == null) {
				selectPage(factory.pages[0]);
			}
		};
		
		function getPages(done) {
			$http.get("api/getpages.php?manga=" + factory.manga + "&chapter=" + factory.chapter).success(function(response) {
				setPages(response.pages);
				done();
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
		
		function selectManga (m, done) {
			factory.manga = m;
			factory.chapters = [];
			factory.pages = [];
			factory.chapter = null;
			factory.page = null;
			getChapters(function () {
				done();
			});
		}; 
		
		function selectChapter (ch, done) {
			factory.chapter = ch;
			factory.page = null;
			factory.pages = [];
			getPages(function () {
				done();
			});
		};
		
		function selectPage (p) {
			factory.page = p;
			factory.img = factory.pagesData[p].img;
		};
		
		function init (m, ch, p) {
			if (factory.firsttime) {
				factory.firsttime = false;
				
				getMangas(function () {
					if (m) {
						selectManga(m, function () {
							if (ch) {
								selectChapter(ch, function () {
									if (p) {
										selectPage(p)
									}
								});
							}
						});
					}
				});
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
					$this.fact.selectManga($this.fact.data.manga, function(){});
					$location.path($this.fact.data.manga);
				} else if (sel == "chapter") {
					$this.fact.selectChapter($this.fact.data.chapter, function(){});
					$location.path($this.fact.data.manga + "/" + $this.fact.data.chapter);
				} else if (sel == "page") {
					$this.fact.selectPage($this.fact.data.page);
					$location.path($this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
				}
			};
			
			$this.navigate = function (direction) {
				var index = $this.fact.data.pages.indexOf($this.fact.data.page);
				if (direction == "next") {
					if (index + 1 < $this.fact.data.pages.length) {
						$this.fact.selectPage( $this.fact.data.pages[index + 1] );
						$location.path($this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
					} else if (index + 1 >= $this.fact.data.pages.length) {
						var chapIndex = $this.fact.data.chapters.indexOf($this.fact.data.chapter);
						if (chapIndex + 1 < $this.fact.data.chapters.length) {
							$this.fact.selectChapter($this.fact.data.chapters[chapIndex + 1], function(){
								$location.path($this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
							});
						}
					}
				} else {
					if (index - 1 > -1) {
						$this.fact.selectPage( $this.fact.data.pages[index - 1] );
						$location.path($this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
					} else if (index - 1 <= -1) {
						var chapIndex = $this.fact.data.chapters.indexOf($this.fact.data.chapter);
						if (chapIndex - 1 > -1) {
							$this.fact.selectChapter($this.fact.data.chapters[chapIndex - 1], function(){
								$location.path($this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
							});
						}
					}
				}
			};
	}]);

})();