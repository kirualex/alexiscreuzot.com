'use strict';

// declare controller to myApp
myApp.controller('ScribblesController',function($scope, $http, $routeParams, $location){

    // Init error page
    var error_page;
    $http.get('partials/error.html').success(function(data) {
      error_page = data;
  });

    // Scribbles
    $scope.scribbles =
    [{
        id:0,
        title: "KALayoutHelper library",
        date: "13 Apr"
    },{
        id:1,
        title: "KASlideShow library",
        date: "22 May"
    },{
        id:2,
        title: "KANibHelper library",
        date: "24 May"
    },{
        id:3,
        title: "ColourLove Project, DRY KISS anyone?",
        date: "27 May"
    },{
        id:4,
        title: "Building the 7 Minute Workout App",
        date: "6 Jun"
    },{
        id:5,
        title: "Circular progress with KAProgressLabel",
        date: "12 Jun"
    },{
        id:6,
        title: "You are the only one seeing this page",
        date: "25 Jun"
    }];

    // Scribble detail
    if($routeParams.slug){
        Graphy.startLoading(120);
        $scope.scribble = $.grep($scope.scribbles,
            function(s){return $scope.slug(s.title) == $routeParams.slug || s.id == $routeParams.slug ; })[0];

        $http.get('scribbles/'+$scope.scribble.id+'.md').success(function(data) {
          var dataToParse = {text:data};

          $http({method: 'POST', url: 'https://api.github.com/markdown', data:angular.toJson(dataToParse), timeout:10*1000}).
          success(function(parsedData, status, headers, config) {

            var loc = $location.absUrl();
            var title  = $scope.scribble.title;
            var windowFeatures = 'height=450, width=550, top='+($(window).height()/2 - 225)
            +', left='+$(window).width()/2
            +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';

            // Twitter
            $('a.tweet').click(function(e){
              e.preventDefault();
              window.open('http://twitter.com/share?url=' + escape(loc)
                + '&text=' + escape(title) , 'twitterwindow', windowFeatures);
          });

            // Fb
            $('a.facebook').click(function(e){
              e.preventDefault();
              window.open('http://facebook.com/sharer.php?u=' + escape(loc), 'twitterwindow', windowFeatures);
          });

            $scope.scribble.content = parsedData;
              $('.article').addClass('trigger'); // anim
              Graphy.stopLoading();
          }).
error(function(data, status, headers, config) {
    $scope.scribble.content = error_page;
            $('.article').addClass('trigger'); // anim
            Graphy.stopLoading();
        });
});
}



    // Ready
    $scope.htmlReady();
});