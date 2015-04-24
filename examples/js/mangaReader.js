(function() {
	var app = angular.module("mangaReader", ["ngRoute"]);
	
	app.factory('Collection', function($http) {
		var factory = {
			firsttime : true,
			manga : null,
			chapter : null,
			page : null,
			mangas : [],
			mangasData : {},
			chaptersData : {},
			chapters : [],
			pagesData : {},
			pages : [],
			img : null	
		};
		
		
		function setMangas(a) {
			factory.mangas = a;
		};
		
		function getMangas(done) {
			$http.get("https://www.mangaeden.com/api/list/0/").success(function(response) {
				var array = [];
				for (var i = 0; i < response.manga.length; i++) {
					factory.mangasData[response.manga[i].t] = response.manga[i];
					array.push(response.manga[i].t);
				}
				setMangas(array);
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
			$http.get("https://www.mangaeden.com/api/manga/" + factory.mangasData[factory.manga].i).success(function(response) {
				var array = [];
				for (var i = 0; i < response.chapters.length; i++) {
					factory.chaptersData[zeroFill(response.chapters[i][0], 4)] = response.chapters[i];
					array.push(zeroFill(response.chapters[i][0], 4));
				}
				
				setChapters(array.sort());
				done();
			});
		};
		
		function setPages(a) {
			factory.pages = [];
			for (var i = 0; i < a.length; i++) {
				factory.pagesData[zeroFill(a[i][0], 3)] = a[i];
				factory.pages.push(zeroFill(a[i][0], 3));	
			}
			factory.pages.sort();
			if (factory.page == null) {
				selectPage(factory.pages[0]);
			}
		};
		
		function getPages(done) {
			$http.get("https://www.mangaeden.com/api/chapter/" + factory.chaptersData[factory.chapter][3]).success(function(response) {
				setPages(response.images);
				done();
			});
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
			factory.img = "https://cdn.mangaeden.com/mangasimg/" + factory.pagesData[p][1];
		};
		
		function zeroFill( number, width ) {
		  width -= number.toString().length;
		  if ( width > 0 )
		  {
			return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
		  }
		  return number + ""; // always return a string
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
			} else if (!factory.firsttime && m){
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
			selectManga: selectManga,
			selectChapter: selectChapter,
			selectPage: selectPage
		};
	});	
	
	app.config(['$routeProvider', function($routeProvider) {
			$routeProvider.
    		  when("/mangareader", {
			  		templateUrl: "partials/mangaReader.html",
      				controller: 'mangaReaderCtr'
    		  }).
			  when("/mangareader/:manga", {
			  		templateUrl: "partials/mangaReader.html",
					controller: 'mangaReaderCtr'
			  }).
			  when("/mangareader/:manga/:chapter", {
			  		templateUrl: "partials/mangaReader.html",
					controller: 'mangaReaderCtr'
			  }).
			  when("/mangareader/:manga/:chapter/:page", {
			  		templateUrl: "partials/mangaReader.html",
					controller: 'mangaReaderCtr'
			  })
  	}]);

	
	app.controller("mangaReaderCtr", ['$scope', '$http', '$location', '$routeParams', 'Collection',
		function($scope, $http, $location, $routeParams, Collection){
			var $this = this;
			
			Collection.init($routeParams.manga, $routeParams.chapter, $routeParams.page);
			$this.fact = Collection;
			
			$this.selectAction = function(sel) {
				if (sel == "manga") {
					$this.fact.selectManga($this.fact.data.manga, function(){});
					$location.path("mangareader/" + $this.fact.data.manga);
				} else if (sel == "chapter") {
					$this.fact.selectChapter($this.fact.data.chapter, function(){});
					$location.path("mangareader/" + $this.fact.data.manga + "/" + $this.fact.data.chapter);
				} else if (sel == "page") {
					$this.fact.selectPage($this.fact.data.page);
					$location.path("mangareader/" + $this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
				}
			};
			
			$this.navigate = function (direction) {
				var index = $this.fact.data.pages.indexOf($this.fact.data.page);
				if (direction == "next") {
					if (index + 1 < $this.fact.data.pages.length) {
						$this.fact.selectPage( $this.fact.data.pages[index + 1] );
						$location.path("mangareader/" + $this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
					} else if (index + 1 >= $this.fact.data.pages.length) {
						var chapIndex = $this.fact.data.chapters.indexOf($this.fact.data.chapter);
						if (chapIndex + 1 < $this.fact.data.chapters.length) {
							$this.fact.selectChapter($this.fact.data.chapters[chapIndex + 1], function(){
								$location.path("mangareader/" + $this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
							});
						}
					}
				} else {
					if (index - 1 > -1) {
						$this.fact.selectPage( $this.fact.data.pages[index - 1] );
						$location.path("mangareader/" + $this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
					} else if (index - 1 <= -1) {
						var chapIndex = $this.fact.data.chapters.indexOf($this.fact.data.chapter);
						if (chapIndex - 1 > -1) {
							$this.fact.selectChapter($this.fact.data.chapters[chapIndex - 1], function(){
								$location.path("mangareader/" + $this.fact.data.manga + "/" + $this.fact.data.chapter + "/" + $this.fact.data.page);
							});
						}
					}
				}
			};
	}]);

})();